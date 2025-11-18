/**
 * Script para inspeccionar la estructura real de los campos ACF
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

async function inspectHomePageSections() {
  log('\n🔍 INSPECCIONANDO ESTRUCTURA DE HomePageSections\n', 'cyan');

  // Query para obtener homePageSections sin especificar campos internos
  const query = `
    query InspectHomePageSections($slug: ID!) {
      page(id: $slug, idType: URI) {
        id
        title
        slug
        homePageSections {
          __typename
        }
      }
    }
  `;

  try {
    const data = await graphQLClient.request(query, { slug: 'home' });
    log(`✅ Página encontrada: ${data.page.title}`, 'green');
    log(`   homePageSections existe: ${!!data.page.homePageSections}`, 'blue');
    
    if (data.page.homePageSections) {
      log(`   Tipo: ${data.page.homePageSections.__typename || 'N/A'}`, 'blue');
    }
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
  }

  // Intentar introspection más profunda
  const introspectionQuery = `
    query DeepIntrospect {
      __type(name: "HomePageSections") {
        name
        kind
        fields {
          name
          description
          type {
            name
            kind
            ofType {
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
    }
  `;

  try {
    const schema = await graphQLClient.request(introspectionQuery);
    log(`\n📋 Estructura completa de HomePageSections:`, 'cyan');
    
    if (schema.__type && schema.__type.fields) {
      schema.__type.fields.forEach(field => {
        const typeName = field.type.name || 
                        field.type.ofType?.name || 
                        field.type.kind || 
                        'Unknown';
        log(`   - ${field.name}: ${typeName}`, 'blue');
        if (field.description) {
          log(`     Descripción: ${field.description}`, 'yellow');
        }
      });
    } else {
      log(`   ⚠️  No se encontraron campos`, 'yellow');
    }
  } catch (error) {
    log(`⚠️  Error en introspection: ${error.message}`, 'yellow');
  }

  // Intentar obtener datos reales usando una query más simple
  const simpleQuery = `
    query GetHomePageSectionsSimple($slug: ID!) {
      page(id: $slug, idType: URI) {
        id
        homePageSections
      }
    }
  `;

  try {
    const simpleData = await graphQLClient.request(simpleQuery, { slug: 'home' });
    log(`\n📦 Datos raw de homePageSections:`, 'cyan');
    log(JSON.stringify(simpleData.page.homePageSections, null, 2), 'blue');
  } catch (error) {
    log(`⚠️  No se pudo obtener datos raw: ${error.message}`, 'yellow');
  }
}

async function checkAllACFFields() {
  log('\n🔍 VERIFICANDO TODOS LOS CAMPOS ACF DISPONIBLES\n', 'cyan');

  const query = `
    query CheckAllACF {
      __schema {
        types {
          name
          fields {
            name
          }
        }
      }
    }
  `;

  try {
    const schema = await graphQLClient.request(query);
    const acfTypes = schema.__schema.types.filter(type => 
      type.name && (
        type.name.includes('Page') ||
        type.name.includes('Section') ||
        type.name.includes('ACF') ||
        type.name.includes('Acf')
      )
    );

    log(`📋 Tipos relacionados con ACF/Page:`, 'cyan');
    acfTypes.forEach(type => {
      if (type.fields && type.fields.length > 0) {
        log(`\n   ${type.name}:`, 'green');
        type.fields.slice(0, 10).forEach(field => {
          log(`     - ${field.name}`, 'blue');
        });
        if (type.fields.length > 10) {
          log(`     ... y ${type.fields.length - 10} más`, 'yellow');
        }
      }
    });
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
  }
}

async function main() {
  console.clear();
  log('\n🔍 INSPECCIÓN PROFUNDA DE CAMPOS ACF\n', 'cyan');

  await inspectHomePageSections();
  await checkAllACFFields();
}

main().catch(error => {
  log(`\n❌ Error fatal: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

