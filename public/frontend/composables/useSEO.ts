/**
 * Composable para manejo de SEO dinámico
 * Meta tags, structured data (JSON-LD), Open Graph, Twitter Cards
 */

import { useHead, useSeoMeta } from '#app'

export interface SEOData {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
  siteName?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  canonical?: string
}

export interface StructuredData {
  '@context'?: string
  '@type'?: string
  [key: string]: any
}

/**
 * Composable para SEO dinámico
 */
export function useSEO(data: SEOData, structuredData?: StructuredData) {
  const config = useRuntimeConfig()
  const route = useRoute()
  
  // URL base del sitio
  const siteUrl = config.public?.siteUrl || (process.client ? window.location.origin : '')
  const currentUrl = `${siteUrl}${route.path}`
  
  // Valores por defecto
  const defaultTitle = 'Restaurant - Delicious Food & Dining Experience'
  const defaultDescription = 'Experience the finest dining with our carefully crafted menu and exceptional service.'
  const defaultImage = `${siteUrl}/images/og-default.jpg`
  
  // Preparar datos
  const title = data.title || defaultTitle
  const description = data.description || defaultDescription
  const image = data.image || defaultImage
  const url = data.url || currentUrl
  const type = data.type || 'website'
  const siteName = data.siteName || 'Restaurant'
  
  // Meta tags básicos
  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'author', content: data.author || siteName },
      
      // Open Graph
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: siteName },
      
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      
      // Article (si es tipo article)
      ...(type === 'article' && data.publishedTime ? [
        { property: 'article:published_time', content: data.publishedTime },
        { property: 'article:modified_time', content: data.modifiedTime || data.publishedTime },
        { property: 'article:author', content: data.author || siteName }
      ] : [])
    ],
    link: [
      ...(data.canonical ? [{ rel: 'canonical', href: data.canonical }] : [
        { rel: 'canonical', href: url }
      ])
    ]
  })
  
  // Structured Data (JSON-LD)
  if (structuredData) {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(structuredData)
        }
      ]
    })
  }
  
  // Generar structured data básico si no se proporciona
  else if (process.client) {
    const basicStructuredData = generateBasicStructuredData({
      title,
      description,
      image,
      url,
      type,
      siteName,
      ...data
    })
    
    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(basicStructuredData)
        }
      ]
    })
  }
}

/**
 * Generar structured data básico
 */
function generateBasicStructuredData(data: SEOData & { siteName?: string }): StructuredData {
  const base = {
    '@context': 'https://schema.org',
    '@type': data.type === 'article' ? 'Article' : 'WebSite',
    name: data.title,
    description: data.description,
    url: data.url,
    ...(data.image && { image: data.image })
  }
  
  if (data.type === 'article') {
    return {
      ...base,
      '@type': 'Article',
      headline: data.title,
      datePublished: data.publishedTime,
      dateModified: data.modifiedTime || data.publishedTime,
      author: {
        '@type': 'Person',
        name: data.author || data.siteName
      },
      publisher: {
        '@type': 'Organization',
        name: data.siteName,
        logo: {
          '@type': 'ImageObject',
          url: data.image
        }
      }
    }
  }
  
  if (data.type === 'Restaurant') {
    return {
      ...base,
      '@type': 'Restaurant',
      servesCuisine: 'International',
      priceRange: '$$'
    }
  }
  
  return base
}

/**
 * Generar structured data para artículo/blog post
 */
export function generateArticleStructuredData(article: {
  title: string
  description: string
  image?: string
  url: string
  author: string
  publishedTime: string
  modifiedTime?: string
  siteName: string
}): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    url: article.url,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    author: {
      '@type': 'Person',
      name: article.author
    },
    publisher: {
      '@type': 'Organization',
      name: article.siteName,
      logo: {
        '@type': 'ImageObject',
        url: article.image
      }
    }
  }
}

/**
 * Generar structured data para organización
 */
export function generateOrganizationStructuredData(org: {
  name: string
  url: string
  logo?: string
  description?: string
  address?: {
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry?: string
  }
  contactPoint?: {
    telephone?: string
    contactType?: string
    email?: string
  }
}): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: org.name,
    url: org.url,
    ...(org.logo && { logo: org.logo }),
    ...(org.description && { description: org.description }),
    ...(org.address && {
      address: {
        '@type': 'PostalAddress',
        ...org.address
      }
    }),
    ...(org.contactPoint && {
      contactPoint: {
        '@type': 'ContactPoint',
        ...org.contactPoint
      }
    })
  }
}

