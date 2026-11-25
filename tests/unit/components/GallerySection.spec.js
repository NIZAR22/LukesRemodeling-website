import { mount } from '@vue/test-utils'
import GallerySection from '@/components/GallerySection.vue'
import { makeSite } from '../fixtures/site'

describe('GallerySection.vue', () => {
  const mountGallery = site => mount(GallerySection, { propsData: { site: site || makeSite() } })
  const chips = wrapper => wrapper.findAll('.chip')

  it('makes one filter button per category present, plus All', () => {
    expect(chips(mountGallery()).wrappers.map(c => c.text())).toEqual(['All', 'Flooring', 'Carpentry'])
  })

  it('shows every project at first, with All pressed', () => {
    const wrapper = mountGallery()
    expect(wrapper.findAll('.project').length).toBe(3)
    expect(chips(wrapper).at(0).attributes('aria-pressed')).toBe('true')
  })

  it('filters by category, marks the pressed button and announces the result', async () => {
    const wrapper = mountGallery()
    await chips(wrapper).at(2).trigger('click')

    expect(wrapper.findAll('.project').length).toBe(2)
    expect(chips(wrapper).at(2).attributes('aria-pressed')).toBe('true')
    expect(chips(wrapper).at(0).attributes('aria-pressed')).toBe('false')
    expect(wrapper.find('[aria-live="polite"]').text()).toBe('Showing 2 projects in Carpentry')
  })

  it('uses real buttons, so the filters work from the keyboard', () => {
    chips(mountGallery()).wrappers.forEach(chip => {
      expect(chip.element.tagName).toBe('BUTTON')
      expect(chip.attributes('type')).toBe('button')
    })
  })

  it('hides the filters when there is only one category', () => {
    const site = makeSite({ projects: [makeSite().projects[0]] })
    expect(chips(mountGallery(site)).length).toBe(0)
  })
})

describe('GallerySection.vue single-photo cards', () => {
  const mountGallery = site => mount(GallerySection, { propsData: { site } })
  const chips = wrapper => wrapper.findAll('.chip')
  const single = { title: 'Porch ceiling', category: 'Carpentry', image: 'images/p4.jpg', alt: 'pine porch ceiling' }
  const pair = makeSite().projects[0] // Kitchen floor, Flooring, before/after

  it('renders an image entry as a photo card with a Finished label and no slider', () => {
    const wrapper = mountGallery(makeSite({ projects: [single] }))
    const card = wrapper.find('.project')
    const img = card.find('img')

    expect(card.find('.photo').exists()).toBe(true)
    expect(card.find('.ba').exists()).toBe(false)
    expect(card.find('input[type="range"]').exists()).toBe(false)
    expect(card.findAll('img').length).toBe(1)
    expect(img.attributes('src')).toBe('./images/p4.jpg')
    expect(img.attributes('alt')).toBe('Finished: pine porch ceiling')
    expect(img.attributes('loading')).toBe('lazy')
    expect(card.find('.photo__tag').text()).toBe('Finished')
    expect(card.find('.photo__title').text()).toBe('Porch ceiling')
    expect(card.find('.category').text()).toBe('Carpentry')
  })

  it('uses the same frame size as the slider cards', () => {
    const wrapper = mountGallery(makeSite({ projects: [single, pair], galleryImageSize: { width: 1200, height: 900 } }))
    const img = wrapper.find('.photo img')
    expect(img.attributes('width')).toBe('1200')
    expect(img.attributes('height')).toBe('900')
    // jsdom drops the aspect-ratio property from inline styles, so check the
    // style object the frame is bound to instead
    expect(wrapper.vm.frameStyle(single)).toEqual({ aspectRatio: '1200 / 900' })
  })

  it('renders mixed lists in config order, one card type per entry', () => {
    const wrapper = mountGallery(makeSite({ projects: [pair, single] }))
    const cards = wrapper.findAll('.project')
    expect(cards.length).toBe(2)
    expect(cards.at(0).find('.ba').exists()).toBe(true)
    expect(cards.at(1).find('.photo').exists()).toBe(true)
  })

  it('treats single cards the same as pairs in the category filters', async () => {
    const wrapper = mountGallery(makeSite({ projects: [pair, single] }))
    expect(chips(wrapper).wrappers.map(c => c.text())).toEqual(['All', 'Flooring', 'Carpentry'])

    await chips(wrapper).at(2).trigger('click')
    const cards = wrapper.findAll('.project')
    expect(cards.length).toBe(1)
    expect(cards.at(0).find('.photo').exists()).toBe(true)
    expect(wrapper.find('[aria-live="polite"]').text()).toBe('Showing 1 project in Carpentry')
  })

  it('shows the slider instructions only when there is a before/after pair', () => {
    expect(mountGallery(makeSite({ projects: [single] })).find('.section-lead').exists()).toBe(false)
    expect(mountGallery(makeSite({ projects: [single, pair] })).find('.section-lead').exists()).toBe(true)
  })
})
