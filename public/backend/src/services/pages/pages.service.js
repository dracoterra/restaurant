const { GraphQLClient } = require('graphql-request');
const logger = require('../../logger');
const retry = require('../../utils/retry');
const timeout = require('../../utils/timeout');

class PagesService {
  constructor(options) {
    this.options = options || {};
    this.wpGraphQLUrl = process.env.WP_GRAPHQL_URL || 'http://restaurant.local/graphql';
    this.wpUser = process.env.WP_USER || 'admin';
    this.wpPassword = process.env.WP_PASSWORD || '9203166sa';
    
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
    const { query = {} } = params;
    const { $skip = 0, $limit = 10, search = '', slug = '' } = query;

    try {
      // GraphQL query for pages
      const graphqlQuery = `
        query GetPages($first: Int, $after: String, $search: String, $slug: String) {
          pages(first: $first, after: $after, where: { search: $search, name: $slug }) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                databaseId
                title
                slug
                content
                excerpt
                date
                modified
                featuredImage {
                  node {
                    sourceUrl
                    altText
                    mediaDetails {
                      width
                      height
                    }
                  }
                }
                seo {
                  title
                  metaDesc
                  canonical
                }
              }
            }
          }
        }
      `;

      const variables = {
        first: $limit,
        after: query.after || null,
        search: search || '',
        slug: slug || ''
      };

      const data = await retry(
        () => timeout(
          this.graphQLClient.request(graphqlQuery, variables),
          10000,
          'Timeout al conectar con WordPress GraphQL'
        ),
        {
          retries: 2,
          delay: 1000,
          onRetry: (error, attempt, waitTime) => {
            logger.warn(`Reintentando petición GraphQL páginas (intento ${attempt}/${2 + 1}):`, error.message);
          }
        }
      );
      
      const pages = data.pages?.edges?.map(edge => this.transformPage(edge.node)) || [];
      
      return {
        data: pages,
        total: pages.length,
        limit: $limit,
        skip: $skip,
        pageInfo: data.pages?.pageInfo || { hasNextPage: false, endCursor: null }
      };
    } catch (error) {
      logger.error('Error al obtener páginas de WordPress:', error);
      throw new Error(`Error al obtener páginas: ${error.message}`);
    }
  }

  async get(id, params) {
    try {
      // Get page by slug
      const graphqlQuery = `
        query GetPageBySlug($slug: ID!) {
          page(id: $slug, idType: SLUG) {
            id
            databaseId
            title
            slug
            content
            excerpt
            date
            modified
            featuredImage {
              node {
                sourceUrl
                altText
                mediaDetails {
                  width
                  height
                }
              }
            }
            seo {
              title
              metaDesc
              canonical
            }
          }
        }
      `;

      const data = await retry(
        () => timeout(
          this.graphQLClient.request(graphqlQuery, { slug: id }),
          10000,
          'Timeout al conectar con WordPress GraphQL'
        ),
        {
          retries: 2,
          delay: 1000,
          onRetry: (error, attempt, waitTime) => {
            logger.warn(`Reintentando petición GraphQL página (intento ${attempt}/${2 + 1}):`, error.message);
          }
        }
      );
      
      if (!data.page) {
        throw new Error('Página no encontrada');
      }

      return this.transformPage(data.page);
    } catch (error) {
      logger.error('Error al obtener página de WordPress:', error);
      throw new Error(`Error al obtener página: ${error.message}`);
    }
  }

  transformPage(page) {
    return {
      id: page.id,
      databaseId: page.databaseId,
      title: page.title,
      slug: page.slug,
      content: page.content || '',
      excerpt: page.excerpt || '',
      date: page.date,
      modified: page.modified,
      featuredImage: page.featuredImage?.node ? {
        url: page.featuredImage.node.sourceUrl,
        alt: page.featuredImage.node.altText || '',
        width: page.featuredImage.node.mediaDetails?.width || null,
        height: page.featuredImage.node.mediaDetails?.height || null
      } : null,
      seo: page.seo || {}
    };
  }
}

module.exports = function (app) {
  app.use('/pages', new PagesService());
  
  const service = app.service('pages');
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

