# 📋 Instrucciones para Completar ACF

## ✅ Lo que se ha actualizado:

1. **Archivo `acf-export.json` actualizado** con los campos faltantes:
   - ✅ `about_features` (repeater) - Agregado
   - ✅ `about_details` (repeater) - Agregado
   - ✅ `services_items` (repeater) - Agregado

2. **Backend actualizado** (`pages.service.js`):
   - ✅ Query GraphQL actualizada para incluir campos de repeater
   - ✅ Función `transformACFSection` mejorada para manejar arrays/repeaters

---

## 🚀 Pasos para Completar la Configuración

### Paso 1: Importar el JSON Actualizado en WordPress

1. **Ir a WordPress Admin**
   - URL: `http://restaurant.local/wp-admin` (o tu URL local)

2. **Navegar a ACF > Tools**
   - En el menú lateral, busca "Custom Fields" > "Tools"

3. **Importar el JSON**
   - Haz clic en la pestaña **"Import"**
   - Haz clic en **"Choose File"**
   - Selecciona: `wp-content/plugins/restaurant-theme-config/acf-export.json`
   - Haz clic en **"Import"**

4. **Verificar la Importación**
   - Deberías ver un mensaje de éxito
   - Ve a **Custom Fields > Field Groups**
   - Verifica que existan los 5 grupos:
     - Home Page Sections
     - About Page Sections
     - Contact Page Sections
     - Services Page Sections
     - Menu Page Sections

---

### Paso 2: Activar Plugin ACF to GraphQL

1. **Ir a Plugins**
   - WordPress Admin > Plugins > Installed Plugins

2. **Activar Plugin**
   - Busca **"WPGraphQL for Advanced Custom Fields"**
   - Haz clic en **"Activate"**

3. **Verificar Activación**
   - El plugin debe aparecer como "Active"

---

### Paso 3: Verificar Campos en las Páginas

1. **Editar Página "About"**
   - Pages > All Pages > Editar "About Us"
   - Deberías ver el meta box **"About Page Sections"** con:
     - Campos básicos (subtitle, title, description, images)
     - **About Features** (repeater) - NUEVO
     - **About Details** (repeater) - NUEVO
     - Experience fields
     - Mission, Vision, Value sections

2. **Editar Página "Services"**
   - Pages > All Pages > Editar "Services"
   - Deberías ver el meta box **"Services Page Sections"** con:
     - Campos básicos (subtitle, title, description)
     - **Services Items** (repeater) - NUEVO

3. **Llenar Campos de Prueba** (Opcional)
   - Agrega algunos datos de prueba en los campos
   - Guarda las páginas

---

### Paso 4: Verificar GraphQL

1. **Abrir GraphiQL IDE**
   - URL: `http://restaurant.local/graphql` (o tu URL + /graphql)

2. **Probar Query para About Page**
```graphql
{
  page(id: "about", idType: SLUG) {
    title
    aboutPageSections {
      aboutContentTitle
      aboutFeatures {
        featureText
      }
      aboutDetails {
        title
        description
        icon {
          sourceUrl
        }
      }
    }
  }
}
```

3. **Probar Query para Services Page**
```graphql
{
  page(id: "services", idType: SLUG) {
    title
    servicesPageSections {
      servicesTitle
      servicesItems {
        title
        description
        link
        icon {
          sourceUrl
        }
      }
    }
  }
}
```

4. **Verificar Respuesta**
   - Deberías ver los campos en la respuesta
   - Si hay errores, verifica que el plugin ACF to GraphQL esté activo

---

### Paso 5: Verificar Backend

1. **Reiniciar Backend** (si está corriendo)
   ```bash
   # Detener el backend (Ctrl+C)
   # Luego reiniciar
   cd backend
   npm start
   ```

2. **Probar Endpoint**
   ```bash
   # Probar página About
   curl http://localhost:3030/pages/about
   
   # Probar página Services
   curl http://localhost:3030/pages/services
   ```

3. **Verificar Respuesta**
   - Deberías ver los campos ACF en la respuesta
   - Los campos de repeater deberían aparecer como arrays

---

### Paso 6: Actualizar Frontend (Opcional)

Si quieres usar los datos de ACF en lugar de datos hardcodeados:

1. **Actualizar `services.vue`**
   - Usar `acf?.servicesItems` en lugar del array hardcodeado

2. **Actualizar `about.vue`**
   - Usar `acf?.aboutFeatures` y `acf?.aboutDetails` si es necesario

---

## 🔍 Solución de Problemas

### Problema: Los campos no aparecen en GraphQL

**Solución:**
1. Verifica que el plugin "WPGraphQL for Advanced Custom Fields" esté activo
2. Ve a ACF > Field Groups y verifica que los grupos existan
3. Verifica que los grupos estén asignados a las páginas correctas (Location Rules)
4. Guarda las páginas nuevamente (a veces ayuda a refrescar)

### Problema: Los campos no aparecen en las páginas

**Solución:**
1. Verifica que los grupos de campos estén importados
2. Verifica las "Location Rules" de cada grupo:
   - Home Page: `page_type == front_page`
   - About: `page == about` (slug)
   - Services: `page == services` (slug)
   - etc.
3. Si usas campos programáticos (PHP), verifica que el plugin `restaurant-theme-config` esté activo

### Problema: Error en GraphQL sobre campos no encontrados

**Solución:**
1. Asegúrate de que los nombres de los campos en GraphQL coincidan con los nombres en ACF
2. Los nombres en GraphQL son camelCase (ej: `aboutFeatures`)
3. Los nombres en ACF son snake_case (ej: `about_features`)
4. El plugin ACF to GraphQL hace la conversión automáticamente

---

## ✅ Checklist Final

- [ ] JSON importado en WordPress
- [ ] Plugin ACF to GraphQL activado
- [ ] Campos visibles en páginas de WordPress
- [ ] Query GraphQL funciona correctamente
- [ ] Backend obtiene los datos correctamente
- [ ] Frontend muestra los datos (si aplica)

---

## 📝 Notas Adicionales

- Los campos de repeater aparecen como arrays en GraphQL
- Las imágenes dentro de repeaters se transforman automáticamente
- Si necesitas agregar más campos, actualiza el JSON y re-importa
- Los campos programáticos (PHP) se crean automáticamente cuando el plugin está activo

---

## 🎉 ¡Listo!

Una vez completados estos pasos, ACF estará completamente configurado y funcionando. Los campos estarán disponibles en:
- WordPress Admin (para editar)
- GraphQL (para consultar)
- Backend FeathersJS (para servir)
- Frontend Nuxt (para mostrar)

