/**
 * Generador de sitemap.xml para Nuxt
 * Obtiene el sitemap desde el backend
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBase = config.public?.apiBase || 'http://localhost:3030'
  
  try {
    const response = await $fetch<string>(`${apiBase}/sitemap`, {
      headers: {
        'Accept': 'application/xml'
      }
    })
    
    event.node.res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    event.node.res.setHeader('Cache-Control', 'public, max-age=3600') // Cache 1 hora
    
    return response
  } catch (error) {
    event.node.res.statusCode = 500
    return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'
  }
})

