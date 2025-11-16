import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

export interface Page {
  id: string
  databaseId: number
  title: string
  slug: string
  content: string
  excerpt: string
  date: string
  modified: string
  featuredImage: {
    url: string
    alt: string
    width: number | null
    height: number | null
  } | null
  seo: {
    title?: string
    metaDesc?: string
    canonical?: string
  }
}

export interface PagesResponse {
  data: Page[]
  total: number
  limit: number
  skip: number
  pageInfo: {
    hasNextPage: boolean
    endCursor: string | null
  }
}

export const usePagesStore = defineStore('pages', {
  state: () => ({
    pages: [] as Page[],
    currentPage: null as Page | null,
    loading: false,
    error: null as string | null,
    total: 0
  }),

  actions: {
    async fetchPages(params: { skip?: number; limit?: number; search?: string } = {}) {
      this.loading = true
      this.error = null

      try {
        const api = useApi()
        const response = await api.get<PagesResponse>('/pages', {
          params: {
            $skip: params.skip || 0,
            $limit: params.limit || 10,
            search: params.search || ''
          }
        })

        this.pages = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message || 'Error al cargar páginas'
        console.error('Error fetching pages:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchPageBySlug(slug: string) {
      this.loading = true
      this.error = null

      try {
        const api = useApi()
        const response = await api.get<Page>(`/pages/${slug}`)
        this.currentPage = response.data
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Error al cargar la página'
        console.error('Error fetching page:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})

