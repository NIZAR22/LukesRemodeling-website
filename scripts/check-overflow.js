#!/usr/bin/env node
/*
  check-overflow.js: horizontal-overflow check in a real browser.

  jsdom (the unit tests) has no layout, so widths can only be measured in a
  browser. This drives a locally installed Edge or Chrome over the DevTools
  protocol (no extra packages: Node 22's built-in fetch and WebSocket) and,
  at each phone width, loads the page and scrolls through it so the lazy
  sections mount. Then it checks:

    FAIL  any element whose box sticks out past the viewport. The page may
          hide that overflow instead of scrolling, so the page's own
          scrollWidth is not enough.
    FAIL  #facebook: the card, its heading or its button wider than the card
          or the section (scrollWidth > clientWidth, or the right edge past
          the section). This runs twice: on a fresh load, and after loading
          at desktop width and then narrowing (resize or rotation), which is
          when a plugin measured wide used to push the card off screen.
    WARN  content clipped inside its own box (overflow hidden or clip),
          for example a label cut off with an ellipsis.

  Elements that are off screen on purpose are skipped: .sr-only text, the
  closed menu drawer, the quote form's honeypot (.hp) and anything inside
  iframes.

  Usage (with npm run serve running):
    npm run check:overflow                         http://localhost:8080/, 320,375,414
    npm run check:overflow -- http://localhost:8081/ 320,375
  Exits with 1 if anything FAILs.
*/
const { spawn } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')

const url = process.argv[2] || 'http://localhost:8080/'
const widths = (process.argv[3] || '320,375,414').split(',').map(Number)
const DESKTOP = 1280
const PORT = 9300 + Math.floor(Math.random() * 600)

const BROWSERS = [
  process.env.CHROME_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/microsoft-edge'
]

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

// Runs inside the page: scrolls through it so every lazy section mounts
const SCROLL_ALL = `(async () => {
  for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
    scrollTo(0, y)
    await new Promise(r => setTimeout(r, 120))
  }
  await new Promise(r => setTimeout(r, 800))
  scrollTo(0, 0)
})()`

// Runs inside the page: returns { fail: [], warn: [] }
const MEASURE = `(() => {
  const vw = document.documentElement.clientWidth
  const fail = [], warn = []
  const skip = '.sr-only, #menu-drawer, .drawer-scrim, .hp, iframe, script, style'
  const label = el => {
    const where = el.closest('section[id], header, footer')
    const cls = typeof el.className === 'string' && el.className.trim()
      ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.') : ''
    const text = (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 40)
    return (where ? '#' + (where.id || where.tagName.toLowerCase()) + ' ' : '') +
      el.tagName.toLowerCase() + cls + (text ? ' "' + text + '"' : '')
  }
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest(skip)) continue
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden') continue
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height) continue
    if (r.right > vw + 1 || r.left < -1) {
      fail.push(label(el) + ': spans x ' + Math.round(r.left) + '..' + Math.round(r.right) + ', viewport is ' + vw)
    }
    // Text clipped inside its own box. Small icon-font overhangs (a few px,
    // overflow visible) are normal and ignored.
    if (/hidden|clip/.test(cs.overflowX) && el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 1) {
      warn.push(label(el) + ': content ' + el.scrollWidth + 'px clipped to ' + el.clientWidth + 'px')
    }
  }
  const fb = document.getElementById('facebook')
  if (fb) {
    const card = fb.querySelector('.fallback')
    const right = fb.getBoundingClientRect().right
    for (const el of card ? [card, ...card.querySelectorAll('h3, .btn')] : []) {
      if (el.scrollWidth > el.clientWidth + 1) fail.push(label(el) + ': scrollWidth ' + el.scrollWidth + ' > clientWidth ' + el.clientWidth)
      if (el.getBoundingClientRect().right > right + 1) fail.push(label(el) + ': right edge ' + Math.round(el.getBoundingClientRect().right) + ' past the section (' + Math.round(right) + ')')
    }
  }
  return { fail: [...new Set(fail)], warn: [...new Set(warn)] }
})()`

async function connect (port) {
  for (let i = 0; i < 60; i++) {
    try {
      const page = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t => t.type === 'page')
      if (page) {
        const ws = new WebSocket(page.webSocketDebuggerUrl)
        await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject })
        return ws
      }
    } catch (e) { /* browser still starting */ }
    await sleep(250)
  }
  throw new Error('Could not connect to the browser')
}

async function main () {
  const browser = BROWSERS.find(p => p && fs.existsSync(p))
  if (!browser) throw new Error('No Edge or Chrome found; set CHROME_PATH')
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'check-overflow-'))
  const proc = spawn(browser, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' })

  try {
    const ws = await connect(PORT)
    let id = 0
    const pending = new Map()
    ws.onmessage = event => {
      const msg = JSON.parse(event.data)
      if (pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id) }
    }
    const send = (method, params = {}) => new Promise(resolve => {
      const n = ++id
      pending.set(n, resolve)
      ws.send(JSON.stringify({ id: n, method, params }))
    })
    const evaluate = async expression => {
      const { result } = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.text)
      return result.result.value
    }
    // Emulation sets the exact viewport; a headless window can't go below ~500px
    const viewport = width => send('Emulation.setDeviceMetricsOverride', { width, height: 800, deviceScaleFactor: 1, mobile: width < 768 })
    const load = async width => {
      await viewport(width)
      await send('Page.navigate', { url })
      await sleep(2500)
      await evaluate(SCROLL_ALL)
    }

    let failures = 0
    const report = (title, { fail, warn }) => {
      console.log(`\n${title}: ${fail.length ? 'FAIL' : 'ok'}`)
      fail.forEach(line => console.log('  FAIL  ' + line))
      warn.forEach(line => console.log('  WARN  ' + line))
      failures += fail.length
    }

    for (const width of widths) {
      await load(width)
      report(`${width}px, fresh load`, await evaluate(MEASURE))

      // Loaded wide, then narrowed without reloading
      await load(DESKTOP)
      await viewport(width)
      await sleep(1200)
      const resized = await evaluate(MEASURE)
      // The page-wide scan was done above; here only #facebook matters
      report(`${width}px, loaded at ${DESKTOP}px then narrowed (#facebook only)`, {
        fail: resized.fail.filter(line => line.startsWith('#facebook')),
        warn: []
      })
    }

    console.log(failures ? `\ncheck-overflow: FAILED (${failures})` : '\ncheck-overflow: PASSED')
    process.exitCode = failures ? 1 : 0
    ws.close()
  } finally {
    proc.kill()
  }
}

main().catch(error => {
  console.error('check-overflow: ' + error.message)
  process.exitCode = 1
})
