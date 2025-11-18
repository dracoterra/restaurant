const { GraphQLClient } = require('graphql-request');
const axios = require('axios');
const { NotFound } = require('@feathersjs/errors');
const logger = require('../../logger');
const retry = require('../../utils/retry');
const timeout = require('../../utils/timeout');
const cache = require('../../utils/cache');

class PagesService {
  constructor(options) {
    this.options = options || {};
    this.wpGraphQLUrl = process.env.WP_GRAPHQL_URL || 'http://restaurant.local/graphql';
    this.wpUser = process.env.WP_USER || 'admin';
    this.wpPassword = process.env.WP_PASSWORD || '';
    
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
                homePageSections {
                  homePageSections {
                    heroSubtitle
                    heroTitle
                    heroDescription
                    heroMainImage {
                      node {
                        sourceUrl
                        altText
                        mediaDetails {
                          width
                          height
                        }
                      }
                    }
                    aboutSubtitle
                    aboutTitle
                    aboutDescription
                    dishesSubtitle
                    dishesTitle
                    dailyOfferImage {
                      node {
                        sourceUrl
                        altText
                        mediaDetails {
                          width
                          height
                        }
                      }
                    }
                    dailyOfferSubtitle
                    dailyOfferTitle
                    dailyOfferDescription
                    dailyOfferFeatures {
                      featureText
                    }
                    dailyOfferBurgerTitle
                    dailyOfferBurgerFeatures {
                      featureText
                    }
                    menuSubtitle
                    menuTitle
                    introVideoBg {
                      node {
                        sourceUrl
                        altText
                        mediaDetails {
                          width
                          height
                        }
                      }
                    }
                    introVideoUrl
                    ingredientsImage {
                      node {
                        sourceUrl
                        altText
                        mediaDetails {
                          width
                          height
                        }
                      }
                    }
                    ingredientsSubtitle
                    ingredientsTitle
                    ingredientsDescription
                    ingredientsFeatures {
                      icon {
                        node {
                          sourceUrl
                          altText
                          mediaDetails {
                            width
                            height
                          }
                        }
                      }
                      title
                    }
                    ingredientsHappyCustomers
                    ingredientsCustomerImages {
                      nodes {
                        sourceUrl
                        altText
                        mediaDetails {
                          width
                          height
                        }
                      }
                    }
                    ingredientsCounters {
                      icon {
                        node {
                          sourceUrl
                          altText
                          mediaDetails {
                            width
                            height
                          }
                        }
                      }
                      number
                      label
                    }
                    testimonialSubtitle
                    testimonialTitle
                    testimonials {
                      content
                      authorName
                      authorImage {
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
                    reserveSubtitle
                    reserveTitle
                    reserveHours {
                      days
                      time
                    }
                  }
                }
              }
            }
          `;

          const extendedData = await this.graphQLClient.request(extendedQuery, { slug: id });
          // Si la query extendida funciona, usar esos datos
          if (extendedData.page) {
            data = extendedData;
            logger.info('✅ Query extendida exitosa, datos ACF obtenidos');
          }
        } catch (extendedError) {
          // Si los campos extendidos no están disponibles, usar los datos básicos
          logger.warn('Campos extendidos (ACF) no disponibles, usando datos básicos:', extendedError.message);
          if (extendedError.response?.errors) {
            logger.error('Errores GraphQL en query extendida:');
            extendedError.response.errors.forEach(err => {
              logger.error(`  - ${err.message}`);
              if (err.locations) {
                err.locations.forEach(loc => {
                  logger.error(`    Línea ${loc.line}, Columna ${loc.column}`);
                });
              }
            });
          }
        }
      }

      if (!data.page) {
        throw new NotFound(`Página con slug "${id}" no encontrada`);
      }

      // Log para debugging ACF
      logger.info('=== ACF DEBUG - Page Data ===');
      logger.info('Page Slug:', id);
      logger.info('Has homePageSections:', !!data.page.homePageSections);
      logger.info('Has homePageSections.homePageSections:', !!data.page.homePageSections?.homePageSections);
      
      if (data.page.homePageSections?.homePageSections) {
        const innerKeys = Object.keys(data.page.homePageSections.homePageSections);
        logger.info('Home Page Sections (inner) Keys Count:', innerKeys.length);
        logger.info('Home Page Sections (inner) Sample Keys:', innerKeys.slice(0, 10).join(', '));
      } else if (data.page.homePageSections) {
        logger.info('Home Page Sections (direct) Keys:', Object.keys(data.page.homePageSections));
      }
      
      logger.info('Has aboutPageSections:', !!data.page.aboutPageSections);
      logger.info('Has contactPageSections:', !!data.page.contactPageSections);
      logger.info('Has servicesPageSections:', !!data.page.servicesPageSections);

      // Transformar página
      let transformedPage = this.transformPage(data.page);
      
      // Obtener body classes para esta página (solo si el plugin está activo)
      try {
        const baseUrl = this.wpRestUrl.replace('/wp/v2', '');
        const bodyClassesResponse = await axios.get(`${baseUrl}/restaurant/v1/body-classes`, {
          headers: { 'Authorization': this.authHeader },
          params: {
            slug: id,
            post_type: 'page'
          }
        }, { timeout: 3000 });
        
        if (bodyClassesResponse.data && bodyClassesResponse.data.classes) {
          transformedPage.bodyClasses = bodyClassesResponse.data.classes;
          transformedPage.bodyClassesString = bodyClassesResponse.data.classes_string;
        }
      } catch (error) {
        // Si falla, generar clases básicas basadas en el slug (sin hardcode)
        const slug = transformedPage.slug || id;
        transformedPage.bodyClasses = ['page', `page-${slug}`];
        transformedPage.bodyClassesString = transformedPage.bodyClasses.join(' ');
      }
      
      // Log después de transformar
      logger.info('After Transform - Has ACF:', !!transformedPage.acf);
      if (transformedPage.acf) {
        const acfKeys = Object.keys(transformedPage.acf);
        logger.info('Transformed ACF Keys:', acfKeys);
        
        // Log detallado de homePageSections si existe
        if (transformedPage.acf.homePageSections) {
          const homeKeys = Object.keys(transformedPage.acf.homePageSections);
          logger.info('Transformed homePageSections Keys Count:', homeKeys.length);
          logger.info('Transformed homePageSections Sample Keys:', homeKeys.slice(0, 10).join(', '));
        }
      }
      
      // Si no hay campos ACF, intentar leer desde meta fields de WordPress REST API
      const pageSlug = data.page.slug || id;
      
      if (!transformedPage.acf.homePageSections && (pageSlug === 'home' || pageSlug === 'front') && !data.page.homePageSections?.homePageSections) {
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
      // Si el error ya es un error de FeathersJS, re-lanzarlo
      if (error.code && error.name) {
        throw error;
      }
      // Si es un error de GraphQL que indica que la página no existe
      if (error.response?.errors) {
        const graphqlErrors = error.response.errors;
        const notFoundError = graphqlErrors.find(err => 
          err.message && err.message.toLowerCase().includes('not found') ||
          err.message && err.message.toLowerCase().includes('no existe')
        );
        if (notFoundError) {
          throw new NotFound(`Página con slug "${id}" no encontrada`);
        }
      }
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
    // homePageSections tiene estructura anidada: homePageSections.homePageSections
    if (page.homePageSections?.homePageSections) {
      transformed.acf.homePageSections = this.transformACFSection(page.homePageSections.homePageSections);
      logger.info('✅ homePageSections transformado correctamente');
    } else if (page.homePageSections) {
      // Fallback: si no tiene estructura anidada, intentar directamente
      transformed.acf.homePageSections = this.transformACFSection(page.homePageSections);
      logger.warn('⚠️ homePageSections sin estructura anidada, usando directamente');
    }
    
    // aboutPageSections, contactPageSections, servicesPageSections pueden no estar en GraphQL
    // Se intentarán obtener desde REST API como fallback
    if (page.aboutPageSections?.aboutPageSections) {
      // Si tiene estructura anidada
      transformed.acf.aboutPageSections = this.transformACFSection(page.aboutPageSections.aboutPageSections);
    } else if (page.aboutPageSections) {
      transformed.acf.aboutPageSections = this.transformACFSection(page.aboutPageSections);
    }
    
    if (page.contactPageSections?.contactPageSections) {
      transformed.acf.contactPageSections = this.transformACFSection(page.contactPageSections.contactPageSections);
    } else if (page.contactPageSections) {
      transformed.acf.contactPageSections = this.transformACFSection(page.contactPageSections);
    }
    
    if (page.servicesPageSections?.servicesPageSections) {
      transformed.acf.servicesPageSections = this.transformACFSection(page.servicesPageSections.servicesPageSections);
    } else if (page.servicesPageSections) {
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
      // Handle gallery fields (objects with nodes property)
      if (value && typeof value === 'object' && value.nodes && Array.isArray(value.nodes)) {
        transformed[key] = {
          nodes: value.nodes.map(node => ({
            url: node.sourceUrl,
            alt: node.altText || '',
            width: node.mediaDetails?.width || null,
            height: node.mediaDetails?.height || null
          }))
        };
      }
      // Handle arrays (repeater fields)
      else if (Array.isArray(value)) {
        transformed[key] = value.map(item => {
          if (typeof item === 'object' && item !== null) {
            const transformedItem = {};
            for (const [itemKey, itemValue] of Object.entries(item)) {
              // Transform image fields within repeater items (pueden venir con node o directamente)
              if (itemValue && typeof itemValue === 'object') {
                // Si tiene node, es un AcfMediaItemConnectionEdge
                if (itemValue.node && itemValue.node.sourceUrl) {
                  transformedItem[itemKey] = {
                    url: itemValue.node.sourceUrl,
                    alt: itemValue.node.altText || '',
                    width: itemValue.node.mediaDetails?.width || null,
                    height: itemValue.node.mediaDetails?.height || null
                  };
                }
                // Si tiene sourceUrl directamente
                else if (itemValue.sourceUrl) {
                  transformedItem[itemKey] = {
                    url: itemValue.sourceUrl,
                    alt: itemValue.altText || '',
                    width: itemValue.mediaDetails?.width || null,
                    height: itemValue.mediaDetails?.height || null
                  };
                } else {
                  transformedItem[itemKey] = itemValue;
                }
              } else {
                transformedItem[itemKey] = itemValue;
              }
            }
            return transformedItem;
          }
          return item;
        });
      }
      // Transform image fields (pueden venir con node o directamente)
      else if (value && typeof value === 'object') {
        // Si tiene node, es un AcfMediaItemConnectionEdge
        if (value.node && value.node.sourceUrl) {
          transformed[key] = {
            url: value.node.sourceUrl,
            alt: value.node.altText || '',
            width: value.node.mediaDetails?.width || null,
            height: value.node.mediaDetails?.height || null
          };
        }
        // Si tiene sourceUrl directamente
        else if (value.sourceUrl) {
          transformed[key] = {
            url: value.sourceUrl,
            alt: value.altText || '',
            width: value.mediaDetails?.width || null,
            height: value.mediaDetails?.height || null
          };
        } else {
          transformed[key] = value;
        }
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

