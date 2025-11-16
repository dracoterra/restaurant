const { GraphQLClient } = require('graphql-request');
const logger = require('../../logger');
const retry = require('../../utils/retry');
const timeout = require('../../utils/timeout');

class ProductsService {
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
    const { $skip = 0, $limit = 10, search = '', category = '', status = 'publish' } = query;

    try {
      const graphqlQuery = `
        query GetProducts($first: Int, $after: String, $search: String, $category: String, $status: [PostStatusEnum]) {
          products(first: $first, after: $after, where: { search: $search, category: $category, status: $status }) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                databaseId
                name
                slug
                description
                shortDescription
                price
                regularPrice
                salePrice
                onSale
                stockStatus
                stockQuantity
                featured
                date
                modified
                image {
                  sourceUrl
                  altText
                  mediaDetails {
                    width
                    height
                  }
                }
                galleryImages {
                  nodes {
                    sourceUrl
                    altText
                  }
                }
                categories {
                  nodes {
                    name
                    slug
                  }
                }
                attributes {
                  nodes {
                    name
                    options
                  }
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
        category: category || '',
        status: status ? [status.toUpperCase()] : ['PUBLISH']
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
            logger.warn(`Reintentando petición GraphQL productos (intento ${attempt}/${2 + 1}):`, error.message);
          }
        }
      );
      
      const products = data.products?.edges?.map(edge => this.transformProduct(edge.node)) || [];
      
      return {
        data: products,
        total: products.length,
        limit: $limit,
        skip: $skip,
        pageInfo: data.products?.pageInfo || { hasNextPage: false, endCursor: null }
      };
    } catch (error) {
      logger.error('Error fetching products:', error);
      
      if (error.response) {
        const graphqlError = new Error(error.response.errors?.[0]?.message || 'Error fetching products from WordPress');
        graphqlError.statusCode = error.response.status || 500;
        throw graphqlError;
      }
      
      if (error.message) {
        const standardError = new Error(error.message);
        standardError.statusCode = 500;
        throw standardError;
      }
      
      throw new Error('Error desconocido al obtener productos');
    }
  }

  async get(id, params) {
    try {
      const graphqlQuery = `
        query GetProductBySlug($slug: String!) {
          productBy(slug: $slug) {
            id
            databaseId
            name
            slug
            description
            shortDescription
            price
            regularPrice
            salePrice
            onSale
            stockStatus
            stockQuantity
            featured
            date
            modified
            image {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
            galleryImages {
              nodes {
                sourceUrl
                altText
                mediaDetails {
                  width
                  height
                }
              }
            }
            categories {
              nodes {
                name
                slug
              }
            }
            tags {
              nodes {
                name
                slug
              }
            }
            attributes {
              nodes {
                name
                options
              }
            }
            variations {
              nodes {
                id
                name
                price
                stockStatus
                attributes {
                  nodes {
                    name
                    value
                  }
                }
              }
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
            logger.warn(`Reintentando petición GraphQL producto (intento ${attempt}/${2 + 1}):`, error.message);
          }
        }
      );
      
      if (!data.productBy) {
        throw new Error('Producto no encontrado');
      }

      return this.transformProduct(data.productBy);
    } catch (error) {
      logger.error('Error fetching product:', error);
      
      if (error.response) {
        const graphqlError = new Error(error.response.errors?.[0]?.message || 'Error fetching product from WordPress');
        graphqlError.statusCode = error.response.status || 404;
        throw graphqlError;
      }
      
      if (error.message) {
        const standardError = new Error(error.message);
        standardError.statusCode = 404;
        throw standardError;
      }
      
      throw new Error('Error desconocido al obtener producto');
    }
  }

  transformProduct(product) {
    return {
      id: product.id,
      databaseId: product.databaseId,
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      price: product.price,
      regularPrice: product.regularPrice,
      salePrice: product.salePrice,
      onSale: product.onSale || false,
      stockStatus: product.stockStatus,
      stockQuantity: product.stockQuantity,
      featured: product.featured || false,
      date: product.date,
      modified: product.modified,
      image: product.image ? {
        url: product.image.sourceUrl,
        alt: product.image.altText || '',
        width: product.image.mediaDetails?.width || null,
        height: product.image.mediaDetails?.height || null
      } : null,
      galleryImages: product.galleryImages?.nodes?.map(img => ({
        url: img.sourceUrl,
        alt: img.altText || ''
      })) || [],
      categories: product.categories?.nodes || [],
      tags: product.tags?.nodes || [],
      attributes: product.attributes?.nodes || [],
      variations: product.variations?.nodes || []
    };
  }
}

module.exports = function (app) {
  app.use('/products', new ProductsService());
  
  const service = app.service('products');
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

