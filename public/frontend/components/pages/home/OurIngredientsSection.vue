<template>
  <div class="our-ingredients">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6 order-lg-1 order-2">
            <!-- Our Ingredients Image Start -->
          <div class="our-ingredients-image">
            <div class="our-ingredients-img">
              <figure v-if="image">
                <img :src="image.url" :alt="image.alt || 'Our Ingredients'">
              </figure>
              <figure v-else>
                <img src="/images/our-ingredients-image.png" alt="Our Ingredients">
              </figure>
            </div>

            <!-- Happy Customer Box Start -->
            <div class="happy-customer-box" v-if="happyCustomersCount || (customerImages && customerImages.length > 0)">
              <div class="happy-customer-content" v-if="happyCustomersCount">
                <h3><span class="counter">{{ happyCustomersCount }}</span>+ exclusive</h3>
                <p>happy customer</p>
              </div>
              <div class="happy-customer-content" v-else>
                <h3><span class="counter">620</span>+ exclusive</h3>
                <p>happy customer</p>
              </div>
              <div class="happy-customer-images" v-if="processedCustomerImages && processedCustomerImages.length > 0">
                <div 
                  v-for="(image, index) in processedCustomerImages.slice(0, 3)" 
                  :key="index"
                  class="customer-image"
                >
                  <figure class="image-anime">
                    <img :src="getImageUrl(image)" :alt="getImageAlt(image) || 'Customer'">
                  </figure>
                </div>
                <div class="customer-image add-more" v-if="processedCustomerImages.length > 3">
                  <i class="fa-solid fa-plus"></i>
                </div>
              </div>
              <div class="happy-customer-images" v-else>
                <div class="customer-image">
                  <figure class="image-anime">
                    <img src="/images/happy-customer-img-1.jpg" alt="Customer">
                  </figure>
                </div>
                <div class="customer-image">
                  <figure class="image-anime">
                    <img src="/images/happy-customer-img-2.jpg" alt="Customer">
                  </figure>
                </div>
                <div class="customer-image">
                  <figure class="image-anime">
                    <img src="/images/happy-customer-img-3.jpg" alt="Customer">
                  </figure>
                </div>
                <div class="customer-image add-more">
                  <i class="fa-solid fa-plus"></i>
                </div>
              </div>
            </div>
            <!-- Happy Customer Box End -->
          </div>
          <!-- Our Ingredients Image End -->
        </div>

        <div class="col-lg-6 order-lg-2 order-1">
          <!-- Our Ingredients Content Start -->
          <div class="our-ingredients-content">
            <div class="section-title" v-if="subtitle || title || description">
              <h3 class="wow fadeInUp" v-if="subtitle">{{ subtitle }}</h3>
              <h3 class="wow fadeInUp" v-else>our ingredients</h3>
              <h2 class="text-anime-style-2" data-cursor="-opaque" v-if="title">
                <span v-html="formatTitle(title)"></span>
              </h2>
              <h2 class="text-anime-style-2" data-cursor="-opaque" v-else>Crafting Dishes with <span>freshest Flavors</span></h2>
              <p class="wow fadeInUp" data-wow-delay="0.2s" v-if="description">{{ description }}</p>
              <p class="wow fadeInUp" data-wow-delay="0.2s" v-else>We take pride in using only the freshest, hand-picked ingredients that are free from preservatives and artificial additives. Taste the difference with every bite as we serve dishes made from nature's finest.</p>
            </div>

            <div class="our-ingredients-list wow fadeInUp" data-wow-delay="0.4s" v-if="features && features.length > 0">
              <div 
                v-for="(feature, index) in features" 
                :key="index"
                class="ingredients-list-item"
              >
                <div class="icon-box" v-if="feature.icon">
                  <img :src="feature.icon.url" :alt="feature.icon.alt || feature.title">
                </div>
                <div class="ingredients-list-content" v-if="feature.title">
                  <h3>{{ feature.title }}</h3>
                </div>
              </div>
            </div>
            <div class="our-ingredients-list wow fadeInUp" data-wow-delay="0.4s" v-else>
              <div class="ingredients-list-item">
                <div class="icon-box">
                  <img src="/images/icon-ingredients-list-1.svg" alt="Best Qualities">
                </div>
                <div class="ingredients-list-content">
                  <h3>best qualities</h3>
                </div>
              </div>
              <div class="ingredients-list-item">
                <div class="icon-box">
                  <img src="/images/icon-ingredients-list-2.svg" alt="Discount System">
                </div>
                <div class="ingredients-list-content">
                  <h3>discount system</h3>
                </div>
              </div>
              <div class="ingredients-list-item">
                <div class="icon-box">
                  <img src="/images/icon-ingredients-list-3.svg" alt="First Delivery">
                </div>
                <div class="ingredients-list-content">
                  <h3>first delivery</h3>
                </div>
              </div>
            </div>

            <div class="our-ingredients-btn wow fadeInUp" data-wow-delay="0.6s">
              <NuxtLink to="/contact" class="btn-default">book table</NuxtLink>
            </div>
          </div>
          <!-- Our Ingredients Content End -->
        </div>

        <div class="col-lg-12 order-3">
          <!-- Ingredient Counter List Start -->
          <div class="ingredient-counter-list" v-if="counters && counters.length > 0">
            <div 
              v-for="(counter, index) in counters" 
              :key="index"
              class="ingredient-counter-item"
            >
              <div class="icon-box" v-if="counter.icon">
                <img :src="counter.icon.url" :alt="counter.icon.alt || counter.label">
              </div>
              <div class="icon-box" v-else>
                <img :src="`/images/icon-ingredient-counter-${index + 1}.svg`" :alt="counter.label">
              </div>
              <div class="ingredient-counter-content">
                <h2>
                  <span class="counter">{{ counter.number }}</span>
                  <span v-if="counter.label && counter.label.includes('+')">+</span>
                </h2>
                <p>{{ counter.label }}</p>
              </div>
            </div>
          </div>
          <div class="ingredient-counter-list" v-else>
            <div class="ingredient-counter-item">
              <div class="icon-box">
                <img src="/images/icon-ingredient-counter-1.svg" alt="Chefs">
              </div>
              <div class="ingredient-counter-content">
                <h2><span class="counter">309</span></h2>
                <p>Professional chefs</p>
              </div>
            </div>
            <div class="ingredient-counter-item">
              <div class="icon-box">
                <img src="/images/icon-ingredient-counter-2.svg" alt="Food Items">
              </div>
              <div class="ingredient-counter-content">
                <h2><span class="counter">453</span></h2>
                <p>Items of food</p>
              </div>
            </div>
            <div class="ingredient-counter-item">
              <div class="icon-box">
                <img src="/images/icon-ingredient-counter-3.svg" alt="Experience">
              </div>
              <div class="ingredient-counter-content">
                <h2><span class="counter">25</span>+</h2>
                <p>Years of experience</p>
              </div>
            </div>
            <div class="ingredient-counter-item">
              <div class="icon-box">
                <img src="/images/icon-ingredient-counter-4.svg" alt="Clients">
              </div>
              <div class="ingredient-counter-content">
                <h2><span class="counter">300</span>+</h2>
                <p>Satisfied clients</p>
              </div>
            </div>
          </div>
          <!-- Ingredient Counter List End -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Image {
  url: string
  alt?: string
}

interface Feature {
  icon?: Image
  title: string
}

interface Counter {
  icon?: Image
  number: number
  label: string
}

interface Props {
  subtitle?: string
  title?: string
  description?: string
  image?: Image | null
  features?: Feature[]
  happyCustomersCount?: number
  customerImages?: Image[]
  counters?: Counter[]
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: '',
  title: '',
  description: '',
  image: null,
  features: () => [],
  happyCustomersCount: 0,
  customerImages: () => [],
  counters: () => []
})

// Helper para formatear el título con spans
const formatTitle = (title: string) => {
  if (!title) return ''
  return title.replace(/\<span\>(.*?)\<\/span\>/gi, '<span>$1</span>')
}

// Helper para procesar imágenes de clientes (pueden venir como array o como objeto con nodes)
const processedCustomerImages = computed(() => {
  if (!props.customerImages) return []
  // Si es un array, devolverlo directamente
  if (Array.isArray(props.customerImages)) {
    return props.customerImages
  }
  // Si tiene nodes, usar nodes
  if (props.customerImages.nodes && Array.isArray(props.customerImages.nodes)) {
    return props.customerImages.nodes
  }
  return []
})

// Helper para obtener URL de imagen
const getImageUrl = (image: any): string => {
  if (!image) return ''
  return image.url || image.sourceUrl || ''
}

// Helper para obtener alt de imagen
const getImageAlt = (image: any): string => {
  if (!image) return ''
  return image.alt || image.altText || ''
}
</script>

