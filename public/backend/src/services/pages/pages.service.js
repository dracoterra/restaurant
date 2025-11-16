const { GraphQLClient } = require('graphql-request');
const axios = require('axios');
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
      // GraphQL query for pages - solo campos básicos que siempre están disponibles
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
      // Primero intentar con query básica
      let graphqlQuery = `
        query GetPageBySlug($slug: ID!) {
          page(id: $slug, idType: URI) {
            id
            databaseId
            title
            slug
            content
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
          }
        }
      `;

      let data;
      try {
        // Intentar query básica primero
        data = await retry(
          () => timeout(
            this.graphQLClient.request(graphqlQuery, { slug: id }),
            10000,
            'Timeout al conectar con WordPress GraphQL'
          ),
          {
            retries: 2,
            delay: 1000,
            onRetry: (error, attempt, waitTime) => {
              logger.warn(`Reintentando petición GraphQL página básica (intento ${attempt}/${2 + 1}):`, error.message);
            }
          }
        );
      } catch (error) {
        logger.error('Error al obtener página básica:', error);
        throw error;
      }

      // Si la página existe, intentar obtener campos adicionales si están disponibles
      if (data.page) {
        try {
          // Query extendida con campos opcionales
          const extendedQuery = `
            query GetPageBySlugExtended($slug: ID!) {
              page(id: $slug, idType: URI) {
                id
                databaseId
                title
                slug
                content
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
                aboutPageSections {
                  aboutContentSubtitle
                  aboutContentTitle
                  aboutContentDescription
                  aboutMainImage {
                    sourceUrl
                    altText
                    mediaDetails {
                      width
                      height
                    }
                  }
                  aboutSecondaryImage {
                    sourceUrl
                    altText
                    mediaDetails {
                      width
                      height
                    }
                  }
                  experienceYears
                  experienceText
                  aboutFeatures {
                    featureText
                  }
                  aboutDetails {
                    icon {
                      sourceUrl
                      altText
                      mediaDetails {
                        width
                        height
                      }
                    }
                    title
                    description
                  }
                  missionTitle
                  missionHeading
                  missionContent
                  missionImage {
                    sourceUrl
                    altText
                    mediaDetails {
                      width
                      height
                    }
                  }
                  visionTitle
                  visionHeading
                  visionContent
                  visionImage {
                    sourceUrl
                    altText
                    mediaDetails {
                      width
                      height
                    }
                  }
                  valueTitle
                  valueHeading
                  valueContent
                  valueImage {
                    sourceUrl
                    altText
                    mediaDetails {
                      width
                      height
                    }
                  }
                }
                homePageSections {
                  heroSubtitle
                  heroTitle
                  heroDescription
                  heroMainImage {
                    sourceUrl
                    altText
                    mediaDetails {
                      width
                      height
                    }
                  }
                  aboutSubtitle
                  aboutTitle
                  aboutDescription
                  dishesSubtitle
                  dishesTitle
                }
                contactPageSections {
                  contactSubtitle
                  contactTitle
                  contactDescription
                  mapEmbed
                }
                servicesPageSections {
                  servicesSubtitle
                  servicesTitle
                  servicesDescription
                  servicesItems {
                    icon {
                      sourceUrl
                      altText
                      mediaDetails {
                        width
                        height
                      }
                    }
                    title
                    description
                    link
                  }
                }
                menuPageSections {
                  menuSubtitle
                  menuTitle
                  menuDescription
                }
              }
            }
          `;

          const extendedData = await this.graphQLClient.request(extendedQuery, { slug: id });
          // Si la query extendida funciona, usar esos datos
          if (extendedData.page) {
            data = extendedData;
          }
        } catch (extendedError) {
          // Si los campos extendidos no están disponibles, usar los datos básicos
          logger.warn('Campos extendidos (ACF) no disponibles, usando datos básicos:', extendedError.message);
        }
      }

      if (!data.page) {
        throw new Error('Página no encontrada');
      }

      // Transformar página
      let transformedPage = this.transformPage(data.page);
      
      // Si no hay campos ACF, intentar leer desde meta fields de WordPress REST API
      const pageSlug = data.page.slug || id;
      
      if (!transformedPage.acf.homePageSections && (pageSlug === 'home' || pageSlug === 'front')) {
        try {
          const metaFields = await this.fetchPageMetaFields(data.page.databaseId);
          if (metaFields) {
            transformedPage.acf.homePageSections = this.transformMetaFieldsToACF(metaFields, 'home');
          }
        } catch (metaError) {
          logger.warn('No se pudieron obtener meta fields:', metaError.message);
        }
      }
      
      if (!transformedPage.acf.servicesPageSections && pageSlug === 'services') {
        try {
          const metaFields = await this.fetchPageMetaFields(data.page.databaseId);
          if (metaFields) {
            transformedPage.acf.servicesPageSections = this.transformMetaFieldsToACF(metaFields, 'services');
          }
        } catch (metaError) {
          logger.warn('No se pudieron obtener meta fields:', metaError.message);
        }
      }
      
      // Si no hay campos ACF de repeater, intentar leer desde meta fields
      if (!transformedPage.acf.aboutPageSections?.aboutFeatures && pageSlug === 'about') {
        try {
          const metaFields = await this.fetchPageMetaFields(data.page.databaseId);
          if (metaFields && metaFields.about_features) {
            const features = typeof metaFields.about_features === 'string' 
              ? JSON.parse(metaFields.about_features) 
              : metaFields.about_features;
            if (!transformedPage.acf.aboutPageSections) {
              transformedPage.acf.aboutPageSections = {};
            }
            transformedPage.acf.aboutPageSections.aboutFeatures = Array.isArray(features) ? features : [];
          }
          if (metaFields && metaFields.about_details) {
            const details = typeof metaFields.about_details === 'string' 
              ? JSON.parse(metaFields.about_details) 
              : metaFields.about_details;
            if (!transformedPage.acf.aboutPageSections) {
              transformedPage.acf.aboutPageSections = {};
            }
            transformedPage.acf.aboutPageSections.aboutDetails = Array.isArray(details) ? details : [];
          }
        } catch (metaError) {
          logger.warn('No se pudieron obtener meta fields de repeater:', metaError.message);
        }
      }
      
      if (!transformedPage.acf.servicesPageSections?.servicesItems && pageSlug === 'services') {
        try {
          const metaFields = await this.fetchPageMetaFields(data.page.databaseId);
          if (metaFields && metaFields.services_items) {
            const items = typeof metaFields.services_items === 'string' 
              ? JSON.parse(metaFields.services_items) 
              : metaFields.services_items;
            if (!transformedPage.acf.servicesPageSections) {
              transformedPage.acf.servicesPageSections = {};
            }
            transformedPage.acf.servicesPageSections.servicesItems = Array.isArray(items) ? items : [];
          }
        } catch (metaError) {
          logger.warn('No se pudieron obtener meta fields de services items:', metaError.message);
        }
      }

      return transformedPage;
    } catch (error) {
      logger.error('Error al obtener página de WordPress:', error);
      throw new Error(`Error al obtener página: ${error.message}`);
    }
  }

  transformPage(page) {
    const transformed = {
      id: page.id,
      databaseId: page.databaseId,
      title: page.title,
      slug: page.slug,
      content: page.content || '',
      excerpt: page.excerpt || '', // Puede no estar disponible
      date: page.date,
      modified: page.modified,
      featuredImage: page.featuredImage?.node ? {
        url: page.featuredImage.node.sourceUrl,
        alt: page.featuredImage.node.altText || '',
        width: page.featuredImage.node.mediaDetails?.width || null,
        height: page.featuredImage.node.mediaDetails?.height || null
      } : null,
      seo: page.seo || {}, // Puede no estar disponible
      acf: {}
    };

    // Transform ACF fields
    if (page.aboutPageSections) {
      transformed.acf.aboutPageSections = this.transformACFSection(page.aboutPageSections);
    }
    if (page.homePageSections) {
      transformed.acf.homePageSections = this.transformACFSection(page.homePageSections);
    }
    if (page.contactPageSections) {
      transformed.acf.contactPageSections = this.transformACFSection(page.contactPageSections);
    }
    if (page.servicesPageSections) {
      transformed.acf.servicesPageSections = this.transformACFSection(page.servicesPageSections);
    }
    if (page.menuPageSections) {
      transformed.acf.menuPageSections = this.transformACFSection(page.menuPageSections);
    }

    return transformed;
  }

  transformACFSection(section) {
    if (!section) return null;
    
    const transformed = {};
    
    for (const [key, value] of Object.entries(section)) {
      // Handle arrays (repeater fields)
      if (Array.isArray(value)) {
        transformed[key] = value.map(item => {
          if (typeof item === 'object' && item !== null) {
            const transformedItem = {};
            for (const [itemKey, itemValue] of Object.entries(item)) {
              // Transform image fields within repeater items
              if (itemValue && typeof itemValue === 'object' && itemValue.sourceUrl) {
                transformedItem[itemKey] = {
                  url: itemValue.sourceUrl,
                  alt: itemValue.altText || '',
                  width: itemValue.mediaDetails?.width || null,
                  height: itemValue.mediaDetails?.height || null
                };
              } else {
                transformedItem[itemKey] = itemValue;
              }
            }
            return transformedItem;
          }
          return item;
        });
      }
      // Transform image fields
      else if (value && typeof value === 'object' && value.sourceUrl) {
        transformed[key] = {
          url: value.sourceUrl,
          alt: value.altText || '',
          width: value.mediaDetails?.width || null,
          height: value.mediaDetails?.height || null
        };
      } else {
        transformed[key] = value;
      }
    }
    
    return transformed;
  }

  /**
   * Obtener meta fields de una página desde WordPress REST API
   */
  async fetchPageMetaFields(pageId) {
    try {
      const wpRestUrl = process.env.WP_REST_URL || 'http://restaurant.local/wp-json/wp/v2';
      const url = `${wpRestUrl}/pages/${pageId}?context=edit`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': this.authHeader
        }
      });
      
      return response.data.meta || {};
    } catch (error) {
      logger.error('Error al obtener meta fields:', error.message);
      return null;
    }
  }

  /**
   * Transformar meta fields a formato ACF
   */
  transformMetaFieldsToACF(metaFields, pageType) {
    // Helper para obtener valor de meta field (puede ser string serializado o array)
    const getMetaValue = (key, fallback = '') => {
      if (metaFields[key]) {
        // Si es un string que parece serializado, intentar deserializar
        if (typeof metaFields[key] === 'string' && (metaFields[key].startsWith('a:') || metaFields[key].startsWith('O:'))) {
          try {
            const unserialized = JSON.parse(metaFields[key]);
            return unserialized;
          } catch (e) {
            // Si no es JSON, devolver el string
            return metaFields[key];
          }
        }
        return metaFields[key];
      }
      return fallback;
    };
    
    if (pageType === 'home') {
      // Intentar leer desde campos individuales primero, luego desde arrays
      const heroSection = getMetaValue('_restaurant_hero_section') || {};
      const aboutSection = getMetaValue('_restaurant_about_section') || {};
      const dishesSection = getMetaValue('_restaurant_dishes_section') || {};
      
      return {
        heroSubtitle: getMetaValue('heroSubtitle') || (typeof heroSection === 'object' ? heroSection.subtitle : '') || '',
        heroTitle: getMetaValue('heroTitle') || (typeof heroSection === 'object' ? heroSection.title : '') || '',
        heroDescription: getMetaValue('heroDescription') || (typeof heroSection === 'object' ? heroSection.description : '') || '',
        heroMainImage: (getMetaValue('heroMainImage') || (typeof heroSection === 'object' ? heroSection.main_image : '')) ? {
          url: getMetaValue('heroMainImage') || (typeof heroSection === 'object' ? heroSection.main_image : ''),
          alt: '',
          width: null,
          height: null
        } : null,
        aboutSubtitle: getMetaValue('aboutSubtitle') || (typeof aboutSection === 'object' ? aboutSection.subtitle : '') || '',
        aboutTitle: getMetaValue('aboutTitle') || (typeof aboutSection === 'object' ? aboutSection.title : '') || '',
        aboutDescription: getMetaValue('aboutDescription') || (typeof aboutSection === 'object' ? aboutSection.description : '') || '',
        dishesSubtitle: getMetaValue('dishesSubtitle') || (typeof dishesSection === 'object' ? dishesSection.subtitle : '') || '',
        dishesTitle: getMetaValue('dishesTitle') || (typeof dishesSection === 'object' ? dishesSection.title : '') || ''
      };
    } else if (pageType === 'services') {
      const servicesSection = getMetaValue('_restaurant_services_section') || {};
      
      return {
        servicesSubtitle: getMetaValue('servicesSubtitle') || (typeof servicesSection === 'object' ? servicesSection.subtitle : '') || '',
        servicesTitle: getMetaValue('servicesTitle') || (typeof servicesSection === 'object' ? servicesSection.title : '') || '',
        servicesDescription: getMetaValue('servicesDescription') || (typeof servicesSection === 'object' ? servicesSection.description : '') || ''
      };
    }
    return {};
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

