# Guía de Customización de Páginas

## 📋 Arquitectura Actual

El proyecto tiene dos formas de manejar páginas:

### 1. **Páginas Estáticas del Frontend** (Actual)
- Ubicación: `frontend/pages/*.vue`
- Contenido: Hardcodeado en el componente Vue
- Ejemplo: `pages/about.vue`, `pages/contact.vue`

### 2. **Páginas Dinámicas desde WordPress** (Nuevo)
- Backend: `backend/src/services/pages/pages.service.js`
- Frontend: `frontend/stores/pages.ts`
- Contenido: Obtenido desde WordPress via GraphQL

## 🔧 Cómo Customizar las Páginas

### Opción 1: Contenido Dinámico desde WordPress (Recomendado)

#### Paso 1: Crear/Editar Página en WordPress
1. Ve a **Pages > Add New** o edita una página existente
2. Escribe el contenido en el editor de WordPress
3. Asegúrate de que el **slug** coincida con la ruta del frontend:
   - `about` → `/about`
   - `contact` → `/contact`
   - `services` → `/services`
   - `menu` → `/menu`

#### Paso 2: Usar Campos Personalizados (ACF o Meta Fields)

Para customizar secciones específicas, puedes usar **Advanced Custom Fields (ACF)** o campos personalizados:

**Ejemplo con ACF:**
```php
// Campos personalizados para la página About:
- hero_title (text)
- hero_subtitle (text)
- hero_image (image)
- mission_title (text)
- mission_content (textarea)
- vision_title (text)
- vision_content (textarea)
```

#### Paso 3: Modificar el Componente Vue

```vue
<template>
  <div>
    <!-- Contenido dinámico desde WordPress -->
    <div v-if="page" v-html="page.content"></div>
    
    <!-- O usar campos personalizados -->
    <div v-if="pageMeta">
      <h1>{{ pageMeta.hero_title }}</h1>
      <p>{{ pageMeta.hero_subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePagesStore } from '~/stores/pages'

const route = useRoute()
const pagesStore = usePagesStore()

const page = ref(null)
const pageMeta = ref(null)

onMounted(async () => {
  // Obtener página por slug
  const slug = route.path.replace('/', '') || 'home'
  page.value = await pagesStore.fetchPageBySlug(slug)
  
  // Obtener campos personalizados (si usas ACF)
  // pageMeta.value = await fetchPageMeta(page.value.databaseId)
})
</script>
```

### Opción 2: Híbrida (Contenido WP + Layout Frontend)

Combinar el layout del frontend con contenido de WordPress:

```vue
<template>
  <div>
    <!-- Layout del frontend -->
    <SectionsPageHeader :title="page?.title || 'About Us'" />
    
    <!-- Contenido desde WordPress -->
    <div class="container" v-if="page">
      <div class="row">
        <div class="col-lg-12">
          <div v-html="page.content"></div>
        </div>
      </div>
    </div>
    
    <!-- Secciones estáticas del tema -->
    <div class="our-approach">
      <!-- ... contenido estático ... -->
    </div>
  </div>
</template>
```

### Opción 3: Usar WordPress como CMS Headless

1. **Crear páginas en WordPress** con todo el contenido
2. **Modificar el frontend** para obtener y renderizar el contenido completo
3. **Usar bloques de Gutenberg** o HTML personalizado en WordPress

## 🎨 Campos Personalizados Recomendados

### Para Página About (`about`)
- `hero_title`: Título principal
- `hero_subtitle`: Subtítulo
- `hero_image`: Imagen destacada
- `mission_title`: Título de misión
- `mission_content`: Contenido de misión
- `vision_title`: Título de visión
- `vision_content`: Contenido de visión
- `value_title`: Título de valores
- `value_content`: Contenido de valores

### Para Página Contact (`contact`)
- `contact_form_title`: Título del formulario
- `address`: Dirección
- `phone`: Teléfono
- `email`: Email
- `map_embed`: Código de Google Maps
- `opening_hours`: Horarios

### Para Página Services (`services`)
- `services_intro`: Introducción
- `service_items`: Array de servicios (título, descripción, icono)

## 📝 Pasos para Implementar

1. **Instalar ACF** (Advanced Custom Fields) en WordPress
2. **Crear grupos de campos** para cada tipo de página
3. **Modificar el servicio del backend** para incluir campos personalizados
4. **Actualizar los componentes Vue** para usar los campos

## 🔄 Ejemplo de Implementación Completa

### Backend: Incluir campos personalizados en GraphQL

```javascript
// En pages.service.js
const graphqlQuery = `
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: SLUG) {
      id
      title
      content
      customFields {
        heroTitle
        heroSubtitle
        missionTitle
        missionContent
      }
    }
  }
`;
```

### Frontend: Usar campos personalizados

```vue
<template>
  <div>
    <h1>{{ page?.customFields?.heroTitle || page?.title }}</h1>
    <p>{{ page?.customFields?.heroSubtitle }}</p>
    <div v-html="page?.content"></div>
  </div>
</template>
```

## ✅ Ventajas de Cada Enfoque

### Contenido Dinámico (Opción 1)
- ✅ Totalmente editable desde WordPress
- ✅ No requiere cambios en código
- ❌ Menos control sobre el diseño

### Híbrida (Opción 2)
- ✅ Mejor control sobre diseño
- ✅ Contenido editable desde WordPress
- ⚠️ Requiere configuración inicial

### Headless (Opción 3)
- ✅ Máxima flexibilidad
- ✅ WordPress como CMS puro
- ❌ Más complejo de implementar

## 🚀 Recomendación

**Usar Opción 2 (Híbrida)**:
- Mantener el layout y diseño del frontend
- Obtener contenido dinámico desde WordPress
- Usar campos personalizados para secciones específicas
- Mejor balance entre flexibilidad y control

