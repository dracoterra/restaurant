# ✅ Verificación Completa de ACF

## 📋 Checklist de Verificación

### 1. ✅ Plugins Requeridos

#### Advanced Custom Fields (ACF)
- [ ] **ACF está instalado y activo**
  - Verificar: WordPress Admin > Plugins > Installed Plugins
  - Buscar "Advanced Custom Fields"
  - Debe estar marcado como "Active"

#### ACF PRO (Requerido para Repeater Fields)
- [ ] **ACF PRO está activo**
  - Verificar: WordPress Admin > Plugins > Installed Plugins
  - Buscar "Advanced Custom Fields PRO" o verificar licencia
  - **IMPORTANTE**: Los campos Repeater requieren ACF PRO
  - Si no está activo, los campos repeater no funcionarán

#### WPGraphQL
- [ ] **WPGraphQL está instalado y activo** (Opcional pero recomendado)
  - Verificar: WordPress Admin > Plugins > Installed Plugins
  - Buscar "WPGraphQL"

#### WPGraphQL for Advanced Custom Fields
- [ ] **WPGraphQL for ACF está instalado y activo** (Opcional pero recomendado)
  - Verificar: WordPress Admin > Plugins > Installed Plugins
  - Buscar "WPGraphQL for Advanced Custom Fields"
  - Necesario para que los campos ACF aparezcan en GraphQL

#### Restaurant ACF Setup
- [ ] **Restaurant ACF Setup está activo**
  - Verificar: WordPress Admin > Plugins > Installed Plugins
  - Buscar "Restaurant ACF Setup"
  - Este plugin importa y configura todo automáticamente

---

### 2. ✅ Verificación con el Plugin Restaurant ACF Setup

1. **Ir a la página de administración del plugin**
   - WordPress Admin > **ACF Setup** (menú lateral)
   - O URL: `wp-admin/admin.php?page=restaurant-acf-setup`

2. **Verificar el estado visual**
   - ✅ **Advanced Custom Fields**: Debe mostrar "Activo" (verde)
   - ✅ **ACF PRO**: Debe mostrar "Activo" (verde) - **CRÍTICO**
   - ⚠️ **WPGraphQL**: Opcional (amarillo si no está activo)
   - ⚠️ **WPGraphQL for ACF**: Opcional (amarillo si no está activo)
   - ✅ **Campos ACF Importados**: Debe mostrar "5 grupos importados" (verde)

3. **Si algo falta:**
   - Haz clic en **"Importar Campos ACF"** si los campos no están importados
   - Haz clic en **"Activar WPGraphQL for ACF"** si está disponible pero no activo
   - Haz clic en **"Verificar Estado"** para actualizar

---

### 3. ✅ Verificar Grupos de Campos ACF

1. **Ir a Custom Fields**
   - WordPress Admin > **Custom Fields > Field Groups**

2. **Verificar que existan estos 5 grupos:**
   - [ ] **Home Page Sections** (`group_home_page`)
   - [ ] **About Page Sections** (`group_about_page`)
   - [ ] **Contact Page Sections** (`group_contact_page`)
   - [ ] **Services Page Sections** (`group_services_page`)
   - [ ] **Menu Page Sections** (`group_menu_page`)

3. **Verificar campos de repeater en cada grupo:**
   - [ ] **About Page Sections** debe tener:
     - `about_features` (repeater)
     - `about_details` (repeater)
   - [ ] **Services Page Sections** debe tener:
     - `services_items` (repeater)

---

### 4. ✅ Verificar Campos en las Páginas

#### Página Home
1. Pages > All Pages > Editar "Home" (o página frontal)
2. Debe aparecer el meta box **"Home Page Sections"**
3. Verificar campos:
   - Hero Subtitle, Title, Description, Main Image
   - About Subtitle, Title, Description
   - Dishes Subtitle, Title

#### Página About
1. Pages > All Pages > Editar "About Us"
2. Debe aparecer el meta box **"About Page Sections"**
3. Verificar campos:
   - About Content (Subtitle, Title, Description, Images)
   - Experience (Years, Text)
   - **About Features** (repeater) - Requiere ACF PRO
   - **About Details** (repeater) - Requiere ACF PRO
   - Mission, Vision, Value (cada uno con Title, Heading, Content, Image)

#### Página Services
1. Pages > All Pages > Editar "Services"
2. Debe aparecer el meta box **"Services Page Sections"**
3. Verificar campos:
   - Services Subtitle, Title, Description
   - **Services Items** (repeater) - Requiere ACF PRO

#### Página Contact
1. Pages > All Pages > Editar "Contact Us"
2. Debe aparecer el meta box **"Contact Page Sections"**
3. Verificar campos:
   - Contact Subtitle, Title, Description
   - Map Embed Code

#### Página Menu
1. Pages > All Pages > Editar "Menu"
2. Debe aparecer el meta box **"Menu Page Sections"**
3. Verificar campos:
   - Menu Subtitle, Title, Description

---

### 5. ✅ Verificar GraphQL (Opcional)

1. **Abrir GraphiQL IDE**
   - URL: `http://restaurant.local/graphql` (o tu URL + /graphql)

2. **Probar query para About Page:**
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

3. **Probar query para Services Page:**
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

4. **Verificar respuesta:**
   - Debe devolver los campos sin errores
   - Si hay errores, verifica que WPGraphQL for ACF esté activo

---

### 6. ✅ Verificar Backend

1. **Reiniciar backend** (si está corriendo)
   ```bash
   cd backend
   npm start
   ```

2. **Probar endpoints:**
   ```bash
   # Probar página About
   curl http://localhost:3030/pages/about
   
   # Probar página Services
   curl http://localhost:3030/pages/services
   ```

3. **Verificar respuesta:**
   - Debe incluir los campos ACF en `acf.aboutPageSections` o `acf.servicesPageSections`
   - Los campos de repeater deben aparecer como arrays

---

### 7. ✅ Verificar Frontend

1. **Visitar las páginas en el frontend:**
   - `/about` - Debe mostrar datos de ACF
   - `/services` - Debe mostrar datos de ACF
   - `/contact` - Debe mostrar datos de ACF
   - `/menu` - Debe mostrar datos de ACF

2. **Verificar en la consola del navegador:**
   - No debe haber errores relacionados con ACF
   - Los datos deben cargarse correctamente

---

## ⚠️ Problemas Comunes y Soluciones

### Problema: ACF PRO no está activo

**Síntomas:**
- Los campos de repeater no aparecen
- Mensaje de error sobre campos PRO

**Solución:**
1. Instalar ACF PRO
2. Activar la licencia en ACF > Settings > Updates
3. Verificar que ACF PRO esté activo en el plugin Restaurant ACF Setup

### Problema: Los campos no se importan

**Síntomas:**
- No aparecen los grupos de campos en Custom Fields

**Solución:**
1. Ir a ACF Setup > Importar Campos ACF
2. Verificar que el archivo `acf-export.json` exista
3. Verificar permisos del archivo
4. Revisar mensajes de error en la página

### Problema: Los campos no aparecen en GraphQL

**Síntomas:**
- Las queries GraphQL no devuelven campos ACF

**Solución:**
1. Verificar que WPGraphQL esté activo
2. Verificar que WPGraphQL for ACF esté activo
3. Guardar las páginas nuevamente
4. Limpiar caché si usas algún plugin de caché

### Problema: Los campos de repeater están vacíos

**Síntomas:**
- Los campos aparecen pero no tienen datos

**Solución:**
1. Editar la página en WordPress Admin
2. Agregar datos a los campos de repeater
3. Guardar la página
4. Verificar que los datos se guarden correctamente

---

## 📊 Resumen de Verificación

### Estado Ideal:
- ✅ ACF activo
- ✅ ACF PRO activo (CRÍTICO para Repeater Fields)
- ✅ WPGraphQL activo (opcional)
- ✅ WPGraphQL for ACF activo (opcional)
- ✅ 5 grupos de campos importados
- ✅ Campos visibles en las páginas
- ✅ Campos funcionando en GraphQL (si aplica)
- ✅ Backend obteniendo datos correctamente
- ✅ Frontend mostrando datos correctamente

### Si falta algo:
1. Usa el plugin **Restaurant ACF Setup** para verificar y corregir
2. Sigue las soluciones de problemas comunes arriba
3. Revisa los logs de WordPress (`wp-content/debug.log`)

---

## 🎉 ¡Todo Verificado!

Si todos los items están marcados, tu configuración de ACF está completa y funcionando correctamente.

