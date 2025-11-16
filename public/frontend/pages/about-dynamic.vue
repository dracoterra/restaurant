<template>
  <div>
    <!-- Page Header Start -->
    <SectionsPageHeader :title="page?.title || 'About Us'" />
    <!-- Page Header End -->

    <!-- About Us Section Start -->
    <div class="about-us" v-if="page">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 order-lg-1 order-2">
            <!-- About Us Image Start -->
            <div class="about-us-image">
              <!-- About Us Img Start -->
              <div class="about-us-img">
                <figure class="image-anime">
                  <img 
                    :src="page.featuredImage?.url || '/images/about-us-image.jpg'" 
                    :alt="page.featuredImage?.alt || 'About Us'"
                  >
                </figure>
              </div>
              <!-- About Us Img End -->

              <!-- Company Experience Box Start -->
              <div class="company-experience">
                <div class="icon-box">
                  <img src="/images/icon-company-experience.svg" alt="Experience">
                </div>
                <div class="company-experience-content">
                  <h3><span class="counter">30</span>+ years of experience</h3>
                </div>
              </div>
              <!-- Company Experience Box End -->

              <!-- About Author Image Start -->
              <div class="about-author-img">
                <figure class="image-anime">
                  <img src="/images/about-us-img-2.jpg" alt="About Author">
                </figure>
              </div>
              <!-- About Author Image End -->
            </div>
            <!-- About Us Image End -->
          </div>

          <div class="col-lg-6 order-lg-2 order-1">
            <!-- About Us Content Start -->
            <div class="about-us-content">
              <!-- Contenido dinámico desde WordPress -->
              <div class="wp-content" v-html="page.content"></div>
              
              <!-- Fallback si no hay contenido -->
              <div v-if="!page.content" class="section-title">
                <h3 class="wow fadeInUp">about us</h3>
                <h2 class="text-anime-style-2" data-cursor="-opaque">
                  Our Commitment to Authenticity & <span>excellence</span>
                </h2>
                <p class="wow fadeInUp" data-wow-delay="0.2s">
                  Every dish we create is a celebration of connection, crafted with passion and inspired by diverse flavors.
                </p>
              </div>
            </div>
            <!-- About Us Content End -->
          </div>
        </div>
      </div>
    </div>
    <!-- About Us Section End -->

    <!-- Loading State -->
    <div v-if="pagesStore.loading" class="container py-5 text-center">
      <p>Cargando contenido...</p>
    </div>

    <!-- Error State -->
    <div v-if="pagesStore.error" class="container py-5 text-center">
      <p class="text-danger">Error: {{ pagesStore.error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePagesStore } from '~/stores/pages'

// Meta tags
const pagesStore = usePagesStore()
const page = ref(null)

onMounted(async () => {
  try {
    // Obtener página por slug
    page.value = await pagesStore.fetchPageBySlug('about')
    
    // Actualizar meta tags si hay SEO
    if (page.value?.seo?.title) {
      useHead({
        title: page.value.seo.title,
        meta: [
          { name: 'description', content: page.value.seo.metaDesc || page.value.excerpt }
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
    console.error('Error loading page:', error)
  }
})
</script>

<style scoped>
.wp-content {
  /* Estilos para el contenido de WordPress */
}

.wp-content :deep(h1),
.wp-content :deep(h2),
.wp-content :deep(h3) {
  margin-bottom: 1rem;
}

.wp-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.wp-content :deep(img) {
  max-width: 100%;
  height: auto;
}
</style>

