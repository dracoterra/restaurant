<template>
  <div id="app">
    <LayoutPreloader />
    <div id="app-content">
      <LayoutHeader />
      <main id="main-content">
        <slot />
      </main>
      <LayoutFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePagesStore } from '~/stores/pages'

const route = useRoute()
const pagesStore = usePagesStore()

// Obtener body classes de la página actual
const bodyClasses = computed(() => {
  if (pagesStore.currentPage?.bodyClasses) {
    return pagesStore.currentPage.bodyClasses
  }
  // Clases por defecto basadas en la ruta
  const classes = ['page']
  if (route.path !== '/') {
    classes.push(`page-${route.path.replace(/\//g, '-').replace(/^-|-$/g, '') || 'home'}`)
  } else {
    classes.push('page-home')
  }
  return classes
})

// Aplicar body classes dinámicamente
const updateBodyClasses = () => {
  if (process.client) {
    document.body.className = bodyClasses.value.join(' ')
  }
}

// Cargar página y aplicar body classes cuando cambie la ruta
watch(() => route.path, async (newPath) => {
  if (process.client) {
    // Intentar cargar la página para obtener body classes
    const slug = newPath === '/' ? 'home' : newPath.replace(/^\//, '').replace(/\/$/, '')
    try {
      await pagesStore.fetchPageBySlug(slug)
    } catch (error) {
      // Si falla, usar clases por defecto
    }
    updateBodyClasses()
  }
}, { immediate: true })

onMounted(() => {
  updateBodyClasses()
})

onUnmounted(() => {
  // Limpiar clases al desmontar
  if (process.client) {
    document.body.className = ''
  }
})
</script>