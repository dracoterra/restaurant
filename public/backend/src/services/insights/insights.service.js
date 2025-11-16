const { GraphQLClient } = require('graphql-request');
const axios = require('axios');
const logger = require('../../logger');

class InsightsService {
  constructor(options) {
    this.options = options || {};
    this.wpGraphQLUrl = process.env.WP_GRAPHQL_URL || 'http://restaurant.local/graphql';
    this.wpRestUrl = process.env.WP_REST_URL || 'http://restaurant.local/wp-json/wp/v2';
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
    const { query = {} } = params;
    const { $skip = 0, $limit = 10, search = '' } = query;

    try {
      // GraphQL query for posts/insights
      const graphqlQuery = `
        query GetPosts($first: Int, $after: String, $search: String) {
          posts(first: $first, after: $after, where: { search: $search }) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                title
                slug
                excerpt
                content
                date
                modified
                author {
                  node {
                    name
                    slug
                  }
                }
                featuredImage {
                  node {
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
              }
            }
          }
        }
      `;

      const variables = {
        first: $limit,
        after: query.after || null,
        search: search || ''
      };

      const data = await this.graphQLClient.request(graphqlQuery, variables);
      
      const posts = data.posts.edges.map(edge => this.transformPost(edge.node));
      
      return {
        data: posts,
        total: posts.length,
        limit: $limit,
        skip: $skip,
        pageInfo: data.posts.pageInfo
      };
    } catch (error) {
      logger.error('Error fetching insights:', error);
      throw error;
    }
  }

  async get(id, params) {
    try {
      // Get post by slug
      const graphqlQuery = `
        query GetPostBySlug($slug: String!) {
          postBy(slug: $slug) {
            id
            title
            slug
            excerpt
            content
            date
            modified
            author {
              node {
                name
                slug
                avatar {
                  url
                }
              }
            }
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
          }
        }
      `;

      const data = await this.graphQLClient.request(graphqlQuery, { slug: id });
      
      if (!data.postBy) {
        throw new Error('Post not found');
      }

      return this.transformPost(data.postBy);
    } catch (error) {
      logger.error('Error fetching insight:', error);
      throw error;
    }
  }

  transformPost(post) {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      date: post.date,
      modified: post.modified,
      author: {
        name: post.author?.node?.name || '',
        slug: post.author?.node?.slug || '',
        avatar: post.author?.node?.avatar?.url || null
      },
      featuredImage: post.featuredImage?.node ? {
        url: post.featuredImage.node.sourceUrl,
        alt: post.featuredImage.node.altText || '',
        width: post.featuredImage.node.mediaDetails?.width || null,
        height: post.featuredImage.node.mediaDetails?.height || null
      } : null,
      categories: post.categories?.nodes || [],
      tags: post.tags?.nodes || []
    };
  }
}

module.exports = function (app) {
  app.use('/insights', new InsightsService());
  
  const service = app.service('insights');
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

