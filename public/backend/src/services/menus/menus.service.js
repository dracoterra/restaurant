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

      // Estrategia 1: Si hay slug, obtener directamente por slug
      if (slug) {
        return await this.getMenuBySlug(slug);
      }

      // Estrategia 2: Intentar obtener por location usando menuItems
      try {
        const menuItems = await this.getMenuItemsByLocation(location);
        if (menuItems && menuItems.length > 0) {
          return {
            data: this.transformMenuItems(menuItems),
            total: menuItems.length
          };
        }
      } catch (locationError) {
        logger.info('No se pudo obtener menú por location, intentando obtener todos los menús:', locationError.message);
      }

      // Estrategia 3: Obtener todos los menús y filtrar por location
      const menu = await this.getMenuByLocationFromAllMenus(location);
      if (menu && menu.menuItems?.nodes && menu.menuItems.nodes.length > 0) {
        return {
          data: this.transformMenuItems(menu.menuItems.nodes),
          total: menu.menuItems.nodes.length
        };
      }

      // Estrategia 4: Si no hay menú asignado a la location, obtener el primer menú disponible
      const firstMenu = await this.getFirstAvailableMenu();
      if (firstMenu && firstMenu.menuItems?.nodes && firstMenu.menuItems.nodes.length > 0) {
        logger.info(`No se encontró menú asignado a location '${location}', usando el primer menú disponible: ${firstMenu.name}`);
        return {
          data: this.transformMenuItems(firstMenu.menuItems.nodes),
          total: firstMenu.menuItems.nodes.length
        };
      }

      // Si no hay menús disponibles, retornar array vacío
      logger.warn('No se encontraron menús en WordPress');
      return {
        data: [],
        total: 0
      };

    } catch (error) {
      logger.error('Error al obtener menú de WordPress:', error.message);
      logger.error('Error details:', {
        message: error.message,
        response: error.response,
        stack: error.stack
      });
      
      // Retornar array vacío en lugar de menú hardcodeado
      return {
        data: [],
        total: 0
      };
    }
  }

  /**
   * Obtener menú por slug
   */
  async getMenuBySlug(slug) {
    const query = `
      query GetMenuBySlug($slug: String!) {
        menus(first: 1, where: { slug: $slug }) {
          nodes {
            id
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

    const data = await retry(
      () => timeout(
        this.graphQLClient.request(query, { slug }),
        5000,
        'Timeout al obtener menú por slug'
      ),
      {
        retries: 2,
        delay: 1000
      }
    );

    if (data.menus?.nodes && data.menus.nodes.length > 0) {
      const menu = data.menus.nodes[0];
      if (menu.menuItems?.nodes && menu.menuItems.nodes.length > 0) {
        return {
          data: this.transformMenuItems(menu.menuItems.nodes),
          total: menu.menuItems.nodes.length
        };
      }
    }

    return null;
  }

  /**
   * Obtener menuItems directamente por location (requiere theme activo)
   */
  async getMenuItemsByLocation(location) {
    const query = `
      query GetMenuItemsByLocation($location: MenuLocationEnum!) {
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

    const data = await retry(
      () => timeout(
        this.graphQLClient.request(query, { location: location.toUpperCase() }),
        5000,
        'Timeout al obtener menú por location'
      ),
      {
        retries: 1,
        delay: 500
      }
    );

    return data.menuItems?.nodes || null;
  }

  /**
   * Obtener todos los menús y filtrar por location
   */
  async getMenuByLocationFromAllMenus(location) {
    const query = `
      query GetAllMenus {
        menus(first: 10) {
          nodes {
            id
            name
            slug
            locations
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

    const data = await retry(
      () => timeout(
        this.graphQLClient.request(query),
        5000,
        'Timeout al obtener todos los menús'
      ),
      {
        retries: 2,
        delay: 1000
      }
    );

    if (data.menus?.nodes && data.menus.nodes.length > 0) {
      // Buscar el menú que tenga la location asignada
      const locationUpper = location.toUpperCase();
      const menuWithLocation = data.menus.nodes.find(menu => {
        return menu.locations && menu.locations.includes(locationUpper);
      });

      return menuWithLocation || null;
    }

    return null;
  }

  /**
   * Obtener el primer menú disponible
   */
  async getFirstAvailableMenu() {
    const query = `
      query GetFirstMenu {
        menus(first: 1) {
          nodes {
            id
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

    const data = await retry(
      () => timeout(
        this.graphQLClient.request(query),
        5000,
        'Timeout al obtener primer menú'
      ),
      {
        retries: 1,
        delay: 500
      }
    );

    if (data.menus?.nodes && data.menus.nodes.length > 0) {
      return data.menus.nodes[0];
    }

    return null;
  }

  async get(id, params) {
    return this.find(params);
  }

  /**
   * Transformar menuItems de WordPress a formato del frontend
   */
  transformMenuItems(items) {
    if (!items || !Array.isArray(items)) {
      return [];
    }

    return items.map(item => ({
      id: item.id || item.menuItemId?.toString() || '',
      label: item.label || '',
      url: item.url || '',
      path: item.path || this.extractPathFromUrl(item.url),
      parentId: item.parentId || null,
      children: item.childItems?.nodes ? this.transformMenuItems(item.childItems.nodes) : []
    }));
  }

  /**
   * Extraer path de una URL completa
   */
  extractPathFromUrl(url) {
    if (!url) return '/';
    
    try {
      const urlObj = new URL(url);
      return urlObj.pathname || '/';
    } catch (e) {
      // Si no es una URL válida, asumir que es un path relativo
      return url.startsWith('/') ? url : `/${url}`;
    }
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
