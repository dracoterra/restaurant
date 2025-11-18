import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

export interface Insight {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  date: string
  modified: string
  author: {
    name: string
    slug: string
    avatar: string | null
  }
  featuredImage: {
    url: string
    alt: string
    width: number | null
    height: number | null
  } | null
  categories: Array<{ name: string; slug: string }>
  tags: Array<{ name: string; slug: string }>
}

export interface InsightsResponse {
  data: Insight[]
  total: number
  limit: number
  skip: number
  pageInfo?: {
    hasNextPage: boolean
    endCursor: string | null
  }
}

export const useInsightsStore = defineStore('insights', {
  state: () => ({
    insights: [] as Insight[],
    currentInsight: null as Insight | null,
    loading: false,
    error: null as string | null,
    total: 0,
    limit: 10,
    skip: 0,
    pageInfo: {
      hasNextPage: false,
      endCursor: null as string | null
    }
  }),

  actions: {
    async fetchInsights(params: { skip?: number; limit?: number; search?: string; append?: boolean; after?: string } = {}) {
      this.loading = true
      this.error = null

      try {
        const api = useApi()
        const queryParams: Record<string, any> = {
          $skip: params.skip || this.skip,
          $limit: params.limit || this.limit,
          search: params.search || ''
        }
        
        // Agregar cursor para paginación
        if (params.after) {
          queryParams.after = params.after
        } else if (params.append && this.pageInfo.endCursor) {
          queryParams.after = this.pageInfo.endCursor
        }
        
        const response = await api.get<InsightsResponse>('/insights', {
          params: queryParams
        })

        // Manejar diferentes estructuras de respuesta
        const responseData = response.data
        if (responseData && typeof responseData === 'object') {
          // Si la respuesta tiene una propiedad 'data', usarla
          if ('data' in responseData && Array.isArray(responseData.data)) {
            // Si hay paginación, agregar a la lista existente
            if (params.append && this.insights.length > 0) {
              this.insights = [...this.insights, ...responseData.data]
            } else {
              this.insights = responseData.data
            }
            this.total = responseData.total || responseData.data.length
            this.skip = responseData.skip || 0
            this.limit = responseData.limit || this.limit
            
            // Actualizar información de paginación
            if (responseData.pageInfo) {
              this.pageInfo = responseData.pageInfo
            }
          } 
          // Si la respuesta es directamente un array
          else if (Array.isArray(responseData)) {
            if (params.append && this.insights.length > 0) {
              this.insights = [...this.insights, ...responseData]
            } else {
              this.insights = responseData
            }
            this.total = responseData.length
          }
          // Si la respuesta tiene una estructura diferente
          else {
            if (!params.append) {
              this.insights = []
            }
            this.total = 0
          }
        } else {
          if (!params.append) {
            this.insights = []
          }
          this.total = 0
        }
      } catch (error: any) {
        this.error = error.message || 'Error al cargar insights'
        if (!params.append) {
          this.insights = []
        }
      } finally {
        this.loading = false
      }
    },
    
    async loadMore() {
      if (!this.pageInfo.hasNextPage || this.loading) {
        return
      }
      
      await this.fetchInsights({
        limit: this.limit,
        append: true
      })
    },
    
    reset() {
      this.insights = []
      this.skip = 0
      this.pageInfo = {
        hasNextPage: false,
        endCursor: null
      }
    },

    async fetchInsightBySlug(slug: string) {
      this.loading = true
      this.error = null

      try {
        const api = useApi()
        const response = await api.get<Insight>(`/insights/${slug}`)
        this.currentInsight = response.data
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Error al cargar el insight'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})

