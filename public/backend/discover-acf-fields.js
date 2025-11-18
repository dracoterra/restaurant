/**
 * Script para descubrir qué campos ACF están disponibles en GraphQL
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

async function discoverPageFields(slug) {
  log(`\n🔍 Descubriendo campos disponibles para página: ${slug}`, 'cyan');
  
  // Primero obtener la página básica
  const basicQuery = `
    query GetPageBasic($slug: ID!) {
      page(id: $slug, idType: URI) {
        id
        databaseId
        title
        slug
        __typename
      }
    }
  `;

  try {
    const basicData = await graphQLClient.request(basicQuery, { slug });
    
    if (!basicData.page) {
      log(`❌ Página "${slug}" no encontrada`, 'red');
      return;
    }

    log(`✅ Página encontrada: ${basicData.page.title}`, 'green');
    
    // Intentar obtener el schema completo usando introspection
    const introspectionQuery = `
      query IntrospectPage {
        __type(name: "Page") {
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
      const schema = await graphQLClient.request(introspectionQuery);
      log(`\n📋 Campos disponibles en tipo "Page":`, 'cyan');
      
      const acfFields = schema.__type.fields.filter(field => 
        field.name.includes('Section') || 
        field.name.includes('acf') || 
        field.name.includes('ACF') ||
        field.name.toLowerCase().includes('page')
      );

      if (acfFields.length > 0) {
        log(`\n🎯 Campos relacionados con ACF:`, 'green');
        acfFields.forEach(field => {
          log(`   - ${field.name} (${field.type.name || field.type.kind})`, 'blue');
        });
      } else {
        log(`\n⚠️  No se encontraron campos ACF obvios`, 'yellow');
      }

      // Mostrar todos los campos (primeros 20)
      log(`\n📋 Todos los campos disponibles (primeros 20):`, 'cyan');
      schema.__type.fields.slice(0, 20).forEach(field => {
        log(`   - ${field.name}`, 'blue');
      });

    } catch (introError) {
      log(`⚠️  No se pudo hacer introspection: ${introError.message}`, 'yellow');
    }

    // Intentar query con homePageSections para ver qué campos tiene
    const testQuery = `
      query TestHomePageSections($slug: ID!) {
        page(id: $slug, idType: URI) {
          id
          homePageSections {
            __typename
          }
        }
      }
    `;

    try {
      const testData = await graphQLClient.request(testQuery, { slug });
      if (testData.page?.homePageSections) {
        log(`\n✅ homePageSections existe`, 'green');
        
        // Intentar introspection del tipo HomePageSections
        const homePageSectionsIntro = `
          query IntrospectHomePageSections {
            __type(name: "HomePageSections") {
              name
              fields {
                name
                type {
                  name
                  kind
                }
              }
            }
          }
        `;

        try {
          const homeSchema = await graphQLClient.request(homePageSectionsIntro);
          log(`\n📋 Campos disponibles en "HomePageSections":`, 'green');
          homeSchema.__type.fields.forEach(field => {
            log(`   - ${field.name}`, 'blue');
          });
        } catch (e) {
          log(`⚠️  No se pudo obtener schema de HomePageSections`, 'yellow');
        }
      }
    } catch (testError) {
      log(`⚠️  homePageSections no disponible o tiene estructura diferente`, 'yellow');
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

async function main() {
  console.clear();
  log('\n🔍 DESCUBRIENDO CAMPOS ACF DISPONIBLES EN GRAPHQL\n', 'cyan');

  await discoverPageFields('home');
  await new Promise(resolve => setTimeout(resolve, 500));
  await discoverPageFields('about');
}

main().catch(error => {
  log(`\n❌ Error fatal: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

