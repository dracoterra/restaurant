// Tipos globales para Nuxt 3
import type { RouteLocationNormalizedLoaded } from 'vue-router'

declare global {
  interface Window {
    WOW?: any
    jQuery?: any
    Swiper?: any
  }

  // Auto-imports de Nuxt 3
  const useRoute: () => RouteLocationNormalizedLoaded
  const useHead: (head: { title?: string; meta?: Array<Record<string, any>> }) => void
  const useRuntimeConfig: () => {
    public: {
      apiBase?: string
    }
  }
  const $fetch: typeof fetch

  // Process para Nuxt 3
  namespace NodeJS {
    interface Process {
      client: boolean
      server: boolean
    }
  }
  const process: NodeJS.Process
}

// Asegurar que este archivo sea tratado como módulo
export {}

