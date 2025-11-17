<template>
  <div class="daily-offer" v-if="subtitle || title || description">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6">
          <!-- Daily Offer Image Start -->
          <div class="daily-offer-image">
            <div class="daily-offer-img">
              <figure v-if="image">
                <img :src="image.url" :alt="image.alt || 'Daily Offer'">
              </figure>
              <figure v-else>
                <img src="/images/daily-offer-image.png" alt="Daily Offer">
              </figure>
            </div>

            <!-- Delicious Burger Box Start -->
            <div class="delicious-burger-box" v-if="burgerTitle || (burgerFeatures && burgerFeatures.length > 0)">
              <div class="delicious-burger-title" v-if="burgerTitle">
                <h3>{{ burgerTitle }}</h3>
              </div>
              <div class="delicious-burger-rating">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </div>
              <div class="delicious-burger-list" v-if="burgerFeatures && burgerFeatures.length > 0">
                <ul>
                  <li v-for="(feature, index) in burgerFeatures" :key="index">
                    {{ feature.featureText }}
                  </li>
                </ul>
              </div>
            </div>
            <!-- Delicious Burger Box End -->
          </div>
          <!-- Daily Offer Image End -->
        </div>

        <div class="col-lg-6">
          <!-- Daily Offer Content Start -->
          <div class="daily-offer-content">
            <!-- Section Title Start -->
            <div class="section-title">
              <h3 class="wow fadeInUp" v-if="subtitle">{{ subtitle }}</h3>
              <h2 class="text-anime-style-2" data-cursor="-opaque" v-if="title">
                <span v-html="formatTitle(title)"></span>
              </h2>
              <p class="wow fadeInUp" data-wow-delay="0.2s" v-if="description">{{ description }}</p>
            </div>
            <!-- Section Title End -->

            <!-- Daily Offer List Start -->
            <div class="daily-offer-list wow fadeInUp" data-wow-delay="0.4s" v-if="features && features.length > 0">
              <ul>
                <li v-for="(feature, index) in features" :key="index">
                  {{ feature.featureText }}
                </li>
              </ul>
            </div>
            <!-- Daily Offer List End -->

            <!-- Daily Offer Button Start -->
            <div class="daily-offer-btn wow fadeInUp" data-wow-delay="0.6s">
              <NuxtLink to="/contact" class="btn-default">book table</NuxtLink>
              <NuxtLink to="/menu" class="btn-default btn-highlighted">explore menu</NuxtLink>
            </div>
            <!-- Daily Offer Button End -->
          </div>
          <!-- Daily Offer Content End -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Image {
  sourceUrl?: string
  url?: string
  altText?: string
  alt?: string
}

interface Feature {
  featureText: string
}

interface Props {
  subtitle?: string
  title?: string
  description?: string
  image?: Image | null
  features?: Feature[]
  burgerTitle?: string
  burgerFeatures?: Feature[]
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: '',
  title: '',
  description: '',
  image: null,
  features: () => [],
  burgerTitle: '',
  burgerFeatures: () => []
})

// Helper para formatear el título con spans
const formatTitle = (title: string) => {
  if (!title) return ''
  // Buscar texto entre <span> tags o agregar span al texto destacado
  return title.replace(/\<span\>(.*?)\<\/span\>/gi, '<span>$1</span>')
}
</script>

