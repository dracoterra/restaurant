/**
 * Script para verificar si hay datos en ACF Options Pages
 * que podemos usar en lugar de valores hardcodeados
 */

require('dotenv').config();
const { GraphQLClient } = require('graphql-request');

const WP_GRAPHQL_URL = process.env.WP_GRAPHQL_URL || 'http://restaurant.local/graphql';
const WP_USER = process.env.WP_USER || 'admin';
const WP_PASSWORD = process.env.WP_PASSWORD || '';

const credentials = Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString('base64');
const authHeader = `Basic ${credentials}`;

const graphQLClient = new GraphQLClient(WP_GRAPHQL_URL, {
  headers: {
    'Authorization': authHeader
  }
});

async function checkAcfOptions() {
  console.log('\n🔍 VERIFICANDO ACF OPTIONS PAGES\n');
  console.log('='.repeat(80));

  // Intentar obtener campos ACF de tipo 'option'
  try {
    const query = `
      query {
        # Verificar si hay campos ACF disponibles para 'option'
        # Esto requiere que WPGraphQL for ACF esté configurado correctamente
        generalSettings {
          title
          description
        }
      }
    `;
    
    const data = await graphQLClient.request(query);
    console.log('✅ GraphQL disponible');
    console.log('Site:', data.generalSettings.title);
    
    // Intentar buscar campos ACF de opciones
    // Nota: Los campos ACF de Options Pages pueden estar en diferentes lugares
    console.log('\n💡 NOTA:');
    console.log('   Los campos ACF de Options Pages se pueden obtener:');
    console.log('   1. Desde GraphQL si WPGraphQL for ACF está configurado');
    console.log('   2. Desde REST API usando get_field() con post_id = "option"');
    console.log('   3. Desde nuestro plugin personalizado');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('\n📝 RECOMENDACIÓN:');
  console.log('   Si tienes ACF Options Pages configuradas, los datos estarán disponibles');
  console.log('   a través del plugin restaurant-api-extensions en /restaurant/v1/settings');
  console.log('   O puedes crear un Field Group de ACF con location "Options Page"');
  console.log('   y esos campos estarán disponibles en GraphQL como campos del tipo "Option"\n');
}

checkAcfOptions()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });

