import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

export interface ThemeSettings {
  logo: string
  address: string
  phone: string
  email: string
  social_media: {
    facebook?: string
    instagram?: string
    dribbble?: string
  }
  copyright: string
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
        const api = useApi()
        const response = await api.get('/settings')
        
        if (response.data.data) {
          this.settings = { ...this.settings, ...response.data.data }
        }
      } catch (error: any) {
        this.error = error.message || 'Error al cargar configuración'
        console.error('Error fetching settings:', error)
        // Mantener valores por defecto en caso de error
      } finally {
        this.loading = false
      }
    }
  }
})

