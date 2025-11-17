<template>
  <div>
    <PagesHomeHeroSection
      :subtitle="acf?.heroSubtitle"
      :title="acf?.heroTitle"
      :description="acf?.heroDescription"
      :main-image="acf?.heroMainImage"
    />

    <PagesHomeAboutUsSection
      :subtitle="acf?.aboutSubtitle"
      :title="acf?.aboutTitle"
      :description="acf?.aboutDescription"
    />

    <PagesHomeOurDishesSection
      :subtitle="acf?.dishesSubtitle"
      :title="acf?.dishesTitle"
    />

    <PagesHomeDailyOfferSection />

    <PagesHomeOurMenuSection />

    <PagesHomeIntroVideoSection />

    <PagesHomeOurIngredientsSection />

    <PagesHomeOurTestimonialSection />

    <PagesHomeOurBlogSection :posts="blogPosts" />

    <PagesHomeReserveTableSection />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePagesStore, type Page } from '~/stores/pages'
import { useInsightsStore } from '~/stores/insights'

// Stores
const pagesStore = usePagesStore()
const insightsStore = useInsightsStore()

// Page data
const page = ref<Page | null>(null)
const acf = computed(() => page.value?.acf?.homePageSections)

// Blog posts (desde insights)
const blogPosts = computed(() => insightsStore.insights.slice(0, 3))

// Initialize scripts
const initScripts = () => {
  if (process.client) {
    setTimeout(() => {
      // WOW animations
      if ((window as any).WOW) {
        new (window as any).WOW().init()
      }
      
      // Counters
      if ((window as any).jQuery) {
        const $ = (window as any).jQuery
        if ($.fn.counterUp) {
          $('.counter').counterUp({
            delay: 10,
            time: 2000
          })
        }
      }
      
      // Video popup
      if ((window as any).jQuery) {
        const $ = (window as any).jQuery
        if ($.fn.magnificPopup) {
          $('.popup-video').magnificPopup({
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
          })
        }
      }
    }, 500)
  }
}

onMounted(async () => {
  try {
    // Obtener página Home y insights
    await Promise.all([
      pagesStore.fetchPageBySlug('home').catch(() => null).then(p => { page.value = p }),
      insightsStore.fetchInsights({ limit: 3 }).catch(() => {
        console.warn('Error loading insights, using empty array')
      })
    ])
    
    // Actualizar meta tags si hay SEO
    if (page.value?.seo?.title) {
      useHead({
        title: page.value.seo.title,
        meta: [
          { name: 'description', content: page.value.seo.metaDesc || page.value.excerpt }
        ]
      })
    } else {
      useHead({
        title: 'Home - Restaurant',
        meta: [
          { name: 'description', content: acf.value?.heroDescription || 'Dining redefined with every bite' }
        ]
      })
    }
    
    // Inicializar scripts
    initScripts()
  } catch (error) {
    console.error('Error loading home page:', error)
    useHead({
      title: 'Home - Restaurant',
      meta: [
        { name: 'description', content: 'Dining redefined with every bite' }
      ]
    })
    initScripts()
  }
})
</script>
