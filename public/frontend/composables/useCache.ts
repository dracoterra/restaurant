/**
 * Composable para caché en el frontend
 * Usa localStorage y sessionStorage para persistencia
 */

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number // Time to live en milisegundos
}

/**
 * Composable para manejo de caché en frontend
 */
export function useCache() {
  const isClient = process.client
  
  /**
   * Obtener valor del caché
   */
  function get<T>(key: string, storage: 'local' | 'session' = 'local'): T | null {
    if (!isClient) return null
    
    try {
      const storageObj = storage === 'local' ? localStorage : sessionStorage
      const item = storageObj.getItem(`cache:${key}`)
      
      if (!item) return null
      
      const cacheItem: CacheItem<T> = JSON.parse(item)
      const now = Date.now()
      
      // Verificar si expiró
      if (now > cacheItem.timestamp + cacheItem.ttl) {
        storageObj.removeItem(`cache:${key}`)
        return null
      }
      
      return cacheItem.data
    } catch (error) {
      return null
    }
  }
  
  /**
   * Guardar valor en caché
   */
  function set<T>(key: string, data: T, ttl: number = 3600000, storage: 'local' | 'session' = 'local'): boolean {
    if (!isClient) return false
    
    try {
      const storageObj = storage === 'local' ? localStorage : sessionStorage
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl
      }
      
      storageObj.setItem(`cache:${key}`, JSON.stringify(cacheItem))
      return true
    } catch (error) {
      // Si el storage está lleno, limpiar caché antiguo
      if (error instanceof DOMException && error.code === 22) {
        clearExpired(storage)
        try {
          const storageObj = storage === 'local' ? localStorage : sessionStorage
          const cacheItem: CacheItem<T> = {
            data,
            timestamp: Date.now(),
            ttl
          }
          storageObj.setItem(`cache:${key}`, JSON.stringify(cacheItem))
          return true
        } catch (retryError) {
          return false
        }
      }
      return false
    }
  }
  
  /**
   * Eliminar valor del caché
   */
  function remove(key: string, storage: 'local' | 'session' = 'local'): void {
    if (!isClient) return
    
    const storageObj = storage === 'local' ? localStorage : sessionStorage
    storageObj.removeItem(`cache:${key}`)
  }
  
  /**
   * Limpiar caché expirado
   */
  function clearExpired(storage: 'local' | 'session' = 'local'): void {
    if (!isClient) return
    
    const storageObj = storage === 'local' ? localStorage : sessionStorage
    const keys = Object.keys(storageObj)
    const now = Date.now()
    
    keys.forEach(key => {
      if (key.startsWith('cache:')) {
        try {
          const item = storageObj.getItem(key)
          if (item) {
            const cacheItem: CacheItem<any> = JSON.parse(item)
            if (now > cacheItem.timestamp + cacheItem.ttl) {
              storageObj.removeItem(key)
            }
          }
        } catch (error) {
          // Si hay error al parsear, eliminar la clave
          storageObj.removeItem(key)
        }
      }
    })
  }
  
  /**
   * Limpiar todo el caché
   */
  function clear(storage: 'local' | 'session' = 'local'): void {
    if (!isClient) return
    
    const storageObj = storage === 'local' ? localStorage : sessionStorage
    const keys = Object.keys(storageObj)
    
    keys.forEach(key => {
      if (key.startsWith('cache:')) {
        storageObj.removeItem(key)
      }
    })
  }
  
  /**
   * Wrapper para funciones async con caché
   */
  async function wrap<T>(
    key: string,
    fn: () => Promise<T>,
    ttl: number = 3600000,
    storage: 'local' | 'session' = 'local'
  ): Promise<T> {
    // Intentar obtener del caché
    const cached = get<T>(key, storage)
    if (cached !== null) {
      return cached
    }
    
    // Ejecutar función y guardar resultado
    const result = await fn()
    set(key, result, ttl, storage)
    return result
  }
  
  return {
    get,
    set,
    remove,
    clear,
    clearExpired,
    wrap
  }
}

// Constantes de TTL comunes (en milisegundos)
export const CACHE_TTL = {
  SHORT: 5 * 60 * 1000,      // 5 minutos
  MEDIUM: 15 * 60 * 1000,    // 15 minutos
  LONG: 60 * 60 * 1000,      // 1 hora
  VERY_LONG: 24 * 60 * 60 * 1000 // 24 horas
}

