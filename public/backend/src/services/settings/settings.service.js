const { GraphQLClient } = require('graphql-request');
const axios = require('axios');
const logger = require('../../logger');
const retry = require('../../utils/retry');
const timeout = require('../../utils/timeout');
const cache = require('../../utils/cache');

class SettingsService {
  constructor(options) {
    this.options = options || {};
    this.wpGraphQLUrl = process.env.WP_GRAPHQL_URL || 'http://restaurant.local/graphql';
    this.wpRestUrl = process.env.WP_REST_URL || 'http://restaurant.local/wp-json/wp/v2';
    this.wpUser = process.env.WP_USER || 'admin';
    this.wpPassword = process.env.WP_PASSWORD || '';

    // Create Basic Auth header
    const credentials = Buffer.from(`${this.wpUser}:${this.wpPassword}`).toString('base64');
    this.authHeader = `Basic ${credentials}`;
    
    // Initialize GraphQL client
    this.graphQLClient = new GraphQLClient(this.wpGraphQLUrl, {
      headers: {
        'Authorization': this.authHeader
      }
    });
  }

  async find(params) {
    const cacheKey = 'settings:all';
    
    // Intentar obtener del caché primero
    const cached = cache.get(cacheKey, cache.TYPES.LONG);
    if (cached) {
      return cached;
    }
    
    try {
      const baseUrl = this.wpRestUrl.replace('/wp/v2', '');
      
      // 1. Obtener Site Info desde GraphQL (ya disponible nativamente)
      let siteInfo = null;
      try {
        const siteInfoQuery = `
          query {
            generalSettings {
              title
              description
              url
              email
              timezone
              dateFormat
              timeFormat
              startOfWeek
              language
            }
            readingSettings {
              postsPerPage
            }
          }
        `;
        const graphQLData = await retry(
          () => timeout(
            this.graphQLClient.request(siteInfoQuery),
            10000,
            'Timeout al obtener información del sitio desde GraphQL'
          ),
          { retries: 2, delay: 1000 }
        );
        
        if (graphQLData.generalSettings) {
          siteInfo = {
            name: graphQLData.generalSettings.title,
            description: graphQLData.generalSettings.description,
            url: graphQLData.generalSettings.url,
            admin_email: graphQLData.generalSettings.email,
            language: graphQLData.generalSettings.language,
            timezone: graphQLData.generalSettings.timezone,
            date_format: graphQLData.generalSettings.dateFormat,
            time_format: graphQLData.generalSettings.timeFormat,
            start_of_week: graphQLData.generalSettings.startOfWeek,
            posts_per_page: graphQLData.readingSettings?.postsPerPage || 10
          };
        }
      } catch (error) {
        logger.warn('No se pudo obtener site info desde GraphQL:', error.message);
      }
      
      // 2. Obtener Theme Mods (logo) - solo si el plugin está activo, sino usar fallback
      let logoData = null;
      try {
        const themeModsResponse = await retry(
          () => timeout(
            axios.get(`${baseUrl}/restaurant/v1/theme-mods`, {
              headers: { 'Authorization': this.authHeader }
            }),
            5000,
            'Timeout al obtener theme mods'
          ),
          { retries: 1, delay: 500 }
        );
        
        if (themeModsResponse.data?.custom_logo_url) {
          logoData = {
            url: themeModsResponse.data.custom_logo_url,
            data: themeModsResponse.data.custom_logo_data || null
          };
        }
      } catch (error) {
        // Si el plugin no está activo, intentar obtener desde ACF Options si existe
        logger.debug('Theme mods no disponibles, intentando ACF Options...');
      }
      
      // 3. Obtener Custom Settings desde ACF Options (si existe)
      // Esto obtiene datos reales de WordPress/ACF en lugar de hardcode
      let customSettings = null;
      try {
        const customSettingsResponse = await retry(
          () => timeout(
            axios.get(`${baseUrl}/restaurant/v1/settings`, {
              headers: { 'Authorization': this.authHeader }
            }),
            3000,
            'Timeout al obtener opciones personalizadas'
          ),
          { retries: 1, delay: 500 }
        );
        
        if (customSettingsResponse.data && Object.keys(customSettingsResponse.data).length > 0) {
          customSettings = customSettingsResponse.data;
          logger.info('✅ Datos obtenidos desde ACF Options/WordPress:', Object.keys(customSettings));
        }
      } catch (error) {
        // Si no existe endpoint personalizado, los valores por defecto se usarán
        logger.debug('ACF Options no disponibles, se usarán valores por defecto');
      }

      // Combinar datos - usar datos reales de WordPress cuando estén disponibles
      const settings = { ...this.getDefaultSettings() };
      
      // Site Info desde GraphQL (datos reales de WordPress)
      if (siteInfo) {
        settings.siteInfo = {
          ...siteInfo,
          theme: {
            name: 'Restaurant Theme',
            version: '1.0.0',
            template: 'restaurant-theme',
            stylesheet: 'restaurant-theme'
          }
        };
        // Usar datos reales para email si está disponible
        if (siteInfo.admin_email) {
          settings.email = siteInfo.admin_email;
        }
      }
      
      // Logo desde theme mods (si está disponible)
      if (logoData?.url) {
        settings.logo = logoData.url;
        settings.logoData = logoData.data;
      }
      
      // Custom Settings desde ACF Options o endpoint personalizado
      // Priorizar datos reales de WordPress sobre valores hardcodeados
      if (customSettings) {
        // Reemplazar valores hardcodeados con datos reales de WordPress/ACF
        if (customSettings.address) settings.address = customSettings.address;
        if (customSettings.phone) settings.phone = customSettings.phone;
        if (customSettings.email) settings.email = customSettings.email;
        if (customSettings.social_media) {
          // Mergear social media, pero priorizar valores de ACF
          settings.social_media = { ...settings.social_media, ...customSettings.social_media };
        }
        if (customSettings.copyright) settings.copyright = customSettings.copyright;
      }

      const result = {
        data: settings,
        total: 1
      };
      
      // Guardar en caché (1 hora)
      cache.set(cacheKey, result, cache.TYPES.LONG);
      
      return result;
    } catch (error) {
      logger.warn('Error al obtener configuración, usando valores por defecto:', error.message);
      const defaultResult = {
        data: this.getDefaultSettings(),
        total: 1
      };
      // Guardar valores por defecto en caché por menos tiempo (5 minutos)
      cache.set(cacheKey, defaultResult, cache.TYPES.SHORT);
      return defaultResult;
    }
  }

  getDefaultSettings() {
    return {
      logo: '/images/logo.svg',
      address: '4517 Washington Ave, Kentucky 39495',
      phone: '+01 780 859 632',
      email: 'info@restaurant.com',
      social_media: {
        facebook: '#',
        instagram: '#',
        dribbble: '#'
      },
      copyright: 'Copyright © 2025 All Rights Reserved.'
    };
  }

  async get(id, params) {
    return this.find(params);
  }
}

module.exports = function (app) {
  app.use('/settings', new SettingsService());

  const service = app.service('settings');
  service.hooks({
    before: {
      all: [],
      find: [],
      get: []
    },
    after: {
      all: [],
      find: [],
      get: []
    },
    error: {
      all: [],
      find: [],
      get: []
    }
  });
};

