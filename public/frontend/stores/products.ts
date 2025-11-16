import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  price: string
  regularPrice: string
  salePrice: string | null
  onSale: boolean
  image: {
    url: string
    alt: string
  } | null
  categories: Array<{
    name: string
    slug: string
  }>
}

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [] as Product[],
    categories: [] as Array<{ name: string; slug: string }>,
    loading: false,
    error: null as string | null,
    total: 0,
    currentCategory: ''
  }),

  actions: {
    async fetchProducts(params: { category?: string; search?: string; limit?: number } = {}) {
      this.loading = true
      this.error = null
      this.currentCategory = params.category || ''

      try {
        const api = useApi()
        const response = await api.get('/products', {
          params: {
            category: params.category || '',
            search: params.search || '',
            $limit: params.limit || 20
          }
        })

        this.products = response.data.data || []
        this.total = response.data.total || 0
      } catch (error: any) {
        this.error = error.message || 'Error al cargar productos'
        console.error('Error fetching products:', error)
        this.products = []
      } finally {
        this.loading = false
      }
    },

    async fetchCategories() {
      try {
        const api = useApi()
        const response = await api.get('/products', {
          params: { $limit: 1 }
        })
        
        // Extraer categorías únicas de los productos
        const categoriesMap = new Map<string, { name: string; slug: string }>()
        if (response.data.data) {
          response.data.data.forEach((product: Product) => {
            product.categories?.forEach(cat => {
              if (!categoriesMap.has(cat.slug)) {
                categoriesMap.set(cat.slug, cat)
              }
            })
          })
        }
        
        this.categories = Array.from(categoriesMap.values())
      } catch (error: any) {
        console.error('Error fetching categories:', error)
        this.categories = []
      }
    }
  },

  getters: {
    productsByCategory: (state) => {
      return (categorySlug: string) => {
        if (!categorySlug) return state.products
        return state.products.filter(product => 
          product.categories.some(cat => cat.slug === categorySlug)
        )
      }
    }
  }
})

