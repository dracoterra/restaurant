import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { useCache, CACHE_TTL } from '~/composables/useCache'

export interface ThemeSettings {
  logo: string
  logoData?: {
    url: string
    width: number
    height: number
    alt: string
    title: string
  } | null
  address: string
  phone: string
  email: string
  social_media: {
    facebook?: string
    instagram?: string
    dribbble?: string
  }
  copyright: string
  siteInfo?: {
    name: string
    description: string
    url: string
    admin_email: string
    language: string
    timezone: string
    date_format: string
    time_format: string
    posts_per_page: number
    theme: {
      name: string
      version: string
      template: string
      stylesheet: string
    }
  }
  background_color?: string
  background_image?: string
}

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: {
      logo: '/images/logo.svg',
      address: '4517 Washington Ave, Kentucky 39495',
      phone: '+01 780 859 632',
      email: 'info@restaurant.com',
      social_media: {
        facebook: '#',
        instagram: '#',
        dribbble: '#'
      },
      copyright: 'Copyright © 2025 All Rights Reserved.'
    } as ThemeSettings,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchSettings() {
      this.loading = true
      this.error = null

      try {
        const cache = useCache()
        const cacheKey = 'settings:all'
        
        // Intentar obtener del caché primero
        const cached = cache.get<ThemeSettings>(cacheKey)
        if (cached) {
          this.settings = { ...this.settings, ...cached }
          this.loading = false
          return
        }
        
        const api = useApi()
        const response = await api.get('/settings')
        
        // FeathersJS devuelve { data: {...}, total: 1 } para find()
        const settingsData = (response.data && typeof response.data === 'object' && 'data' in response.data)
          ? response.data.data
          : response.data
        
        if (settingsData) {
          this.settings = { ...this.settings, ...settingsData }
          // Guardar en caché (1 hora)
          cache.set(cacheKey, this.settings, CACHE_TTL.LONG)
        }
      } catch (error: any) {
        this.error = error.message || 'Error al cargar configuración'
        // Mantener valores por defecto en caso de error
      } finally {
        this.loading = false
      }
    }
  }
})

