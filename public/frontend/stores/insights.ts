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
    skip: 0
  }),

  actions: {
    async fetchInsights(params: { skip?: number; limit?: number; search?: string } = {}) {
      this.loading = true
      this.error = null

      try {
        const api = useApi()
        const response = await api.get<InsightsResponse>('/insights', {
          params: {
            $skip: params.skip || this.skip,
            $limit: params.limit || this.limit,
            search: params.search || ''
          }
        })

        // Manejar diferentes estructuras de respuesta
        const responseData = response.data
        if (responseData && typeof responseData === 'object') {
          // Si la respuesta tiene una propiedad 'data', usarla
          if ('data' in responseData && Array.isArray(responseData.data)) {
            this.insights = responseData.data
            this.total = responseData.total || responseData.data.length
            this.skip = responseData.skip || 0
            this.limit = responseData.limit || this.limit
          } 
          // Si la respuesta es directamente un array
          else if (Array.isArray(responseData)) {
            this.insights = responseData
            this.total = responseData.length
          }
          // Si la respuesta tiene una estructura diferente
          else {
            this.insights = []
            this.total = 0
          }
        } else {
          this.insights = []
          this.total = 0
        }
      } catch (error: any) {
        this.error = error.message || 'Error al cargar insights'
        console.error('Error fetching insights:', error)
      } finally {
        this.loading = false
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
        console.error('Error fetching insight:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})

