# Revisión del Backend de WordPress

## 📋 Estado Actual

### Páginas Creadas en WordPress:
1. ✅ **Home** - Front Page (página frontal)
2. ✅ **About Us** 
3. ✅ **Contact Us**
4. ✅ **Services**
5. ❌ **Menu** - Falta crear

### Verificaciones Necesarias:

#### 1. Verificar Slugs de las Páginas
Las páginas deben tener los siguientes slugs:
- `home` o usar `page_on_front` para la página frontal
- `about`
- `contact`
- `services`
- `menu` (crear si falta)

#### 2. Verificar Campos ACF
Los grupos de campos ACF deben estar:
- ✅ Importados (según `acf-export.json`)
- ✅ Asignados a las páginas correctas
- ✅ Visibles en GraphQL

#### 3. Verificar GraphQL
Probar query en GraphiQL:
```graphql
{
  page(id: "about", idType: SLUG) {
    id
    title
    slug
    aboutPageSections {
      aboutContentSubtitle
      aboutContentTitle
    }
  }
}
```

#### 4. Verificar Backend FeathersJS
El servicio `pages.service.js` debe:
- ✅ Obtener páginas por slug
- ✅ Incluir campos ACF en las queries
- ✅ Transformar correctamente los datos

## 🔧 Próximos Pasos

1. **Verificar slugs de páginas** - Asegurar que coincidan con los esperados
2. **Crear página Menu** si falta
3. **Verificar campos ACF** - Asegurar que estén guardados en las páginas
4. **Probar conexión GraphQL** - Verificar que los campos ACF se obtengan correctamente
5. **Probar backend FeathersJS** - Verificar que el servicio funcione correctamente

## ⚠️ Errores Detectados

1. **Error en debug.log**: `wp_send_json` siendo llamado incorrectamente
   - Ubicación: Probablemente en el plugin `restaurant-theme-config`
   - Solución: Cambiar `wp_send_json()` por retornar `WP_REST_Response`

2. **Error WooCommerce GraphQL**: Falta clase JWT
   - No afecta las páginas, pero puede afectar productos
   - Solución: Instalar dependencias de Composer

