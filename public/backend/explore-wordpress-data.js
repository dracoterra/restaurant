/**
 * Script para explorar todos los datos disponibles en WordPress
 * que no estamos capturando actualmente
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

async function exploreWordPressData() {
  console.log('\n🔍 EXPLORANDO DATOS DE WORDPRESS\n');
  console.log('='.repeat(80));

  const findings = {
    siteInfo: {},
    customizer: {},
    widgets: {},
    bodyClasses: {},
    themeMods: {},
    options: {},
    graphQLTypes: {},
    missing: []
  };

  // 1. Información del sitio (GraphQL)
  console.log('\n1️⃣ INFORMACIÓN DEL SITIO (GraphQL)');
  console.log('-'.repeat(80));
  try {
    const siteQuery = `
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
    const siteData = await graphQLClient.request(siteQuery);
    findings.siteInfo = siteData;
    console.log('✅ Información del sitio obtenida');
    console.log(JSON.stringify(siteData, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
    findings.missing.push('Site Info (GraphQL)');
  }

  // 2. Customizer Settings (REST API)
  console.log('\n2️⃣ CUSTOMIZER SETTINGS (REST API)');
  console.log('-'.repeat(80));
  try {
    const customizerResponse = await axios.get(`${WP_REST_URL.replace('/wp/v2', '')}/wp/v2/settings`, axiosConfig);
    findings.customizer = customizerResponse.data;
    console.log('✅ Customizer settings obtenidos');
    console.log(JSON.stringify(customizerResponse.data, null, 2));
  } catch (error) {
    console.log('⚠️ Customizer settings no disponibles (requiere autenticación):', error.message);
    findings.missing.push('Customizer Settings (REST API)');
  }

  // 3. Theme Mods (Opciones del tema)
  console.log('\n3️⃣ THEME MODS (Opciones del tema)');
  console.log('-'.repeat(80));
  try {
    // Intentar obtener theme mods a través de un endpoint personalizado o options
    const themeModsResponse = await axios.get(`${WP_REST_URL.replace('/wp/v2', '')}/wp/v2/settings`, axiosConfig);
    console.log('✅ Theme mods obtenidos');
    findings.themeMods = themeModsResponse.data;
  } catch (error) {
    console.log('⚠️ Theme mods no disponibles directamente:', error.message);
    findings.missing.push('Theme Mods');
  }

  // 4. Widgets (REST API)
  console.log('\n4️⃣ WIDGETS (REST API)');
  console.log('-'.repeat(80));
  try {
    const widgetsResponse = await axios.get(`${WP_REST_URL}/widgets`, axiosConfig);
    findings.widgets = widgetsResponse.data;
    console.log('✅ Widgets obtenidos');
    console.log(`Total de sidebars: ${widgetsResponse.data?.length || 0}`);
    if (widgetsResponse.data && widgetsResponse.data.length > 0) {
      widgetsResponse.data.forEach((sidebar, index) => {
        console.log(`  ${index + 1}. ${sidebar.id}: ${sidebar.widgets?.length || 0} widgets`);
      });
    }
  } catch (error) {
    console.log('❌ Error obteniendo widgets:', error.message);
    findings.missing.push('Widgets');
  }

  // 5. Sidebars (REST API)
  console.log('\n5️⃣ SIDEBARS (REST API)');
  console.log('-'.repeat(80));
  try {
    const sidebarsResponse = await axios.get(`${WP_REST_URL}/sidebars`, axiosConfig);
    console.log('✅ Sidebars obtenidos');
    console.log(`Total de sidebars: ${sidebarsResponse.data?.length || 0}`);
    if (sidebarsResponse.data && sidebarsResponse.data.length > 0) {
      sidebarsResponse.data.forEach((sidebar, index) => {
        console.log(`  ${index + 1}. ${sidebar.id}: ${sidebar.name}`);
      });
    }
  } catch (error) {
    console.log('❌ Error obteniendo sidebars:', error.message);
    findings.missing.push('Sidebars');
  }

  // 6. Logo y opciones del tema (Custom Logo)
  console.log('\n6️⃣ LOGO Y OPCIONES DEL TEMA');
  console.log('-'.repeat(80));
  try {
    // Intentar obtener custom logo desde theme mods
    const logoQuery = `
      query {
        themeMods {
          customLogo
          customLogoUrl
        }
      }
    `;
    try {
      const logoData = await graphQLClient.request(logoQuery);
      findings.themeMods.customLogo = logoData;
      console.log('✅ Logo obtenido desde GraphQL');
    } catch (error) {
      console.log('⚠️ Logo no disponible en GraphQL, intentando REST API...');
      // Intentar desde REST API
      try {
        const logoResponse = await axios.get(`${WP_REST_URL.replace('/wp/v2', '')}/wp/v2/settings`, axiosConfig);
        console.log('✅ Logo obtenido desde REST API');
      } catch (restError) {
        console.log('❌ Logo no disponible:', restError.message);
        findings.missing.push('Logo');
      }
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    findings.missing.push('Logo');
  }

  // 7. Body Classes (necesitamos obtenerlos de una página)
  console.log('\n7️⃣ BODY CLASSES');
  console.log('-'.repeat(80));
  try {
    // Las body classes se generan dinámicamente, necesitamos obtenerlas de una página
    const bodyClassesQuery = `
      query {
        page(id: "home", idType: URI) {
          id
          slug
          # Body classes no están directamente en GraphQL
          # Necesitamos obtenerlas desde el HTML o crear un endpoint personalizado
        }
      }
    `;
    console.log('⚠️ Body classes no están disponibles directamente en GraphQL');
    console.log('   Necesitamos crear un endpoint personalizado o obtenerlas del HTML');
    findings.missing.push('Body Classes');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // 8. Opciones de WordPress (Options API)
  console.log('\n8️⃣ OPCIONES DE WORDPRESS');
  console.log('-'.repeat(80));
  try {
    // Intentar obtener opciones comunes
    const optionsToCheck = [
      'siteurl',
      'home',
      'blogname',
      'blogdescription',
      'admin_email',
      'start_of_week',
      'use_balanceTags',
      'default_category',
      'default_post_format',
      'posts_per_page',
      'date_format',
      'time_format',
      'links_updated_date_format',
      'comment_moderation',
      'moderation_notify',
      'permalink_structure',
      'rewrite_rules',
      'hack_file',
      'blog_charset',
      'moderation_keys',
      'active_plugins',
      'category_base',
      'ping_sites',
      'comment_max_links',
      'gmt_offset',
      'default_email_category',
      'recently_edited',
      'template',
      'stylesheet',
      'require_name_email',
      'comments_notify',
      'posts_per_rss',
      'rss_use_excerpt',
      'mailserver_url',
      'mailserver_login',
      'mailserver_pass',
      'mailserver_port',
      'default_category',
      'default_comment_status',
      'default_ping_status',
      'default_pingback_flag',
      'posts_per_page',
      'date_format',
      'time_format',
      'links_updated_date_format',
      'comment_moderation',
      'moderation_notify',
      'permalink_structure',
      'hack_file',
      'blog_charset',
      'moderation_keys',
      'active_plugins',
      'category_base',
      'ping_sites',
      'comment_max_links',
      'gmt_offset',
      'default_email_category',
      'recently_edited',
      'template',
      'stylesheet',
      'require_name_email',
      'comments_notify',
      'posts_per_rss',
      'rss_use_excerpt',
      'mailserver_url',
      'mailserver_login',
      'mailserver_pass',
      'mailserver_port',
      'default_category',
      'default_comment_status',
      'default_ping_status',
      'default_pingback_flag',
      'custom_logo',
      'custom_logo_url'
    ];
    
    console.log('⚠️ Las opciones de WordPress no están disponibles directamente en REST API');
    console.log('   Necesitamos crear un endpoint personalizado para obtenerlas');
    findings.missing.push('WordPress Options');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // 9. Tipos GraphQL disponibles
  console.log('\n9️⃣ TIPOS GRAPHQL DISPONIBLES');
  console.log('-'.repeat(80));
  try {
    const introspectionQuery = `
      query IntrospectionQuery {
        __schema {
          types {
            name
            kind
            description
          }
        }
      }
    `;
    const introspectionData = await graphQLClient.request(introspectionQuery);
    const relevantTypes = introspectionData.__schema.types.filter(type => 
      type.name && (
        type.name.includes('Settings') ||
        type.name.includes('Theme') ||
        type.name.includes('Widget') ||
        type.name.includes('Sidebar') ||
        type.name.includes('Customizer') ||
        type.name.includes('Option')
      )
    );
    findings.graphQLTypes = relevantTypes;
    console.log('✅ Tipos GraphQL relevantes encontrados:');
    relevantTypes.forEach(type => {
      console.log(`  - ${type.name} (${type.kind})`);
    });
  } catch (error) {
    console.log('❌ Error en introspection:', error.message);
  }

  // Resumen
  console.log('\n' + '='.repeat(80));
  console.log('📊 RESUMEN DE HALLAZGOS');
  console.log('='.repeat(80));
  console.log('\n✅ Datos disponibles:');
  console.log(`  - Site Info: ${findings.siteInfo.generalSettings ? '✅' : '❌'}`);
  console.log(`  - Widgets: ${findings.widgets.length > 0 ? '✅' : '❌'}`);
  console.log(`  - Sidebars: ${findings.widgets.length > 0 ? '✅' : '❌'}`);
  
  console.log('\n❌ Datos faltantes:');
  findings.missing.forEach(item => {
    console.log(`  - ${item}`);
  });

  console.log('\n💡 RECOMENDACIONES:');
  console.log('  1. Crear endpoint personalizado para body classes');
  console.log('  2. Crear endpoint personalizado para theme mods (logo, etc.)');
  console.log('  3. Crear endpoint personalizado para WordPress options');
  console.log('  4. Integrar widgets y sidebars en el frontend');
  console.log('  5. Usar site info para metadata y SEO');

  return findings;
}

// Ejecutar
exploreWordPressData()
  .then(() => {
    console.log('\n✅ Exploración completada\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Error en exploración:', error);
    process.exit(1);
  });

