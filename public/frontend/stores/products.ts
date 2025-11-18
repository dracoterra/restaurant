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
    currentCategory: '',
    limit: 20,
    skip: 0,
    hasMore: false
  }),

  actions: {
    async fetchProducts(params: { category?: string; search?: string; limit?: number; append?: boolean } = {}) {
      this.loading = true
      this.error = null
      
      // Solo actualizar categoría si no es append
      if (!params.append) {
        this.currentCategory = params.category || ''
        this.skip = 0
      }
      
      const limit = params.limit || this.limit

      try {
        const api = useApi()
        const queryParams: Record<string, any> = {
          category: params.category || this.currentCategory,
          search: params.search || '',
          $limit: limit,
          $skip: params.append ? this.skip : 0
        }
        
        const response = await api.get('/products', {
          params: queryParams
        })

        const newProducts = response.data.data || []
        
        // Si es append, agregar a la lista existente
        if (params.append) {
          this.products = [...this.products, ...newProducts]
        } else {
          this.products = newProducts
        }
        
        this.total = response.data.total || 0
        this.skip += newProducts.length
        this.hasMore = this.products.length < this.total
      } catch (error: any) {
        this.error = error.message || 'Error al cargar productos'
        if (!params.append) {
          this.products = []
        }
      } finally {
        this.loading = false
      }
    },
    
    async loadMore() {
      if (!this.hasMore || this.loading) {
        return
      }
      
      await this.fetchProducts({
        category: this.currentCategory,
        append: true
      })
    },
    
    reset() {
      this.products = []
      this.skip = 0
      this.hasMore = false
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

