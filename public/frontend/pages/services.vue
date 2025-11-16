<template>
  <div>
    <!-- Page Header Start -->
    <SectionsPageHeader title="Services" />
    <!-- Page Header End -->

    <!-- Services Section Start -->
    <div class="services">
      <div class="container">
        <div class="row section-row">
          <div class="col-lg-12">
            <!-- Section Title Start -->
            <div class="section-title">
              <h3 class="wow fadeInUp">{{ acf?.servicesSubtitle || 'our services' }}</h3>
              <h2 class="text-anime-style-2" data-cursor="-opaque">
                {{ acf?.servicesTitle || 'What we offer' }}
              </h2>
              <p class="wow fadeInUp" data-wow-delay="0.2s" v-if="acf?.servicesDescription">
                {{ acf.servicesDescription }}
              </p>
              <p class="wow fadeInUp" data-wow-delay="0.2s" v-else>
                We provide exceptional dining experiences with a range of services designed to make your visit memorable.
              </p>
            </div>
            <!-- Section Title End -->
          </div>
        </div>

        <div class="row">
          <div 
            v-for="(service, index) in services" 
            :key="service.id"
            class="col-lg-4 col-md-6"
          >
            <!-- Service Item Start -->
            <div class="service-item wow fadeInUp" :data-wow-delay="`${index * 0.2}s`">
              <div class="icon-box">
                <img :src="service.icon" :alt="service.title" />
              </div>
              <div class="service-item-content">
                <h3>{{ service.title }}</h3>
                <p>{{ service.description }}</p>
              </div>
              <div class="service-readmore-btn">
                <NuxtLink :to="service.link" class="readmore-btn">read more</NuxtLink>
              </div>
            </div>
            <!-- Service Item End -->
          </div>
        </div>
      </div>
    </div>
    <!-- Services Section End -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePagesStore, type Page } from '~/stores/pages'

// Meta tags
const pagesStore = usePagesStore()
const page = ref<Page | null>(null)

// Computed para obtener campos ACF
const acf = computed(() => page.value?.acf?.servicesPageSections)

const services = ref([
  {
    id: 1,
    title: 'Dine-In Experience',
    description: 'Enjoy a cozy and vibrant ambiance with impeccable service and delicious meals crafted to perfection.',
    icon: '/images/icon-service-1.svg',
    link: '/services/dine-in'
  },
  {
    id: 2,
    title: 'Online Table Reservations',
    description: 'Reserve your table effortlessly through our online booking system for a seamless dining experience.',
    icon: '/images/icon-service-2.svg',
    link: '/services/reservations'
  },
  {
    id: 3,
    title: 'Home Delivery Service',
    description: 'Savor your favorite dishes in the comfort of your home with our reliable and quick delivery service.',
    icon: '/images/icon-service-3.svg',
    link: '/services/delivery'
  },
  {
    id: 4,
    title: 'Catering for Events',
    description: 'From small gatherings to grand celebrations, let us bring our culinary excellence to your special event.',
    icon: '/images/icon-service-4.svg',
    link: '/services/catering'
  },
  {
    id: 5,
    title: 'Takeout Orders',
    description: 'Convenient and fast takeout options for when you're on the go but still craving our flavors.',
    icon: '/images/icon-service-5.svg',
    link: '/services/takeout'
  },
  {
    id: 6,
    title: 'Private Dining',
    description: 'Host intimate gatherings or private events in our dedicated dining space tailored to your needs.',
    icon: '/images/icon-service-6.svg',
    link: '/services/private-dining'
  }
])

onMounted(async () => {
  try {
    // Obtener página por slug
    page.value = await pagesStore.fetchPageBySlug('services')
    
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
        title: 'Services - Restaurant',
        meta: [
          { name: 'description', content: acf.value?.servicesDescription || 'Our restaurant services' }
        ]
      })
    }
    
    // Inicializar animaciones
    if (process.client) {
      setTimeout(() => {
        if ((window as any).WOW) {
          new (window as any).WOW().init()
        }
      }, 500)
    }
  } catch (error) {
    console.error('Error loading services page:', error)
  }
})
</script>

