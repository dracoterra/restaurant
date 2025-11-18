const { GraphQLClient } = require('graphql-request');
const axios = require('axios');
const logger = require('../../logger');

/**
 * Servicio de debugging para verificar conexión con WordPress y campos ACF
 */
class DebugService {
  constructor(options) {
    this.options = options || {};
    this.wpGraphQLUrl = process.env.WP_GRAPHQL_URL || 'http://restaurant.local/graphql';
    this.wpRestUrl = process.env.WP_REST_URL || 'http://restaurant.local/wp-json/wp/v2';
    this.wpUser = process.env.WP_USER || 'admin';
    this.wpPassword = process.env.WP_PASSWORD || '';
    
    const credentials = Buffer.from(`${this.wpUser}:${this.wpPassword}`).toString('base64');
    this.authHeader = `Basic ${credentials}`;
    
    this.graphQLClient = new GraphQLClient(this.wpGraphQLUrl, {
      headers: {
        'Authorization': this.authHeader
      }
    });
  }

  /**
   * Verificar conexión con WordPress
   */
  async find(params) {
    const { query = {} } = params;
    const { action = 'status' } = query;

    try {
      switch (action) {
        case 'status':
          return await this.checkStatus();
        case 'graphql':
          return await this.testGraphQL();
        case 'rest':
          return await this.testREST();
        case 'acf':
          const { slug = 'home' } = query;
          return await this.checkAcfFields(slug);
        default:
          return {
            error: 'Invalid action',
            availableActions: ['status', 'graphql', 'rest', 'acf']
          };
      }
    } catch (error) {
      logger.error('Debug service error:', error);
      return {
        error: error.message,
        stack: error.stack
      };
    }
  }

  /**
   * Verificar estado general
   */
  async checkStatus() {
    const results = {
      timestamp: new Date().toISOString(),
      wordpress: {
        graphql: { connected: false, url: this.wpGraphQLUrl },
        rest: { connected: false, url: this.wpRestUrl }
      },
      authentication: {
        user: this.wpUser,
        hasPassword: !!this.wpPassword
      }
    };

    // Test GraphQL
    try {
      const testQuery = `{ __typename }`;
      await this.graphQLClient.request(testQuery);
      results.wordpress.graphql.connected = true;
    } catch (error) {
      results.wordpress.graphql.error = error.message;
    }

    // Test REST
    try {
      const response = await axios.get(`${this.wpRestUrl}/`, {
        headers: { 'Authorization': this.authHeader },
        timeout: 5000
      });
      results.wordpress.rest.connected = true;
      results.wordpress.rest.version = response.data?.version;
    } catch (error) {
      results.wordpress.rest.error = error.message;
    }

    return results;
  }

  /**
   * Probar GraphQL
   */
  async testGraphQL() {
    const query = `
      query TestQuery {
        __typename
        generalSettings {
          title
          description
        }
      }
    `;

    try {
      const data = await this.graphQLClient.request(query);
      return {
        success: true,
        data,
        message: 'GraphQL connection successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        response: error.response
      };
    }
  }

  /**
   * Probar REST API
   */
  async testREST() {
    try {
      const response = await axios.get(`${this.wpRestUrl}/`, {
        headers: { 'Authorization': this.authHeader },
        timeout: 5000
      });
      return {
        success: true,
        data: response.data,
        message: 'REST API connection successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.response?.status
      };
    }
  }

  /**
   * Verificar campos ACF de una página
   */
  async checkAcfFields(slug) {
    const query = `
      query CheckACFFields($slug: ID!) {
        page(id: $slug, idType: URI) {
          id
          databaseId
          title
          slug
          homePageSections {
            heroSubtitle
            heroTitle
            heroDescription
          }
          aboutPageSections {
            aboutContentSubtitle
            aboutContentTitle
            aboutContentDescription
          }
          contactPageSections {
            contactSubtitle
            contactTitle
          }
          servicesPageSections {
            servicesSubtitle
            servicesTitle
          }
        }
      }
    `;

    try {
      const data = await this.graphQLClient.request(query, { slug });
      
      const page = data.page;
      if (!page) {
        return {
          success: false,
          error: 'Page not found',
          slug
        };
      }

      const acfFields = {
        homePageSections: page.homePageSections,
        aboutPageSections: page.aboutPageSections,
        contactPageSections: page.contactPageSections,
        servicesPageSections: page.servicesPageSections
      };

      const analysis = {
        page: {
          id: page.id,
          slug: page.slug,
          title: page.title
        },
        acf: {
          hasAnyFields: !!(acfFields.homePageSections || acfFields.aboutPageSections || acfFields.contactPageSections || acfFields.servicesPageSections),
          sections: {}
        }
      };

      // Analizar cada sección
      for (const [sectionName, sectionData] of Object.entries(acfFields)) {
        analysis.acf.sections[sectionName] = {
          exists: !!sectionData,
          isEmpty: !sectionData || Object.keys(sectionData).length === 0,
          keys: sectionData ? Object.keys(sectionData) : [],
          sample: sectionData ? this.getSample(sectionData) : null
        };
      }

      return {
        success: true,
        ...analysis
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        graphqlErrors: error.response?.errors
      };
    }
  }

  /**
   * Obtener muestra de datos
   */
  getSample(obj, maxDepth = 2, currentDepth = 0) {
    if (currentDepth >= maxDepth) return '[max depth]';
    if (obj === null || obj === undefined) return null;
    if (typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) {
      return obj.slice(0, 2).map(item => this.getSample(item, maxDepth, currentDepth + 1));
    }

    const sample = {};
    const keys = Object.keys(obj).slice(0, 5);
    for (const key of keys) {
      const value = obj[key];
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sample[key] = this.getSample(value, maxDepth, currentDepth + 1);
      } else if (Array.isArray(value)) {
        sample[key] = `[Array(${value.length})]`;
      } else {
        sample[key] = value;
      }
    }
    return sample;
  }
}

module.exports = function (app) {
  app.use('/debug', new DebugService());
  
  const service = app.service('debug');
  service.hooks({
    before: {
      all: [],
      find: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  });
};

