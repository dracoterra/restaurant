<template>
  <div>
    <!-- Page Header Start -->
    <SectionsPageHeader :title="insight?.title || 'Blog'" />
    <!-- Page Header End -->

    <!-- Blog Single Section Start -->
    <div class="blog-single" v-if="!insightsStore.loading && insight">
      <div class="container">
        <div class="row">
          <div class="col-lg-8">
            <!-- Blog Single Content Start -->
            <div class="blog-single-content">
              <!-- Blog Single Image Start -->
              <div class="blog-single-image" v-if="insight.featuredImage">
                <figure class="image-anime">
                  <img :src="insight.featuredImage.url" :alt="insight.featuredImage.alt">
                </figure>
              </div>
              <!-- Blog Single Image End -->

              <!-- Blog Single Meta Start -->
              <div class="blog-single-meta">
                <ul>
                  <li><i class="fa-regular fa-calendar"></i> {{ formatDate(insight.date) }}</li>
                  <li><i class="fa-regular fa-user"></i> {{ insight.author.name }}</li>
                  <li v-if="insight.categories.length > 0">
                    <i class="fa-regular fa-folder"></i> 
                    <span v-for="(category, index) in insight.categories" :key="category.slug">
                      {{ category.name }}<span v-if="index < insight.categories.length - 1">, </span>
                    </span>
                  </li>
                </ul>
              </div>
              <!-- Blog Single Meta End -->

              <!-- Blog Single Title Start -->
              <div class="blog-single-title">
                <h2>{{ insight.title }}</h2>
              </div>
              <!-- Blog Single Title End -->

              <!-- Blog Single Description Start -->
              <div class="blog-single-description" v-html="insight.content"></div>
              <!-- Blog Single Description End -->

              <!-- Blog Single Tags Start -->
              <div class="blog-single-tags" v-if="insight.tags && insight.tags.length > 0">
                <h3>Tags:</h3>
                <ul>
                  <li v-for="tag in insight.tags" :key="tag.slug">
                    <a href="#">{{ tag.name }}</a>
                  </li>
                </ul>
              </div>
              <!-- Blog Single Tags End -->
            </div>
            <!-- Blog Single Content End -->
          </div>

          <div class="col-lg-4">
            <!-- Blog Sidebar Start -->
            <div class="blog-sidebar">
              <!-- Puedes agregar sidebar aquí si es necesario -->
            </div>
            <!-- Blog Sidebar End -->
          </div>
        </div>
      </div>
    </div>
    <!-- Blog Single Section End -->

    <!-- Loading State -->
    <div v-if="insightsStore.loading" class="container py-5 text-center">
      <p>Cargando...</p>
    </div>

    <!-- Error State -->
    <div v-if="insightsStore.error" class="container py-5 text-center">
      <p class="text-danger">Error: {{ insightsStore.error }}</p>
    </div>

    <!-- Not Found State -->
    <div v-if="!insightsStore.loading && !insight" class="container py-5 text-center">
      <p>Insight no encontrado</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useInsightsStore } from '~/stores/insights'
import { useDayjs } from '~/composables/useDayjs'

const route = useRoute()
const insightsStore = useInsightsStore()
const dayjs = useDayjs()

const slug = route.params.slug as string
const insight = computed(() => insightsStore.currentInsight)

const formatDate = (date: string) => {
  return dayjs(date).format('DD MMM YYYY')
}

onMounted(async () => {
  await insightsStore.fetchInsightBySlug(slug)
  
  // Inicializar animaciones
  if (process.client) {
    setTimeout(() => {
      if ((window as any).WOW) {
        new (window as any).WOW().init()
      }
    }, 500)
  }
})

useHead({
  title: insight.value ? `${insight.value.title} - Restaurant` : 'Blog - Restaurant'
})
</script>



