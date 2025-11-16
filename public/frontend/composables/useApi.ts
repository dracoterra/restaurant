import { useRuntimeConfig } from '#app'

export interface ApiResponse<T = any> {
  data: T
  status?: number
  statusText?: string
}

export interface ApiError {
  message: string
  status?: number
  data?: any
}

export function useApi() {
  // Obtener la configuración de forma segura
  let apiBase = 'http://localhost:3030'
  try {
    const config = useRuntimeConfig()
    apiBase = config.public?.apiBase || apiBase
  } catch (e) {
    // Si useRuntimeConfig no está disponible, usar el valor por defecto
    apiBase = process.env.API_BASE_URL || 'http://localhost:3030'
  }

  const api = {
    async get<T = any>(url: string, options: { params?: Record<string, any> } = {}): Promise<ApiResponse<T>> {
      try {
        const queryString = options.params
          ? '?' + new URLSearchParams(
              Object.entries(options.params).reduce((acc, [key, value]) => {
                if (value !== null && value !== undefined) {
                  acc[key] = String(value)
                }
                return acc
              }, {} as Record<string, string>)
            ).toString()
          : ''

        const fullUrl = `${apiBase}${url}${queryString}`
        
        const response = await $fetch<any>(fullUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        // FeathersJS puede devolver el objeto directamente o envuelto en { data: ... }
        // Si la respuesta tiene una propiedad 'data', usarla; si no, usar la respuesta completa
        const responseData = (response && typeof response === 'object' && 'data' in response) 
          ? response.data 
          : response

        return {
          data: responseData as T,
          status: 200
        }
      } catch (error: any) {
        const apiError: ApiError = {
          message: error.message || 'Error en la petición',
          status: error.status || error.statusCode || 500,
          data: error.data || error
        }
        throw apiError
      }
    },

    async post<T = any>(url: string, data?: any, options: Record<string, any> = {}): Promise<ApiResponse<T>> {
      try {
        const fullUrl = `${apiBase}${url}`
        
        const response = await $fetch<T>(fullUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          },
          body: data
        })

        return {
          data: response,
          status: 200
        }
      } catch (error: any) {
        const apiError: ApiError = {
          message: error.message || 'Error en la petición',
          status: error.status || error.statusCode || 500,
          data: error.data || error
        }
        throw apiError
      }
    },

    async put<T = any>(url: string, data?: any, options: Record<string, any> = {}): Promise<ApiResponse<T>> {
      try {
        const fullUrl = `${apiBase}${url}`
        
        const response = await $fetch<T>(fullUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          },
          body: data
        })

        return {
          data: response,
          status: 200
        }
      } catch (error: any) {
        const apiError: ApiError = {
          message: error.message || 'Error en la petición',
          status: error.status || error.statusCode || 500,
          data: error.data || error
        }
        throw apiError
      }
    },

    async delete<T = any>(url: string, options: Record<string, any> = {}): Promise<ApiResponse<T>> {
      try {
        const fullUrl = `${apiBase}${url}`
        
        const response = await $fetch<T>(fullUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          }
        })

        return {
          data: response,
          status: 200
        }
      } catch (error: any) {
        const apiError: ApiError = {
          message: error.message || 'Error en la petición',
          status: error.status || error.statusCode || 500,
          data: error.data || error
        }
        throw apiError
      }
    }
  }

  return api
}
