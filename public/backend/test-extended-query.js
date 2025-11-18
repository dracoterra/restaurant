/**
 * Script para probar la query extendida completa
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

async function testExtendedQuery() {
  log('\n🧪 PROBANDO QUERY EXTENDIDA COMPLETA\n', 'cyan');

  const query = `
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
          }
        }
        aboutPageSections {
          aboutContentSubtitle
          aboutContentTitle
          aboutContentDescription
          aboutMainImage {
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
  `;

  try {
    const data = await graphQLClient.request(query, { slug: 'home' });
    
    if (!data.page) {
      log('❌ Página no encontrada', 'red');
      return false;
    }

    log(`✅ Página encontrada: ${data.page.title}`, 'green');
    
    if (data.page.homePageSections?.homePageSections) {
      log('✅ homePageSections.homePageSections existe', 'green');
      const keys = Object.keys(data.page.homePageSections.homePageSections);
      log(`   Campos: ${keys.length}`, 'blue');
      log(`   Keys: ${keys.slice(0, 5).join(', ')}...`, 'blue');
    } else {
      log('❌ homePageSections.homePageSections NO existe', 'red');
    }
    
    if (data.page.aboutPageSections) {
      log('✅ aboutPageSections existe', 'green');
    } else {
      log('⚠️  aboutPageSections NO existe (esto es normal si no está configurado)', 'yellow');
    }
    
    return true;
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    if (error.response?.errors) {
      log('\n📋 Errores GraphQL:', 'cyan');
      error.response.errors.forEach(err => {
        log(`   ❌ ${err.message}`, 'red');
        if (err.locations) {
          err.locations.forEach(loc => {
            log(`      Línea ${loc.line}, Columna ${loc.column}`, 'yellow');
          });
        }
        if (err.path) {
          log(`      Path: ${err.path.join(' -> ')}`, 'yellow');
        }
      });
    }
    return false;
  }
}

testExtendedQuery().catch(error => {
  log(`\n❌ Error fatal: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

