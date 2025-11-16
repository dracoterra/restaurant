<template>
  <div>
    <!-- Page Header Start -->
    <SectionsPageHeader title="Blog" />
    <!-- Page Header End -->

    <!-- Page Blog Section Start -->
    <div class="page-blog">
      <div class="container">
        <div class="row section-row">
          <div class="col-lg-12">
            <!-- Section Title Start -->
            <div class="section-title">
              <h3 class="wow fadeInUp">our blog</h3>
              <h2 class="text-anime-style-2" data-cursor="-opaque">
                Latest news & <span>updates</span>
              </h2>
              <p class="wow fadeInUp" data-wow-delay="0.2s">
                Stay updated with our latest news, recipes, and restaurant updates.
              </p>
            </div>
            <!-- Section Title End -->
          </div>
        </div>

        <div class="row">
          <div 
            v-for="(post, index) in insightsStore.insights" 
            :key="post.id"
            class="col-lg-4 col-md-6"
          >
            <!-- Post Item Start -->
            <div class="post-item wow fadeInUp" :data-wow-delay="`${index * 0.2}s`">
              <!-- Post Featured Image Start -->
              <div class="post-featured-image" v-if="post.featuredImage">
                <NuxtLink :to="`/insights/${post.slug}`" data-cursor-text="View">
                  <figure class="image-anime">
                    <img :src="post.featuredImage.url" :alt="post.featuredImage.alt">
                  </figure>
                </NuxtLink>
              </div>
              <!-- Post Featured Image End -->

              <!-- Blog Content Start -->
              <div class="blog-item-body">
                <div class="post-item-content">
                  <h3><NuxtLink :to="`/insights/${post.slug}`">{{ post.title }}</NuxtLink></h3>
                </div>
                <div class="blog-item-btn">
                  <NuxtLink :to="`/insights/${post.slug}`" class="readmore-btn">read more</NuxtLink>
                </div>
              </div>
              <!-- Blog Content End -->
            </div>
            <!-- Post Item End -->
          </div>

          <!-- Loading State -->
          <div v-if="insightsStore.loading" class="col-lg-12 text-center py-5">
            <p>Cargando posts...</p>
          </div>

          <!-- Empty State -->
          <div v-if="!insightsStore.loading && insightsStore.insights.length === 0" class="col-lg-12 text-center py-5">
            <p>No hay posts disponibles aún.</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Page Blog Section End -->
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useInsightsStore } from '~/stores/insights'
import { useDayjs } from '~/composables/useDayjs'

// Meta tags
useHead({
  title: 'Blog - Restaurant',
  meta: [
    { name: 'description', content: 'Latest news and updates from our restaurant' }
  ]
})

const insightsStore = useInsightsStore()
const dayjs = useDayjs()

const formatDate = (date: string) => {
  return dayjs(date).format('DD MMM YYYY')
}

onMounted(async () => {
  await insightsStore.fetchInsights({ limit: 12 })
  
  // Inicializar animaciones
  if (process.client) {
    setTimeout(() => {
      if ((window as any).WOW) {
        new (window as any).WOW().init()
      }
    }, 500)
  }
})
</script>

