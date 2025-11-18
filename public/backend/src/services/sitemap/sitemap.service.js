/**
 * Servicio para generar sitemap.xml
 * Genera sitemap dinámicamente desde WordPress
 */

const { GraphQLClient } = require('graphql-request');
const logger = require('../../logger');
const retry = require('../../utils/retry');
const timeout = require('../../utils/timeout');

class SitemapService {
  constructor(options) {
    this.options = options || {};
    this.wpGraphQLUrl = process.env.WP_GRAPHQL_URL || 'http://restaurant.local/graphql';
    this.wpUser = process.env.WP_USER || 'admin';
    this.wpPassword = process.env.WP_PASSWORD || '';
    this.siteUrl = process.env.SITE_URL || 'http://localhost:3000';
    
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
      // Obtener todas las páginas y posts
      const [pages, posts] = await Promise.all([
        this.getPages(),
        this.getPosts()
      ]);

      const sitemap = this.generateSitemap([...pages, ...posts]);
      
      return {
        xml: sitemap,
        contentType: 'application/xml'
      };
    } catch (error) {
      logger.error('Error generando sitemap:', error);
      throw new Error('Error al generar sitemap');
    }
  }

  async getPages() {
    const query = `
      query GetPages {
        pages(first: 100, where: { status: PUBLISH }) {
          nodes {
            slug
            modified
          }
        }
      }
    `;

    try {
      const data = await retry(
        () => timeout(
          this.graphQLClient.request(query),
          10000,
          'Timeout al obtener páginas para sitemap'
        ),
        { retries: 2, delay: 1000 }
      );

      return (data.pages?.nodes || []).map(page => ({
        loc: `${this.siteUrl}/${page.slug === 'home' ? '' : page.slug}`,
        lastmod: page.modified,
        changefreq: 'weekly',
        priority: page.slug === 'home' ? '1.0' : '0.8'
      }));
    } catch (error) {
      logger.warn('Error obteniendo páginas para sitemap:', error.message);
      return [];
    }
  }

  async getPosts() {
    const query = `
      query GetPosts {
        posts(first: 100, where: { status: PUBLISH }) {
          nodes {
            slug
            modified
          }
        }
      }
    `;

    try {
      const data = await retry(
        () => timeout(
          this.graphQLClient.request(query),
          10000,
          'Timeout al obtener posts para sitemap'
        ),
        { retries: 2, delay: 1000 }
      );

      return (data.posts?.nodes || []).map(post => ({
        loc: `${this.siteUrl}/insights/${post.slug}`,
        lastmod: post.modified,
        changefreq: 'monthly',
        priority: '0.6'
      }));
    } catch (error) {
      logger.warn('Error obteniendo posts para sitemap:', error.message);
      return [];
    }
  }

  generateSitemap(urls) {
    const urlsXml = urls.map(url => {
      const lastmod = url.lastmod ? new Date(url.lastmod).toISOString() : new Date().toISOString();
      return `  <url>
    <loc>${this.escapeXml(url.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
  }

  escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }
}

module.exports = function (app) {
  app.use('/sitemap', new SitemapService());
  
  const service = app.service('sitemap');
  service.hooks({
    before: {
      find: []
    },
    after: {
      find: [
        async (context) => {
          // El resultado ya es XML string, establecer headers
          context.params.headers = context.params.headers || {};
          context.params.headers['Content-Type'] = 'application/xml; charset=utf-8';
          context.params.headers['Cache-Control'] = 'public, max-age=3600'; // Cache 1 hora
        }
      ]
    },
    error: {
      find: []
    }
  });
};

