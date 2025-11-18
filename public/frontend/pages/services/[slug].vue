<template>
  <div>
    <!-- Page Header Start -->
    <SectionsPageHeader :title="service?.title || 'Service Details'" />
    <!-- Page Header End -->

    <!-- Page Service Single Start -->
    <div class="page-service-single">
      <div class="container">
        <div class="row">
          <div class="col-lg-4">
            <!-- Service Sidebar Start -->
            <div class="service-sidebar">
              <!-- Service Category List Start -->
              <div class="service-catagery-list wow fadeInUp">
                <h3>services category</h3>
                <ul>
                  <li v-for="serviceItem in allServices" :key="serviceItem.slug">
                    <NuxtLink 
                      :to="`/services/${serviceItem.slug}`"
                      :class="{ active: serviceItem.slug === service?.slug }"
                    >
                      {{ serviceItem.title }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>
              <!-- Service Category List End -->

              <!-- Sidebar Cta Box Start -->
              <div class="sidebar-cta-box wow fadeInUp" data-wow-delay="0.2s">
                <div class="icon-box">
                  <img src="/images/icon-sidebar-cta.svg" alt="">
                </div>
                <div class="cta-contact-content">
                  <h3>You have different questions?</h3>
                  <p>Our team will answer all your questions. we ensure a quick response.</p>
                </div>
                <div class="cta-contact-btn">
                  <a :href="`tel:${settings.phone.replace(/\s/g, '')}`" class="btn-default btn-highlighted">
                    <img src="/images/icon-sidebar-cta-phone.svg" alt=""> {{ settings.phone }}
                  </a>
                </div>
              </div>
              <!-- Sidebar Cta Box End -->
            </div>
            <!-- Service Sidebar End -->
          </div>

          <div class="col-lg-8">
            <!-- Service Single Content Start -->
            <div class="service-single-content" v-if="service">
              <!-- Service Featured Image Start -->
              <div class="service-featured-image" v-if="service.image">
                <figure class="image-anime">
                  <img :src="service.image" :alt="service.title">
                </figure>
              </div>
              <!-- Service Featured Image End -->

              <!-- Service Entry Start -->
              <div class="service-entry">
                <p class="wow fadeInUp" v-if="service.description" v-html="service.description"></p>
                <p class="wow fadeInUp" v-else>
                  At SpicyHunt, our service is designed to offer you the perfect experience. We strive to make every visit memorable.
                </p>

                <!-- Service Key Features Start -->
                <div class="service-key-features" v-if="service.features && service.features.length > 0">
                  <h2 class="text-anime-style-2">KEY features of <span>spicyhunt</span></h2>
                  <p class="wow fadeInUp">Discover what makes SpicyHunt stand out! From our carefully crafted dishes bursting with flavor to our warm and inviting atmosphere, every detail is designed to offer you an exceptional experience.</p>

                  <!-- Service Entry List Image Start -->
                  <div class="service-entry-list-image">
                    <div class="service-entry-list wow fadeInUp" data-wow-delay="0.4s">
                      <ul>
                        <li v-for="(feature, index) in service.features" :key="index">
                          {{ feature }}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <!-- Service Entry List Image End -->
                </div>
                <!-- Service Key Features End -->
              </div>
              <!-- Service Entry End -->
            </div>
            <!-- Service Single Content End -->
          </div>
        </div>
      </div>
    </div>
    <!-- Page Service Single End -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSettingsStore } from '~/stores/settings'
import { usePagesStore, type Page } from '~/stores/pages'

const route = useRoute()
const settingsStore = useSettingsStore()
const pagesStore = usePagesStore()

const settings = computed(() => settingsStore.settings)
const page = ref<Page | null>(null)

const slug = computed(() => route.params.slug as string)

interface Service {
  slug: string
  title: string
  description?: string
  image?: string
  features?: string[]
}

const allServices = ref<Service[]>([
  { slug: 'dine-in', title: 'Dine-in experience' },
  { slug: 'reservations', title: 'Online table reservations' },
  { slug: 'delivery', title: 'Home delivery service' },
  { slug: 'catering', title: 'Catering for events' },
  { slug: 'takeout', title: 'Takeout orders' },
  { slug: 'private-dining', title: 'Private dining' }
])

const service = computed<Service | null>(() => {
  // Buscar servicio por slug
  const foundService = allServices.value.find(s => s.slug === slug.value)
  
  if (foundService) {
    // Agregar datos adicionales según el slug
    const serviceData: Service = {
      ...foundService,
      description: getServiceDescription(foundService.slug),
      image: '/images/service-single-image.jpg',
      features: getServiceFeatures(foundService.slug)
    }
    return serviceData
  }
  
  return null
})

const getServiceDescription = (serviceSlug: string): string => {
  const descriptions: Record<string, string> = {
    'dine-in': 'At SpicyHunt, our dine-in experience is designed to offer you the perfect blend of comfort, ambiance, and culinary delight. Enjoy our thoughtfully crafted interiors, warm hospitality, and a menu filled with flavorful dishes made from the freshest ingredients.',
    'reservations': 'Reserve your table effortlessly through our online booking system for a seamless dining experience. Our reservation system is easy to use and ensures you have a table waiting for you.',
    'delivery': 'Savor your favorite dishes in the comfort of your home with our reliable and quick delivery service. We ensure your food arrives fresh and hot, maintaining the same quality you experience in our restaurant.',
    'catering': 'From small gatherings to grand celebrations, let us bring our culinary excellence to your special event. Our catering service offers a wide range of menu options to suit your needs.',
    'takeout': 'Convenient and fast takeout options for when you are on the go but still craving our flavors. Place your order and pick it up at your convenience.',
    'private-dining': 'Host intimate gatherings or private events in our dedicated dining space tailored to your needs. Perfect for special occasions, business meetings, or family celebrations.'
  }
  return descriptions[serviceSlug] || ''
}

const getServiceFeatures = (serviceSlug: string): string[] => {
  const features: Record<string, string[]> = {
    'dine-in': [
      'Thoughtfully crafted interiors',
      'Warm hospitality',
      'Fresh ingredients',
      'Memorable dining experience'
    ],
    'reservations': [
      'Easy online booking',
      'Instant confirmation',
      'Flexible scheduling',
      'Special occasion requests'
    ],
    'delivery': [
      'Quick delivery service',
      'Fresh and hot food',
      'Wide delivery area',
      'Real-time tracking'
    ],
    'catering': [
      'Customizable menus',
      'Professional service',
      'Event planning support',
      'Flexible pricing'
    ],
    'takeout': [
      'Quick preparation',
      'Convenient pickup',
      'Fresh packaging',
      'Easy ordering'
    ],
    'private-dining': [
      'Dedicated space',
      'Customized menus',
      'Professional service',
      'Flexible arrangements'
    ]
  }
  return features[serviceSlug] || []
}

onMounted(async () => {
  await settingsStore.fetchSettings()

  useHead({
    title: `${service.value?.title || 'Service'} - Restaurant`,
    meta: [
      { name: 'description', content: service.value?.description || 'Service details' }
    ]
  })

  if (process.client) {
    setTimeout(() => {
      if ((window as any).WOW) {
        new (window as any).WOW().init()
      }
    }, 500)
  }
})
</script>

