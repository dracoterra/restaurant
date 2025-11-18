/**
 * Script para verificar campos de AcfMediaItemConnectionEdge
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

async function checkEdgeFields() {
  log('\n🔍 VERIFICANDO CAMPOS DE AcfMediaItemConnectionEdge\n', 'cyan');

  const introQuery = `
    query IntrospectEdge {
      __type(name: "AcfMediaItemConnectionEdge") {
        name
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
  `;

  try {
    const schema = await graphQLClient.request(introQuery);
    log('📋 Campos disponibles en AcfMediaItemConnectionEdge:', 'cyan');
    schema.__type.fields.forEach(field => {
      const typeName = field.type.name || field.type.ofType?.name || field.type.kind;
      log(`   - ${field.name}: ${typeName}`, 'blue');
    });

    // Probar query con node
    log('\n🧪 Probando query con node...', 'yellow');
    const testQuery = `
      query TestWithNode($slug: ID!) {
        page(id: $slug, idType: URI) {
          homePageSections {
            homePageSections {
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
            }
          }
        }
      }
    `;

    const data = await graphQLClient.request(testQuery, { slug: 'home' });
    if (data.page?.homePageSections?.homePageSections?.heroMainImage) {
      log('✅ Query con node funciona!', 'green');
      log('Estructura:', JSON.stringify(data.page.homePageSections.homePageSections.heroMainImage, null, 2), 'blue');
    }
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    if (error.response?.errors) {
      error.response.errors.forEach(err => {
        log(`   ${err.message}`, 'red');
      });
    }
  }
}

checkEdgeFields().catch(error => {
  log(`\n❌ Error fatal: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

