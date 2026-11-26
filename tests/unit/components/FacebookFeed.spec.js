/**
 * Facebook section: the fallback card's layout state and the Follow button.
 * jsdom has no layout (every width is 0), so actual overflow is measured in
 * a real browser by scripts/check-overflow.js (npm run check:overflow).
 */
import { mount } from '@vue/test-utils'
import FacebookFeed from '@/components/FacebookFeed.vue'
import { makeSite } from '../fixtures/site'

const mountFeed = () => mount(FacebookFeed, { propsData: { site: makeSite() } })
// Loading starts in mounted(); the iframe appears on the next render
const mountLoaded = async () => {
  const wrapper = mountFeed()
  await wrapper.vm.$nextTick()
  return wrapper
}

describe('FacebookFeed.vue', () => {
  afterEach(() => {
    delete window.IntersectionObserver
    jest.useRealTimers()
  })

  describe('before the plugin starts loading', () => {
    beforeEach(() => {
      // An observer that never fires: the section is still off screen
      window.IntersectionObserver = class {
        observe () {}
        disconnect () {}
      }
    })

    it('shows only the card, laid out alone so it takes the whole column', () => {
      const wrapper = mountFeed()
      expect(wrapper.find('iframe').exists()).toBe(false)
      expect(wrapper.find('.feed').classes()).toContain('feed--solo')
    })
  })

  describe('once loading starts (no IntersectionObserver: loads at once)', () => {
    it('adds the plugin beside the card', async () => {
      const wrapper = await mountLoaded()
      expect(wrapper.find('iframe.feed__frame').exists()).toBe(true)
      expect(wrapper.find('.feed').classes()).not.toContain('feed--solo')
    })

    it('goes back to the card alone when the plugin fails to load', async () => {
      jest.useFakeTimers()
      const wrapper = await mountLoaded()
      jest.advanceTimersByTime(10000)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('iframe').exists()).toBe(false)
      expect(wrapper.find('.feed').classes()).toContain('feed--solo')
      expect(wrapper.find('[role="status"]').exists()).toBe(true)
    })

    it('keeps the card when the plugin loads in time', async () => {
      jest.useFakeTimers()
      const wrapper = await mountLoaded()
      await wrapper.find('iframe').trigger('load')
      jest.advanceTimersByTime(10000)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('iframe').exists()).toBe(true)
    })
  })

  describe('Follow button', () => {
    it('links to the Facebook page in a new tab', () => {
      const button = mountFeed().find('.fallback a.btn')
      expect(button.attributes('href')).toBe(makeSite().facebookUrl)
      expect(button.attributes('target')).toBe('_blank')
      expect(button.text()).toContain('Follow on Facebook')
    })

    it('keeps its icon separate from the large card icon', () => {
      // The large icon's style (primary colour, 3rem) is keyed to
      // .fallback__icon; it used to match the button icon too, which then
      // matched the button's background and disappeared
      const wrapper = mountFeed()
      const icons = wrapper.findAll('.fallback .mdi-facebook').wrappers
      expect(icons.length).toBe(2)
      expect(icons[0].classes()).toContain('fallback__icon')
      expect(icons[1].classes()).not.toContain('fallback__icon')
      expect(icons[1].element.closest('.btn')).not.toBeNull()
    })
  })
})
