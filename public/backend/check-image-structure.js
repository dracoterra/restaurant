/**
 * Script para verificar la estructura de campos de imagen en ACF
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

async function checkImageFieldStructure() {
  log('\n🔍 VERIFICANDO ESTRUCTURA DE CAMPOS DE IMAGEN\n', 'cyan');

  // Intentar diferentes estructuras
  const queries = [
    {
      name: 'Con node',
      query: `
        query TestImage1($slug: ID!) {
          page(id: $slug, idType: URI) {
            homePageSections {
              homePageSections {
                heroMainImage {
                  node {
                    sourceUrl
                    altText
                  }
                }
              }
            }
          }
        }
      `
    },
    {
      name: 'Directo',
      query: `
        query TestImage2($slug: ID!) {
          page(id: $slug, idType: URI) {
            homePageSections {
              homePageSections {
                heroMainImage {
                  sourceUrl
                  altText
                }
              }
            }
          }
        }
      `
    },
    {
      name: 'Con edges y node',
      query: `
        query TestImage3($slug: ID!) {
          page(id: $slug, idType: URI) {
            homePageSections {
              homePageSections {
                heroMainImage {
                  edges {
                    node {
                      sourceUrl
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      `
    }
  ];

  for (const test of queries) {
    try {
      log(`\n🧪 Probando: ${test.name}`, 'yellow');
      const data = await graphQLClient.request(test.query, { slug: 'home' });
      
      if (data.page?.homePageSections?.homePageSections?.heroMainImage) {
        log('✅ Estructura funciona!', 'green');
        log('Estructura:', JSON.stringify(data.page.homePageSections.homePageSections.heroMainImage, null, 2), 'blue');
        return test.query;
      } else {
        log('⚠️  No hay datos de imagen', 'yellow');
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

  // Intentar introspection del tipo
  log('\n🔍 Haciendo introspection del tipo...', 'cyan');
  const introQuery = `
    query IntrospectImageType {
      __type(name: "HomePageSectionsHomePageSections") {
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
    const heroMainImageField = schema.__type.fields.find(f => f.name === 'heroMainImage');
    if (heroMainImageField) {
      log(`\n📋 Tipo de heroMainImage:`, 'cyan');
      log(`   Nombre: ${heroMainImageField.type.name || 'N/A'}`, 'blue');
      log(`   Kind: ${heroMainImageField.type.kind}`, 'blue');
      log(`   OfType: ${heroMainImageField.type.ofType?.name || 'N/A'}`, 'blue');
    }
  } catch (error) {
    log(`❌ Error en introspection: ${error.message}`, 'red');
  }
}

checkImageFieldStructure().catch(error => {
  log(`\n❌ Error fatal: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

