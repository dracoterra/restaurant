/**
 * Script para probar la query ACF actualizada
 */

const { GraphQLClient } = require('graphql-request');
require('dotenv').config();

const WP_GRAPHQL_URL = process.env.WP_GRAPHQL_URL || 'http://restaurant.local/graphql';
const WP_USER = process.env.WP_USER || 'admin';
const WP_PASSWORD = process.env.WP_PASSWORD || '';

const credentials = Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString('base64');
const graphQLClient = new GraphQLClient(WP_GRAPHQL_URL, {
  headers: {
    'Authorization': `Basic ${credentials}`
  }
});

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testHomePageQuery() {
  log('\n🧪 PROBANDO QUERY ACTUALIZADA PARA HOME PAGE\n', 'cyan');

  const query = `
    query GetPageBySlugExtended($slug: ID!) {
      page(id: $slug, idType: URI) {
        id
        databaseId
        title
        slug
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
            dailyOfferSubtitle
            dailyOfferTitle
            dailyOfferDescription
            menuSubtitle
            menuTitle
            ingredientsSubtitle
            ingredientsTitle
            ingredientsDescription
            testimonialSubtitle
            testimonialTitle
            reserveSubtitle
            reserveTitle
          }
        }
      }
    }
  `;

  try {
    const data = await graphQLClient.request(query, { slug: 'home' });
    
    if (!data.page) {
      log('❌ Página no encontrada', 'red');
      return false;
    }

    log(`✅ Página encontrada: ${data.page.title}`, 'green');
    
    if (data.page.homePageSections?.homePageSections) {
      const sections = data.page.homePageSections.homePageSections;
      const keys = Object.keys(sections);
      
      log(`\n✅ homePageSections.homePageSections existe`, 'green');
      log(`   Campos encontrados: ${keys.length}`, 'blue');
      log(`   Keys: ${keys.slice(0, 15).join(', ')}${keys.length > 15 ? '...' : ''}`, 'blue');
      
      // Verificar algunos campos específicos
      const testFields = ['heroSubtitle', 'heroTitle', 'heroDescription', 'aboutSubtitle', 'aboutTitle'];
      log(`\n📋 Verificación de campos específicos:`, 'cyan');
      testFields.forEach(field => {
        const hasField = field in sections;
        const value = sections[field];
        log(`   ${hasField ? '✅' : '❌'} ${field}: ${value ? `"${String(value).substring(0, 30)}${String(value).length > 30 ? '...' : ''}"` : 'null'}`, 
            hasField && value ? 'green' : 'red');
      });
      
      return true;
    } else {
      log('❌ homePageSections.homePageSections no existe', 'red');
      if (data.page.homePageSections) {
        log('   Pero homePageSections existe directamente', 'yellow');
        log(`   Keys: ${Object.keys(data.page.homePageSections).join(', ')}`, 'yellow');
      }
      return false;
    }
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    if (error.response?.errors) {
      error.response.errors.forEach(err => {
        log(`   GraphQL Error: ${err.message}`, 'red');
      });
    }
    return false;
  }
}

async function main() {
  console.clear();
  log('\n🧪 TEST DE QUERY ACF ACTUALIZADA\n', 'cyan');

  const success = await testHomePageQuery();
  
  if (success) {
    log('\n✅ La query funciona correctamente!', 'green');
    log('   Los campos ACF están siendo obtenidos correctamente desde GraphQL', 'blue');
  } else {
    log('\n❌ La query necesita ajustes', 'red');
  }
}

main().catch(error => {
  log(`\n❌ Error fatal: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

