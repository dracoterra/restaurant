// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  
  modules: [
    '@nuxt/image',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  css: [
    '~/assets/css/main.css',
    '~/assets/css/theme/bootstrap.min.css',
    '~/assets/css/theme/slicknav.min.css',
    '~/assets/css/theme/swiper-bundle.min.css',
    '~/assets/css/theme/all.min.css',
    '~/assets/css/theme/animate.css',
    '~/assets/css/theme/magnific-popup.css',
    '~/assets/css/theme/mousecursor.css',
    '~/assets/css/theme/custom.css'
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3030',
      siteUrl: process.env.SITE_URL || 'http://localhost:3000'
    }
  },

  image: {
    domains: ['restaurant.local'],
    provider: 'ipx'
  },


  app: {
    head: {
      title: 'Restaurant',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Restaurant application' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Deshabilitar SSR globalmente para evitar problemas de hidratación
  ssr: false
})

