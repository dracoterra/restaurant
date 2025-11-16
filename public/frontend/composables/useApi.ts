import axios from 'axios'

export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  const api = axios.create({
    baseURL: apiBase,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return {
    api,
    apiBase
  }
}

