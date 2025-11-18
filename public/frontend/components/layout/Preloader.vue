<template>
  <div class="preloader" ref="preloaderRef">
    <div class="loading-container">
      <div class="loading"></div>
      <div id="loading-icon">
        <img src="/images/loader.svg" alt="Loading">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const preloaderRef = ref<HTMLElement | null>(null)

const hidePreloader = () => {
  if (process.client && preloaderRef.value) {
    // Usar jQuery si está disponible (como en el original)
    if ((window as any).jQuery) {
      const $ = (window as any).jQuery
      $(preloaderRef.value).fadeOut(600)
    } else {
      // Fallback sin jQuery
      preloaderRef.value.style.transition = 'opacity 0.6s'
      preloaderRef.value.style.opacity = '0'
      setTimeout(() => {
        if (preloaderRef.value) {
          preloaderRef.value.style.display = 'none'
        }
      }, 600)
    }
  }
}

onMounted(() => {
  if (process.client) {
    // Esperar a que la página esté completamente cargada
    if (document.readyState === 'complete') {
      hidePreloader()
    } else {
      window.addEventListener('load', hidePreloader)
    }
    
    // Fallback: ocultar después de 2 segundos máximo
    setTimeout(hidePreloader, 2000)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('load', hidePreloader)
  }
})
</script>

