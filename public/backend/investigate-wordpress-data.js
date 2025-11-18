/**
 * Script para investigar qué datos YA están disponibles en WordPress
 * sin necesidad de endpoints personalizados
 */

require('dotenv').config();
const { GraphQLClient } = require('graphql-request');
const axios = require('axios');

const WP_GRAPHQL_URL = process.env.WP_GRAPHQL_URL || 'http://restaurant.local/graphql';
const WP_REST_URL = process.env.WP_REST_URL || 'http://restaurant.local/wp-json/wp/v2';
const WP_USER = process.env.WP_USER || 'admin';
const WP_PASSWORD = process.env.WP_PASSWORD || '';

const credentials = Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString('base64');
const authHeader = `Basic ${credentials}`;

const graphQLClient = new GraphQLClient(WP_GRAPHQL_URL, {
  headers: {
    'Authorization': authHeader
  }
});

const axiosConfig = {
  headers: {
    'Authorization': authHeader
  }
};

async function investigateWordPressData() {
  console.log('\n🔍 INVESTIGANDO DATOS DISPONIBLES EN WORDPRESS\n');
  console.log('='.repeat(80));

  // 1. GraphQL - General Settings
  console.log('\n1️⃣ GRAPHQL - GENERAL SETTINGS');
  console.log('-'.repeat(80));
  try {
    const query = `
      query {
        generalSettings {
          title
          description
          url
          email
          timezone
          dateFormat
          timeFormat
          startOfWeek
          language
        }
        readingSettings {
          postsPerPage
        }
        writingSettings {
          defaultCategory
          defaultPostFormat
        }
      }
    `;
    const data = await graphQLClient.request(query);
    console.log('✅ Datos disponibles en GraphQL:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // 2. GraphQL - Theme Info
  console.log('\n2️⃣ GRAPHQL - THEME INFO');
  console.log('-'.repeat(80));
  try {
    const query = `
      query {
        themes {
          nodes {
            name
            version
            status
            isActive
          }
        }
      }
    `;
    const data = await graphQLClient.request(query);
    console.log('✅ Theme info disponible:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('⚠️ Theme info no disponible en GraphQL:', error.message);
  }

  // 3. REST API - Settings (público)
  console.log('\n3️⃣ REST API - SETTINGS (Público)');
  console.log('-'.repeat(80));
  try {
    // Intentar sin autenticación primero
    const response = await axios.get(`${WP_REST_URL.replace('/wp/v2', '')}/wp/v2/settings`);
    console.log('✅ Settings públicos disponibles:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('⚠️ Settings públicos no disponibles:', error.message);
    // Intentar con autenticación
    try {
      const response = await axios.get(`${WP_REST_URL.replace('/wp/v2', '')}/wp/v2/settings`, axiosConfig);
      console.log('✅ Settings con autenticación:');
      console.log(JSON.stringify(response.data, null, 2));
    } catch (authError) {
      console.log('❌ Settings no disponibles:', authError.message);
    }
  }

  // 4. REST API - Options (custom endpoint o directo)
  console.log('\n4️⃣ REST API - OPTIONS');
  console.log('-'.repeat(80));
  try {
    // Intentar endpoint de opciones comunes
    const optionsToCheck = ['blogname', 'blogdescription', 'admin_email', 'siteurl', 'home'];
    for (const option of optionsToCheck) {
      try {
        const response = await axios.get(`${WP_REST_URL.replace('/wp/v2', '')}/wp/v2/settings`, axiosConfig);
        if (response.data && response.data[option]) {
          console.log(`  ✅ ${option}: ${response.data[option]}`);
        }
      } catch (e) {
        // Ignorar
      }
    }
  } catch (error) {
    console.log('⚠️ Options no disponibles directamente:', error.message);
  }

  // 5. REST API - Theme Mods (custom_logo)
  console.log('\n5️⃣ REST API - THEME MODS (custom_logo)');
  console.log('-'.repeat(80));
  try {
    // Verificar si hay un endpoint para theme mods
    const response = await axios.get(`${WP_REST_URL.replace('/wp/v2', '')}/wp/v2/settings`, axiosConfig);
    if (response.data) {
      console.log('✅ Settings disponibles, buscando custom_logo...');
      // custom_logo generalmente está en theme mods, no en settings
      console.log('⚠️ custom_logo no está en settings, necesita theme mods');
    }
  } catch (error) {
    console.log('⚠️ Theme mods no disponibles directamente:', error.message);
  }

  // 6. GraphQL - Media (para logo si está como attachment)
  console.log('\n6️⃣ GRAPHQL - MEDIA (para buscar logo)');
  console.log('-'.repeat(80));
  try {
    const query = `
      query {
        mediaItems(first: 10, where: { search: "logo" }) {
          nodes {
            id
            databaseId
            title
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
      }
    `;
    const data = await graphQLClient.request(query);
    console.log('✅ Media items encontrados:');
    if (data.mediaItems.nodes.length > 0) {
      data.mediaItems.nodes.forEach(item => {
        console.log(`  - ${item.title}: ${item.sourceUrl}`);
      });
    } else {
      console.log('  No se encontraron media items con "logo"');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // 7. REST API - Menus (ya lo tenemos, pero verificar estructura)
  console.log('\n7️⃣ REST API - MENUS (verificar estructura completa)');
  console.log('-'.repeat(80));
  try {
    const response = await axios.get(`${WP_REST_URL}/menus`, axiosConfig);
    console.log('✅ Menus disponibles:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('⚠️ Menus no disponibles:', error.message);
  }

  // 8. GraphQL - Root Query (ver qué más hay disponible)
  console.log('\n8️⃣ GRAPHQL - INTROSPECTION (qué más hay disponible)');
  console.log('-'.repeat(80));
  try {
    const query = `
      query IntrospectionQuery {
        __schema {
          queryType {
            fields {
              name
              description
              type {
                name
                kind
              }
            }
          }
        }
      }
    `;
    const data = await graphQLClient.request(query);
    const relevantFields = data.__schema.queryType.fields.filter(field => 
      field.name.includes('Settings') || 
      field.name.includes('Theme') || 
      field.name.includes('Site') ||
      field.name.includes('General')
    );
    console.log('✅ Campos relevantes disponibles:');
    relevantFields.forEach(field => {
      console.log(`  - ${field.name}: ${field.description || 'Sin descripción'}`);
    });
  } catch (error) {
    console.log('❌ Error en introspection:', error.message);
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 RESUMEN');
  console.log('='.repeat(80));
  console.log('\n💡 RECOMENDACIONES:');
  console.log('  1. Usar generalSettings de GraphQL para site info');
  console.log('  2. Usar REST API /wp/v2/settings para opciones adicionales');
  console.log('  3. Para logo: necesitamos theme mods (custom_logo) - puede requerir endpoint personalizado');
  console.log('  4. Para body classes: necesitamos simular WordPress - puede requerir endpoint personalizado');
  console.log('  5. Reducir hardcode usando datos reales de WordPress\n');
}

investigateWordPressData()
  .then(() => {
    console.log('✅ Investigación completada\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });

