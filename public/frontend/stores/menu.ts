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
        const params: Record<string, string> = { location }
        if (slug) {
          params.slug = slug
        }
        
        const response = await api.get('/menus', {
          params
        })
        
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
        
        this.items = menuData || []
      } catch (error: any) {
        this.error = error.message || 'Error al cargar el menú'
        console.error('Error fetching menu:', error)
        // Usar menú por defecto en caso de error
        this.items = [
          { id: '1', label: 'Home', url: '/', path: '/', parentId: null, children: [] },
          { id: '2', label: 'About Us', url: '/about', path: '/about', parentId: null, children: [] },
          { id: '3', label: 'Services', url: '/services', path: '/services', parentId: null, children: [] },
          { id: '4', label: 'Menu', url: '/menu', path: '/menu', parentId: null, children: [] },
          { id: '5', label: 'Contact Us', url: '/contact', path: '/contact', parentId: null, children: [] }
        ]
      } finally {
        this.loading = false
      }
    }
  }
})

