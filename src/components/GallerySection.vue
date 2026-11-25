<script>
import SITE from '@site-config'
import BeforeAfterSlider from './BeforeAfterSlider.vue'
import { galleryCategories, asset } from '@/utils/site'

export default {
  name: 'GallerySection',

  components: { BeforeAfterSlider },

  props: {
    site: { type: Object, default: () => SITE }
  },

  data: () => ({
    // '' = all categories
    activeCategory: ''
  }),

  computed: {
    projects () {
      return this.site.projects || []
    },
    // Filter buttons are generated from the categories actually present, so
    // there's never a button that shows nothing
    categories () {
      return galleryCategories(this.projects)
    },
    visibleProjects () {
      return this.activeCategory
        ? this.projects.filter(project => project.category === this.activeCategory)
        : this.projects
    },
    // At least one before/after pair (anything without a single image)
    hasSlider () {
      return this.projects.some(project => !this.isSinglePhoto(project))
    },
    imageSize () {
      return this.site.galleryImageSize || { width: 1200, height: 900 }
    },
    // Announced politely to screen readers after a filter change
    resultText () {
      const count = this.visibleProjects.length
      const what = this.activeCategory || 'all categories'
      return `Showing ${count} ${count === 1 ? 'project' : 'projects'} in ${what}`
    }
  },

  methods: {
    asset,
    /**
     * A project with a single `image` is a finished-photo card; otherwise
     * it's a before/after slider (build/site-build.js validateProjects makes
     * sure every entry is exactly one of the two)
     * @param {object} project
     * @returns {boolean}
     */
    isSinglePhoto (project) {
      return typeof project.image === 'string' && project.image.trim() !== ''
    },
    /**
     * The same 4:3 (or per-project) frame the slider uses, so both card
     * types line up in the grid
     * @param {object} project
     * @returns {object}
     */
    frameStyle (project) {
      return { aspectRatio: `${project.width || this.imageSize.width} / ${project.height || this.imageSize.height}` }
    }
  }
}
</script>

<style scoped>
/* Filter buttons: real <button>s with aria-pressed, so keyboard and screen
   reader users get the same toggle behaviour as mouse users */
.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: 0 0 28px;
}

.chip {
  min-height: 44px;
  padding: 8px 18px;
  border-radius: 999px;
  border: 2px solid var(--color-primary);
  background-color: var(--color-surface);
  color: var(--color-primary);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.chip[aria-pressed='true'] {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
}

.category {
  display: inline-block;
  margin-top: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-accent-text);
}

/* Single finished-photo card (project.image). Same frame, radius and caption
   as BeforeAfterSlider.vue, so the two card types sit evenly in one grid. */
.photo {
  margin: 0;
}

.photo__frame {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: var(--radius) var(--radius) 0 0;
  background-color: var(--color-background);
}

.photo__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Same dark chip as the slider's "Before" / "After" labels */
.photo__tag {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 10px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.72);
  color: #FFFFFF;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  pointer-events: none;
}

.photo__caption {
  padding: 14px 16px;
}

.photo__title {
  font-family: var(--font-body);
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

</style>

<template>
  <section id="projects" class="section" aria-labelledby="projects-title">
    <div class="container-narrow">
      <h2 id="projects-title" class="section-title">Recent Projects</h2>
      <!-- Slider instructions only when there is a slider to drag -->
      <p v-if="hasSlider" class="section-lead">Drag the slider (or use the arrow keys) to compare before and after.</p>

      <div v-if="categories.length > 1" class="filters" role="group" aria-label="Filter projects by category">
        <button
          type="button"
          class="chip"
          :aria-pressed="activeCategory === '' ? 'true' : 'false'"
          @click="activeCategory = ''"
        >All</button>
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          class="chip"
          :aria-pressed="activeCategory === category ? 'true' : 'false'"
          @click="activeCategory = category"
        >{{ category }}</button>
      </div>

      <p class="sr-only" aria-live="polite">{{ resultText }}</p>

      <ul class="grid" style="--min: 300px; list-style: none; padding: 0; margin: 0;">
        <li
          v-for="(project, index) in visibleProjects"
          :key="`${activeCategory}-${index}-${project.title}`"
          class="card project"
        >
          <!-- A single finished photo: no slider, a "Finished" label instead.
               The label is aria-hidden; the alt text carries "Finished:" so
               screen readers get the same information. -->
          <figure v-if="isSinglePhoto(project)" class="photo">
            <div class="photo__frame" :style="frameStyle(project)">
              <img
                class="photo__img"
                :src="asset(project.image)"
                :alt="`Finished: ${project.alt || project.title}`"
                :width="project.width || imageSize.width"
                :height="project.height || imageSize.height"
                loading="lazy"
                decoding="async"
              >
              <span class="photo__tag" aria-hidden="true">Finished</span>
            </div>
            <figcaption class="photo__caption">
              <p class="photo__title">{{ project.title }}</p>
              <span class="category">{{ project.category }}</span>
            </figcaption>
          </figure>
          <BeforeAfterSlider
            v-else
            :title="project.title"
            :before="asset(project.beforeSrc)"
            :after="asset(project.afterSrc)"
            :alt="project.alt"
            :width="project.width || imageSize.width"
            :height="project.height || imageSize.height"
          >
            <span class="category">{{ project.category }}</span>
          </BeforeAfterSlider>
        </li>
      </ul>
    </div>
  </section>
</template>
