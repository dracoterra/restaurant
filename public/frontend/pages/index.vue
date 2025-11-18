<template>
  <div>
    <PagesHomeHeroSection
      :subtitle="acf?.heroSubtitle"
      :title="acf?.heroTitle"
      :description="acf?.heroDescription"
      :main-image="acf?.heroMainImage"
      :video-src="acf?.heroVideo?.url || acf?.heroVideo?.sourceUrl"
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

    <PagesHomeDailyOfferSection
      :subtitle="acf?.dailyOfferSubtitle"
      :title="acf?.dailyOfferTitle"
      :description="acf?.dailyOfferDescription"
      :image="acf?.dailyOfferImage"
      :features="acf?.dailyOfferFeatures"
      :burger-title="acf?.dailyOfferBurgerTitle"
      :burger-features="acf?.dailyOfferBurgerFeatures"
    />

    <PagesHomeOurMenuSection
      :subtitle="acf?.menuSubtitle"
      :title="acf?.menuTitle"
    />

    <PagesHomeIntroVideoSection
      :video-bg="acf?.introVideoBg?.url || acf?.introVideoBg?.sourceUrl"
      :video-url="acf?.introVideoUrl"
    />

    <PagesHomeOurIngredientsSection
      :subtitle="acf?.ingredientsSubtitle"
      :title="acf?.ingredientsTitle"
      :description="acf?.ingredientsDescription"
      :image="acf?.ingredientsImage"
      :features="acf?.ingredientsFeatures"
      :happy-customers-count="acf?.ingredientsHappyCustomers"
      :customer-images="acf?.ingredientsCustomerImages?.nodes || acf?.ingredientsCustomerImages"
      :counters="acf?.ingredientsCounters"
    />

    <PagesHomeOurTestimonialSection
      :subtitle="acf?.testimonialSubtitle"
      :title="acf?.testimonialTitle"
      :testimonials="acf?.testimonials"
    />

    <PagesHomeOurBlogSection :posts="blogPosts" />

    <PagesHomeReserveTableSection
      :subtitle="acf?.reserveSubtitle"
      :title="acf?.reserveTitle"
      :hours="acf?.reserveHours"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  ssr: false
})

import { ref, computed, onMounted } from 'vue'
import { usePagesStore, type Page } from '~/stores/pages'
import { useInsightsStore } from '~/stores/insights'

const pagesStore = usePagesStore()
const insightsStore = useInsightsStore()

const page = ref<Page | null>(null)
const acf = computed(() => page.value?.acf?.homePageSections)

const blogPosts = computed(() => {
  if (!insightsStore.insights || !Array.isArray(insightsStore.insights)) {
    return []
  }
  return insightsStore.insights.slice(0, 3)
})

const initScripts = () => {
  if (process.client) {
    setTimeout(() => {
      if ((window as any).WOW) {
        new (window as any).WOW().init()
      }
      
      if ((window as any).jQuery) {
        const $ = (window as any).jQuery
        if ($.fn.counterUp) {
          $('.counter').counterUp({
            delay: 10,
            time: 2000
          })
        }
        
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
    await Promise.all([
      pagesStore.fetchPageBySlug('home').catch(() => null).then(p => { page.value = p }),
      insightsStore.fetchInsights({ limit: 3 }).catch(() => {})
    ])
    
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
    
    initScripts()
  } catch (error) {
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
