const axios = require('axios');
const logger = require('../../logger');
const retry = require('../../utils/retry');
const timeout = require('../../utils/timeout');

class SettingsService {
  constructor(options) {
    this.options = options || {};
    this.wpRestUrl = process.env.WP_REST_URL || 'http://restaurant.local/wp-json/wp/v2';
    this.wpUser = process.env.WP_USER || 'admin';
    this.wpPassword = process.env.WP_PASSWORD || 'root';

    // Create Basic Auth header
    const credentials = Buffer.from(`${this.wpUser}:${this.wpPassword}`).toString('base64');
    this.authHeader = `Basic ${credentials}`;
  }

  async find(params) {
    try {
      // Obtener opciones del tema desde WordPress REST API
      // Primero intentamos con nuestro endpoint personalizado
      const response = await retry(
        () => timeout(
          axios.get(`${this.wpRestUrl.replace('/wp/v2', '')}/restaurant/v1/settings`, {
            headers: {
              'Authorization': this.authHeader
            }
          }),
          10000,
          'Timeout al obtener opciones del tema'
        ),
        {
          retries: 2,
          delay: 1000,
          onRetry: (error, attempt, waitTime) => {
            logger.warn(`Reintentando obtener opciones (intento ${attempt}/${2 + 1}):`, error.message);
          }
        }
      );

      return {
        data: response.data || this.getDefaultSettings(),
        total: 1
      };
    } catch (error) {
      // Si no existe el endpoint, retornamos estructura por defecto
      logger.warn('No se pudo obtener opciones del tema, usando valores por defecto:', error.message);
      
      return {
        data: this.getDefaultSettings(),
        total: 1
      };
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

