# Implementación de Páginas Dinámicas desde WordPress

## ✅ Lo que se ha creado

### 1. Backend - Servicio de Páginas
- **Archivo**: `backend/src/services/pages/pages.service.js`
- **Endpoint**: `GET /pages` y `GET /pages/:slug`
- **Funcionalidad**: Obtiene páginas de WordPress via GraphQL

### 2. Frontend - Store de Páginas
- **Archivo**: `frontend/stores/pages.ts`
- **Funcionalidad**: Gestiona el estado de las páginas obtenidas desde WordPress

### 3. Ejemplo de Página Dinámica
- **Archivo**: `frontend/pages/about-dynamic.vue`
- **Funcionalidad**: Ejemplo de cómo usar contenido dinámico desde WordPress

## 🚀 Cómo usar

### Paso 1: Reiniciar el Backend
```bash
cd backend
npm start
```

### Paso 2: Verificar el Endpoint
```bash
# Obtener todas las páginas
curl http://localhost:3030/pages

# Obtener página por slug
curl http://localhost:3030/pages/about
```

### Paso 3: Modificar tus páginas Vue

**Opción A: Reemplazar completamente con contenido de WordPress**

```vue
<template>
  <div>
    <SectionsPageHeader :title="page?.title || 'Page Title'" />
    
    <div class="container" v-if="page">
      <div v-html="page.content"></div>
    </div>
    
    <div v-if="pagesStore.loading">Cargando...</div>
  </div>
</template>

<script setup lang="ts">
import { usePagesStore } from '~/stores/pages'

const route = useRoute()
const pagesStore = usePagesStore()
const page = ref(null)

onMounted(async () => {
  const slug = route.path.replace('/', '') || 'home'
  page.value = await pagesStore.fetchPageBySlug(slug)
})
</script>
```

**Opción B: Híbrida (Layout frontend + contenido WP)**

```vue
<template>
  <div>
    <!-- Layout del frontend -->
    <SectionsPageHeader :title="page?.title || 'About Us'" />
    
    <div class="about-us">
      <div class="container">
        <div class="row">
          <!-- Contenido desde WordPress -->
          <div class="col-lg-8" v-if="page">
            <div v-html="page.content"></div>
          </div>
          
          <!-- Sidebar o secciones estáticas -->
          <div class="col-lg-4">
            <!-- Contenido estático del tema -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

## 📝 Pasos para cada página

### 1. Página About (`/about`)

1. **En WordPress**: Crear/editar página con slug `about`
2. **En Frontend**: Modificar `pages/about.vue` para usar `usePagesStore`

```vue
<script setup lang="ts">
import { usePagesStore } from '~/stores/pages'

const pagesStore = usePagesStore()
const page = ref(null)

onMounted(async () => {
  page.value = await pagesStore.fetchPageBySlug('about')
})
</script>
```

### 2. Página Contact (`/contact`)

1. **En WordPress**: Crear/editar página con slug `contact`
2. **En Frontend**: Modificar `pages/contact.vue`

### 3. Página Services (`/services`)

1. **En WordPress**: Crear/editar página con slug `services`
2. **En Frontend**: Modificar `pages/services.vue`

## 🎨 Customización Avanzada con Campos Personalizados

Para customizar secciones específicas, necesitas:

### 1. Instalar ACF (Advanced Custom Fields)
- Plugin de WordPress: Advanced Custom Fields
- Crear grupos de campos para cada tipo de página

### 2. Extender el servicio del backend

Modificar `backend/src/services/pages/pages.service.js` para incluir campos personalizados:

```javascript
// Agregar a la query GraphQL
customFields {
  heroTitle
  heroSubtitle
  missionTitle
  missionContent
}
```

### 3. Usar en el frontend

```vue
<template>
  <div>
    <h1>{{ page?.customFields?.heroTitle || page?.title }}</h1>
    <p>{{ page?.customFields?.heroSubtitle }}</p>
    <div v-html="page?.content"></div>
  </div>
</template>
```

## 🔄 Migración Gradual

Puedes migrar las páginas una por una:

1. **Mantener páginas estáticas** que funcionan bien
2. **Migrar a dinámicas** las que necesitan edición frecuente
3. **Usar híbrido** para páginas complejas

## ✅ Checklist

- [x] Servicio de páginas creado en backend
- [x] Store de páginas creado en frontend
- [x] Ejemplo de página dinámica creado
- [ ] Modificar `pages/about.vue` para usar contenido dinámico
- [ ] Modificar `pages/contact.vue` para usar contenido dinámico
- [ ] Modificar `pages/services.vue` para usar contenido dinámico
- [ ] Instalar ACF en WordPress (opcional)
- [ ] Crear campos personalizados (opcional)
- [ ] Extender servicio para incluir campos personalizados (opcional)

## 📚 Documentación Adicional

Ver `CUSTOMIZACION_PAGINAS.md` para más detalles sobre opciones de customización.

