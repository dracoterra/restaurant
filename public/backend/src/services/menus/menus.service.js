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
      const { location = 'primary', slug = null } = query;

      // Primero intentar obtener por location (si hay theme activo)
      try {
        const locationQuery = `
          query GetMenuByLocation($location: MenuLocationEnum!) {
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
            }
          }
        `;

        const locationData = await retry(
          () => timeout(
            this.graphQLClient.request(locationQuery, { location: location.toUpperCase() }),
            5000,
            'Timeout al obtener menú por location'
          ),
          {
            retries: 1,
            delay: 500
          }
        );

        if (locationData.menuItems?.nodes && locationData.menuItems.nodes.length > 0) {
          return {
            data: this.transformMenuItems(locationData.menuItems.nodes),
            total: locationData.menuItems.nodes.length
          };
        }
      } catch (locationError) {
        logger.info('No se pudo obtener menú por location, intentando por slug o nombre:', locationError.message);
      }

      // Si falla por location, intentar obtener por slug o el primer menú disponible
      // Construir la query según si hay slug o no
      let menuQuery, menuVariables;
      
      if (slug) {
        menuQuery = `
          query GetMenuBySlug($slug: String!) {
            menus(first: 1, where: { slug: $slug }) {
              nodes {
                id
                databaseId
                name
                slug
                menuItems {
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
                }
              }
            }
          }
        `;
        menuVariables = { slug };
      } else {
        // Si no hay slug, obtener todos los menús y usar el primero
        menuQuery = `
          query GetAllMenus {
            menus(first: 10) {
              nodes {
                id
                databaseId
                name
                slug
                menuItems {
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
                }
              }
            }
          }
        `;
        menuVariables = {};
      }

      const menuData = await retry(
        () => timeout(
          this.graphQLClient.request(menuQuery, menuVariables),
          5000,
          'Timeout al obtener menú por slug'
        ),
        {
          retries: 2,
          delay: 1000,
          onRetry: (error, attempt, waitTime) => {
            logger.warn(`Reintentando obtener menú por slug (intento ${attempt}/${2 + 1}):`, error.message);
          }
        }
      );

      if (menuData.menus?.nodes && menuData.menus.nodes.length > 0) {
        const menu = menuData.menus.nodes[0];
        if (menu.menuItems?.nodes && menu.menuItems.nodes.length > 0) {
          return {
            data: this.transformMenuItems(menu.menuItems.nodes),
            total: menu.menuItems.nodes.length
          };
        }
      }

      // Si no hay menús, retornar menú por defecto
      logger.warn('No se encontraron menús en WordPress, usando estructura por defecto');
      return {
        data: this.getDefaultMenu(),
        total: 5
      };

    } catch (error) {
      logger.warn('Error al obtener menú de WordPress, usando estructura por defecto:', error.message);
      
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

