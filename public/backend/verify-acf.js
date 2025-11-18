/**
 * Script de verificación de campos ACF
 * Ejecutar con: node verify-acf.js (desde el directorio backend)
 */

const { GraphQLClient } = require('graphql-request');
require('dotenv').config();

const WP_GRAPHQL_URL = process.env.WP_GRAPHQL_URL || 'http://restaurant.local/graphql';
const WP_USER = process.env.WP_USER || 'admin';
const WP_PASSWORD = process.env.WP_PASSWORD || '';

// Crear cliente GraphQL
const credentials = Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString('base64');
const graphQLClient = new GraphQLClient(WP_GRAPHQL_URL, {
  headers: {
    'Authorization': `Basic ${credentials}`
  }
});

// Colores para consola
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

function logSection(title) {
  console.log(`\n${colors.cyan}${'='.repeat(50)}${colors.reset}`);
  log(title, 'cyan');
  console.log(`${colors.cyan}${'='.repeat(50)}${colors.reset}\n`);
}

async function verifyConnection() {
  logSection('1. VERIFICANDO CONEXIÓN CON WORDPRESS');
  
  try {
    const query = `{ __typename }`;
    await graphQLClient.request(query);
    log('✅ Conexión GraphQL exitosa', 'green');
    log(`   URL: ${WP_GRAPHQL_URL}`, 'blue');
    return true;
  } catch (error) {
    log('❌ Error de conexión GraphQL', 'red');
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

async function verifyPageACF(slug) {
  logSection(`2. VERIFICANDO CAMPOS ACF - PÁGINA: ${slug.toUpperCase()}`);
  
  const query = `
    query GetPageACF($slug: ID!) {
      page(id: $slug, idType: URI) {
        id
        databaseId
        title
        slug
        homePageSections {
          heroSubtitle
          heroTitle
          heroDescription
          heroMainImage {
            sourceUrl
            altText
          }
        }
        aboutPageSections {
          aboutContentSubtitle
          aboutContentTitle
          aboutContentDescription
          aboutMainImage {
            sourceUrl
            altText
          }
        }
        contactPageSections {
          contactSubtitle
          contactTitle
          contactDescription
        }
        servicesPageSections {
          servicesSubtitle
          servicesTitle
          servicesDescription
        }
      }
    }
  `;

  try {
    const data = await graphQLClient.request(query, { slug });
    const page = data.page;

    if (!page) {
      log(`❌ Página "${slug}" no encontrada`, 'red');
      return null;
    }

    log(`✅ Página encontrada: ${page.title}`, 'green');
    log(`   ID: ${page.id}`, 'blue');
    log(`   Database ID: ${page.databaseId}`, 'blue');

    // Analizar campos ACF
    const acfFields = {
      homePageSections: page.homePageSections,
      aboutPageSections: page.aboutPageSections,
      contactPageSections: page.contactPageSections,
      servicesPageSections: page.servicesPageSections
    };

    let hasAnyACF = false;
    let totalFields = 0;

    console.log('\n📊 Análisis de Secciones ACF:');
    console.log('─'.repeat(50));

    for (const [sectionName, sectionData] of Object.entries(acfFields)) {
      if (sectionData) {
        hasAnyACF = true;
        const keys = Object.keys(sectionData);
        totalFields += keys.length;
        
        log(`\n✅ ${sectionName}`, 'green');
        log(`   Campos encontrados: ${keys.length}`, 'blue');
        log(`   Keys: ${keys.slice(0, 5).join(', ')}${keys.length > 5 ? '...' : ''}`, 'blue');
        
        // Mostrar muestra de datos
        if (keys.length > 0) {
          const sampleKey = keys[0];
          const sampleValue = sectionData[sampleKey];
          if (typeof sampleValue === 'string' && sampleValue.length > 0) {
            log(`   Muestra (${sampleKey}): ${sampleValue.substring(0, 50)}${sampleValue.length > 50 ? '...' : ''}`, 'yellow');
          } else if (sampleValue && typeof sampleValue === 'object') {
            log(`   Muestra (${sampleKey}): [Object]`, 'yellow');
          }
        }
      } else {
        log(`\n⚠️  ${sectionName} - No disponible`, 'yellow');
      }
    }

    console.log('\n' + '─'.repeat(50));
    log(`\n📈 Resumen:`, 'cyan');
    log(`   Tiene campos ACF: ${hasAnyACF ? '✅ SÍ' : '❌ NO'}`, hasAnyACF ? 'green' : 'red');
    log(`   Total de campos: ${totalFields}`, 'blue');

    return {
      page,
      hasACF: hasAnyACF,
      totalFields,
      sections: acfFields
    };
  } catch (error) {
    log('❌ Error al verificar campos ACF', 'red');
    log(`   Error: ${error.message}`, 'red');
    if (error.response?.errors) {
      error.response.errors.forEach(err => {
        log(`   GraphQL Error: ${err.message}`, 'red');
      });
    }
    return null;
  }
}

async function main() {
  console.clear();
  log('\n🔍 VERIFICACIÓN PROFESIONAL DE CAMPOS ACF\n', 'cyan');
  log('Este script verifica el flujo completo de datos ACF desde WordPress hasta el backend.\n', 'blue');

  // 1. Verificar conexión
  const connected = await verifyConnection();
  if (!connected) {
    log('\n❌ No se pudo conectar con WordPress. Verifica:', 'red');
    log('   1. Que WordPress esté corriendo', 'yellow');
    log('   2. Que WP_GRAPHQL_URL sea correcta', 'yellow');
    log('   3. Que las credenciales sean correctas', 'yellow');
    process.exit(1);
  }

  // 2. Verificar páginas
  const pages = ['home', 'about', 'contact', 'services'];
  const results = {};

  for (const pageSlug of pages) {
    const result = await verifyPageACF(pageSlug);
    if (result) {
      results[pageSlug] = result;
    }
    await new Promise(resolve => setTimeout(resolve, 500)); // Pequeña pausa
  }

  // 3. Resumen final
  logSection('3. RESUMEN FINAL');
  
  const pagesWithACF = Object.values(results).filter(r => r.hasACF).length;
  const totalPages = Object.keys(results).length;
  
  log(`Páginas verificadas: ${totalPages}`, 'blue');
  log(`Páginas con ACF: ${pagesWithACF}`, pagesWithACF > 0 ? 'green' : 'red');
  
  if (pagesWithACF === 0) {
    log('\n⚠️  ADVERTENCIA: No se encontraron campos ACF en ninguna página', 'yellow');
    log('\nPosibles causas:', 'yellow');
    log('   1. Los campos ACF no están configurados en WordPress', 'yellow');
    log('   2. WPGraphQL for ACF no está activo', 'yellow');
    log('   3. Los grupos de campos no están asignados a las páginas', 'yellow');
    log('   4. Los nombres de los campos no coinciden con la query', 'yellow');
  } else {
    log('\n✅ Los campos ACF están disponibles en GraphQL', 'green');
    log('   El siguiente paso es verificar que lleguen al frontend', 'blue');
  }

  log('\n📝 Próximos pasos:', 'cyan');
  log('   1. Abre http://localhost:3000/debug-acf en el navegador', 'blue');
  log('   2. Selecciona cada página y verifica los datos', 'blue');
  log('   3. Revisa la consola del navegador para logs detallados', 'blue');
  log('   4. Revisa los logs del backend para ver la transformación\n', 'blue');
}

// Ejecutar
main().catch(error => {
  log(`\n❌ Error fatal: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

