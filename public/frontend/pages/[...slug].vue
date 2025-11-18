<template>
  <ErrorBoundary>
    <div v-if="page" class="page-content">
      <h1>{{ page.title }}</h1>
      <div v-html="page.content"></div>
    </div>
    <div v-else-if="loading" class="loading">
      <p>Cargando...</p>
    </div>
    <div v-else class="not-found">
      <h1>404</h1>
      <p>Página no encontrada</p>
      <NuxtLink to="/">Volver al inicio</NuxtLink>
    </div>
  </ErrorBoundary>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { usePagesStore } from '~/stores/pages'
import { useSEO } from '~/composables/useSEO'
import ErrorBoundary from '~/components/ErrorBoundary.vue'

const route = useRoute()
const pagesStore = usePagesStore()

const slug = computed(() => {
  const path = route.path.replace(/^\//, '').replace(/\/$/, '')
  return path || 'home'
})

const page = computed(() => pagesStore.currentPage)
const loading = computed(() => pagesStore.loading)

// SEO dinámico
watch(() => page.value, (newPage) => {
  if (newPage) {
    useSEO({
      title: newPage.seo?.title || newPage.title,
      description: newPage.seo?.metaDesc || newPage.excerpt,
      image: newPage.featuredImage?.url,
      url: route.fullPath,
      type: 'website',
      canonical: newPage.seo?.canonical
    })
  }
}, { immediate: true })

onMounted(async () => {
  try {
    await pagesStore.fetchPageBySlug(slug.value)
  } catch (error) {
    // Error manejado por ErrorBoundary
  }
})
</script>

