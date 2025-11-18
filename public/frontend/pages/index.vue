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
import { usePagesStore } from '~/stores/pages'
import { useInsightsStore } from '~/stores/insights'
import { useSettingsStore } from '~/stores/settings'
import { useSEO, generateOrganizationStructuredData } from '~/composables/useSEO'

definePageMeta({
  ssr: false
})

const pagesStore = usePagesStore()
const insightsStore = useInsightsStore()
const settingsStore = useSettingsStore()

// Cargar datos
onMounted(async () => {
  try {
    await Promise.all([
      pagesStore.fetchPageBySlug('home'),
      insightsStore.fetchInsights({ limit: 3 }),
      settingsStore.fetchSettings()
    ])
  } catch (error) {
    // Error manejado por stores
  }
})

// Obtener datos
const page = computed(() => pagesStore.currentPage)
const acf = computed(() => page.value?.acf?.homePageSections)
const blogPosts = computed(() => insightsStore.insights.slice(0, 3))
const settings = computed(() => settingsStore.settings)

// SEO y Structured Data
watch([page, settings], ([newPage, newSettings]) => {
  if (newPage && newSettings) {
    // SEO básico
    useSEO({
      title: newPage.seo?.title || newPage.title,
      description: newPage.seo?.metaDesc || newPage.excerpt,
      image: newPage.featuredImage?.url,
      type: 'website'
    })
    
    // Structured Data para organización
    const orgData = generateOrganizationStructuredData({
      name: newSettings.siteInfo?.name || 'Restaurant',
      url: newSettings.siteInfo?.url || 'http://localhost:3000',
      logo: newSettings.logo,
      description: newSettings.siteInfo?.description,
      address: {
        streetAddress: newSettings.address,
        addressLocality: 'Kentucky',
        addressCountry: 'US'
      },
      contactPoint: {
        telephone: newSettings.phone,
        email: newSettings.email,
        contactType: 'Customer Service'
      }
    })
    
    useSEO({}, orgData)
  }
}, { immediate: true })
</script>
