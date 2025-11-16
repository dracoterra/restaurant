const { GraphQLClient } = require('graphql-request');
const logger = require('../../logger');
const retry = require('../../utils/retry');
const timeout = require('../../utils/timeout');

class MenusService {
  constructor(options) {
    this.options = options || {};
    this.wpGraphQLUrl = process.env.WP_GRAPHQL_URL || 'http://restaurant.local/graphql';
    this.wpUser = process.env.WP_USER || 'admin';
    this.wpPassword = process.env.WP_PASSWORD || 'root';

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
    try {
      const { query = {} } = params;
      const { location = 'primary' } = query;

      // Obtener menú por ubicación usando GraphQL
      const graphqlQuery = `
        query GetMenu($location: MenuLocationEnum!) {
          menuItems(where: {location: $location}) {
            nodes {
              id
              label
              url
              path
              parentId
              menuItemId
              childItems {
                nodes {
                  id
                  label
                  url
                  path
                  parentId
                  menuItemId
                }
              }
            }
          }
        }
      `;

      const data = await retry(
        () => timeout(
          this.graphQLClient.request(graphqlQuery, { location: location.toUpperCase() }),
          10000,
          'Timeout al obtener menú de WordPress'
        ),
        {
          retries: 2,
          delay: 1000,
          onRetry: (error, attempt, waitTime) => {
            logger.warn(`Reintentando obtener menú (intento ${attempt}/${2 + 1}):`, error.message);
          }
        }
      );

      return {
        data: this.transformMenuItems(data.menuItems?.nodes || []),
        total: data.menuItems?.nodes?.length || 0
      };
    } catch (error) {
      logger.warn('No se pudo obtener menú de WordPress, usando estructura por defecto:', error.message);
      
      // Retornar menú por defecto
      return {
        data: this.getDefaultMenu(),
        total: 5
      };
    }
  }

  async get(id, params) {
    return this.find(params);
  }

  transformMenuItems(items) {
    return items.map(item => ({
      id: item.id,
      label: item.label,
      url: item.url,
      path: item.path,
      parentId: item.parentId,
      children: item.childItems?.nodes ? this.transformMenuItems(item.childItems.nodes) : []
    }));
  }

  getDefaultMenu() {
    return [
      { id: '1', label: 'Home', url: '/', path: '/', parentId: null, children: [] },
      { id: '2', label: 'About Us', url: '/about', path: '/about', parentId: null, children: [] },
      { id: '3', label: 'Services', url: '/services', path: '/services', parentId: null, children: [] },
      { id: '4', label: 'Menu', url: '/menu', path: '/menu', parentId: null, children: [] },
      { id: '5', label: 'Contact Us', url: '/contact', path: '/contact', parentId: null, children: [] }
    ];
  }
}

module.exports = function (app) {
  app.use('/menus', new MenusService());

  const service = app.service('menus');
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

