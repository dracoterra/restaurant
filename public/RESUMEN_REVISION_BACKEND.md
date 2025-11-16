# Resumen de Revisión del Backend de WordPress

## ✅ Estado de las Páginas

### Páginas Creadas:
1. ✅ **Home** - Front Page (página frontal)
2. ✅ **About Us** 
3. ✅ **Contact Us**
4. ✅ **Services**
5. ❌ **Menu** - **FALTA CREAR**

## ⚠️ Problemas Críticos Encontrados

### 1. Error Fatal en GraphQL (CRÍTICO)
**Error**: `Class "WPGraphQL\WooCommerce\Vendor\Firebase\JWT\JWT" not found`

**Causa**: El plugin `WPGraphQL for WooCommerce` está activo pero le faltan dependencias de Composer.

**Impacto**: **BLOQUEA TODAS LAS QUERIES GRAPHQL** - No se pueden obtener datos de páginas ni ACF.

**Solución Inmediata**:
```bash
# Opción 1: Desactivar temporalmente el plugin
# En WordPress Admin: Plugins > Installed Plugins > Desactivar "WPGraphQL for WooCommerce"

# Opción 2: Instalar dependencias de Composer
cd wp-content/plugins/wp-graphql-woocommerce
composer install
```

### 2. Error en REST API
**Error**: `Function wp_send_json was called incorrectly`

**Causa**: Algún callback REST API está usando `wp_send_json()` en lugar de retornar `WP_REST_Response`.

**Impacto**: Avisos en debug.log, pero no bloquea funcionalidad.

**Solución**: Revisar callbacks REST API en `restaurant-theme-config.php` y cambiarlos para retornar `WP_REST_Response`.

## 🔍 Verificaciones Necesarias

### 1. Verificar Slugs de Páginas
Las páginas deben tener estos slugs exactos:
- `home` (o usar `page_on_front` para la página frontal)
- `about`
- `contact`
- `services`
- `menu` (crear si falta)

**Cómo verificar**:
1. Ir a WordPress Admin > Pages
2. Editar cada página
3. Verificar el "Permalink" (slug) en la URL o en la sección de edición

### 2. Verificar Campos ACF
**Verificar que los grupos de campos estén asignados**:
1. WordPress Admin > Custom Fields (ACF) > Field Groups
2. Verificar que existan:
   - "About Page Sections"
   - "Home Page Sections"
   - "Contact Page Sections"
   - "Services Page Sections"
   - "Menu Page Sections"

**Verificar que los campos estén en las páginas**:
1. Editar cada página (About, Home, Contact, Services)
2. Debe aparecer una sección con los campos ACF
3. Verificar que los campos estén guardados con datos

### 3. Verificar GraphQL (Después de solucionar error fatal)
Probar en GraphiQL IDE:
```graphql
{
  page(id: "about", idType: SLUG) {
    id
    title
    slug
    aboutPageSections {
      aboutContentSubtitle
      aboutContentTitle
      aboutContentDescription
    }
  }
}
```

## 📝 Acciones Requeridas

### Prioridad Alta:
1. **Desactivar o arreglar WPGraphQL WooCommerce** - Bloquea GraphQL
2. **Crear página Menu** si falta
3. **Verificar slugs de páginas** - Deben coincidir con los esperados

### Prioridad Media:
4. **Llenar campos ACF** en cada página con contenido
5. **Verificar que los campos ACF se guarden correctamente**

### Prioridad Baja:
6. **Corregir error de wp_send_json** en REST API
7. **Instalar dependencias de Composer** para WooCommerce GraphQL (si se necesita)

## 🧪 Pruebas Después de Correcciones

1. **Probar GraphQL directamente**:
   ```bash
   curl -X POST http://restaurant.local/graphql \
     -H "Content-Type: application/json" \
     -u admin:9203166sa \
     -d '{"query": "{ page(id: \"about\", idType: SLUG) { title aboutPageSections { aboutContentTitle } } }"}'
   ```

2. **Probar Backend FeathersJS**:
   ```bash
   curl http://localhost:3030/pages/about
   ```

3. **Probar Frontend**:
   - Visitar `/about` en el frontend
   - Verificar que los datos de ACF se muestren correctamente

## 📌 Notas

- El error de WooCommerce GraphQL **NO afecta** las páginas directamente, pero **bloquea todas las queries GraphQL**
- Los campos ACF deben estar guardados en las páginas para que aparezcan en GraphQL
- El backend FeathersJS está configurado correctamente, solo necesita que GraphQL funcione

