import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

export interface MenuItem {
  id: string
  label: string
  url: string
  path: string
  parentId: string | null
  children: MenuItem[]
}

export const useMenuStore = defineStore('menu', {
  state: () => ({
    items: [] as MenuItem[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchMenu(location: string = 'primary', slug?: string) {
      this.loading = true
      this.error = null

      try {
        const api = useApi()
        
        // Primero intentar obtener por location
        let params: Record<string, string> = { location }
        if (slug) {
          params.slug = slug
        }
        
        let response = await api.get('/menus', { params })
        
        // FeathersJS devuelve { data: [...], total: N } para find()
        // $fetch ya parsea la respuesta, así que response.data es el objeto completo
        let menuData = []
        
        if (response.data) {
          if (typeof response.data === 'object' && 'data' in response.data) {
            // Si response.data tiene una propiedad 'data', usarla
            menuData = Array.isArray(response.data.data) ? response.data.data : []
          } else if (Array.isArray(response.data)) {
            // Si response.data es directamente un array
            menuData = response.data
          }
        }
        
        // Si no se encontró menú por location y no hay slug, intentar obtener todos los menús
        if (menuData.length === 0 && !slug) {
          response = await api.get('/menus', { params: {} })
          
          if (response.data) {
            if (typeof response.data === 'object' && 'data' in response.data) {
              menuData = Array.isArray(response.data.data) ? response.data.data : []
            } else if (Array.isArray(response.data)) {
              menuData = response.data
            }
          }
        }
        
        this.items = menuData || []
      } catch (error: any) {
        // Silenciar el error - no mostrar mensaje en el header
        // El skeleton loader se mostrará mientras no haya items
        this.error = error.message || 'Error al cargar el menú'
        this.items = []
      } finally {
        this.loading = false
      }
    }
  }
})

