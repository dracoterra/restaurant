<template>
  <div class="preloader" ref="preloaderRef">
    <div class="loading-container">
      <div class="loading"></div>
      <div id="loading-icon">
        <img src="/images/loader.svg" alt="Loading" ref="loaderImgRef">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const preloaderRef = ref<HTMLElement | null>(null)
const loaderImgRef = ref<HTMLImageElement | null>(null)
let hideTimeout: ReturnType<typeof setTimeout> | null = null

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

const checkAllResourcesLoaded = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!process.client) {
      resolve(false)
      return
    }

    // Verificar que el DOM esté listo
    if (document.readyState !== 'complete') {
      resolve(false)
      return
    }

    // Verificar que todas las imágenes estén cargadas
    const images = Array.from(document.querySelectorAll('img'))
    const imagePromises = images.map((img) => {
      if (img.complete) return Promise.resolve()
      return new Promise<void>((resolveImg) => {
        img.onload = () => resolveImg()
        img.onerror = () => resolveImg() // Continuar aunque haya error
        // Timeout de seguridad para imágenes que no cargan
        setTimeout(() => resolveImg(), 5000)
      })
    })

    // Verificar que todos los videos estén cargados
    const videos = Array.from(document.querySelectorAll('video'))
    const videoPromises = videos.map((video) => {
      if (video.readyState >= 2) return Promise.resolve() // HAVE_CURRENT_DATA
      return new Promise<void>((resolveVideo) => {
        video.addEventListener('loadeddata', () => resolveVideo(), { once: true })
        video.addEventListener('error', () => resolveVideo(), { once: true })
        // Timeout de seguridad para videos que no cargan
        setTimeout(() => resolveVideo(), 10000)
      })
    })

    // Esperar a que todas las imágenes y videos estén cargados
    Promise.all([...imagePromises, ...videoPromises]).then(() => {
      // Esperar un poco más para asegurar que los scripts estén inicializados
      setTimeout(() => {
        resolve(true)
      }, 500)
    })
  })
}

const waitForEverything = async () => {
  if (!process.client) return

  // Esperar a que el window.load se dispare
  if (document.readyState !== 'complete') {
    await new Promise<void>((resolve) => {
      window.addEventListener('load', () => resolve(), { once: true })
      // Timeout de seguridad
      setTimeout(() => resolve(), 10000)
    })
  }

  // Esperar a que todos los recursos estén cargados
  let attempts = 0
  const maxAttempts = 20 // Máximo 20 intentos (20 segundos)

  const check = async () => {
    attempts++
    const allLoaded = await checkAllResourcesLoaded()
    
    if (allLoaded || attempts >= maxAttempts) {
      // Esperar un poco más para que los scripts de animación se inicialicen
      setTimeout(() => {
        hidePreloader()
      }, 1000)
    } else {
      // Reintentar después de 1 segundo
      hideTimeout = setTimeout(check, 1000)
    }
  }

  check()
}

onMounted(() => {
  if (process.client) {
    // Asegurar que el preloader sea visible desde el inicio
    if (preloaderRef.value) {
      preloaderRef.value.style.display = 'flex'
      preloaderRef.value.style.opacity = '1'
      preloaderRef.value.style.visibility = 'visible'
      preloaderRef.value.style.position = 'fixed'
      preloaderRef.value.style.top = '0'
      preloaderRef.value.style.left = '0'
      preloaderRef.value.style.right = '0'
      preloaderRef.value.style.bottom = '0'
      preloaderRef.value.style.zIndex = '1000'
      preloaderRef.value.style.backgroundColor = 'var(--accent-color)'
    }

    // Iniciar la verificación de carga
    waitForEverything()
  }
})

onUnmounted(() => {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
  }
})
</script>

