# ✅ ACF Configurado Correctamente

## Lo que se ha hecho:

### 1. ✅ Plugins Instalados
- **Advanced Custom Fields (ACF)** - Instalado y activo
- **ACF to GraphQL** - Instalado (necesita activación)

### 2. ✅ Grupos de Campos Creados
Se han creado grupos de campos ACF para todas las páginas:

#### **Home Page** (`group_home_page`)
- Hero Section (subtitle, title, description, main image)
- About Section (subtitle, title, description)
- Dishes Section (subtitle, title)

#### **About Page** (`group_about_page`)
- About Content Section (subtitle, title, description, features, images, experience)
- About Details (repeater con icon, title, description)
- Approach Section (Mission, Vision, Value - cada uno con title, heading, content, image)

#### **Contact Page** (`group_contact_page`)
- Contact Section (subtitle, title, description)
- Map Embed Code

#### **Services Page** (`group_services_page`)
- Services Section (subtitle, title, description)
- Services Items (repeater con icon, title, description, link)

#### **Menu Page** (`group_menu_page`)
- Menu Section (subtitle, title, description)

## 📝 Próximos Pasos:

### 1. Activar ACF to GraphQL
1. Ve a **Plugins** en WordPress admin
2. Activa **"WPGraphQL for Advanced Custom Fields"**

### 2. Verificar Campos ACF
1. Ve a **Custom Fields** en el menú de WordPress
2. Deberías ver los grupos creados:
   - Home Page Sections
   - About Page Sections
   - Contact Page Sections
   - Services Page Sections
   - Menu Page Sections

### 3. Editar una Página
1. Ve a **Pages** → Edita "About"
2. Deberías ver el meta box **"About Page Sections"** con todos los campos
3. Edita los campos y guarda

### 4. Modificar Backend
El backend necesita ser actualizado para obtener los campos ACF via GraphQL.

### 5. Actualizar Frontend
Los componentes Vue necesitan ser actualizados para usar los datos de ACF.

## 🔍 Verificar que Funciona:

1. **En WordPress Admin:**
   - Custom Fields → Deberías ver los grupos
   - Pages → Edit "About" → Deberías ver los campos

2. **En GraphQL:**
   - Ve a GraphiQL IDE
   - Ejecuta esta query:
   ```graphql
   {
     page(id: "about", idType: SLUG) {
       title
       acfFields {
         ... on Page_AcfFields {
           aboutContentSubtitle
           aboutContentTitle
         }
       }
     }
   }
   ```

## ⚠️ Nota Importante:

Los campos ACF se crean automáticamente cuando:
1. ACF está activo
2. El plugin `restaurant-theme-config` está activo
3. Se carga la página de admin o frontend

Si no ves los campos, recarga la página o desactiva/reactiva el plugin.

