# Conexión WordPress - Backend - Frontend

## 📋 Índice

1. [Visión General](#visión-general)
2. [Arquitectura de Conexión](#arquitectura-de-conexión)
3. [Backend (FeathersJS)](#backend-feathersjs)
4. [Frontend (Nuxt)](#frontend-nuxt)
5. [Flujo de Datos Completo](#flujo-de-datos-completo)
6. [Autenticación](#autenticación)
7. [Servicios Disponibles](#servicios-disponibles)
8. [Manejo de Errores](#manejo-de-errores)
9. [Configuración](#configuración)

---

## Visión General

El proyecto utiliza una arquitectura de tres capas donde **WordPress** actúa como CMS, el **Backend (FeathersJS)** como intermediario API, y el **Frontend (Nuxt)** como cliente.

```
┌─────────────┐      HTTP/REST      ┌──────────────┐      GraphQL/REST      ┌─────────────┐
│   Frontend  │ ──────────────────> │    Backend   │ ────────────────────> │  WordPress  │
│   (Nuxt)    │ <────────────────── │ (FeathersJS) │ <──────────────────── │    (CMS)    │
└─────────────┘      JSON Response  └──────────────┘      JSON Response     └─────────────┘
```

### ¿Por qué esta arquitectura?

1. **Separación de responsabilidades**: WordPress solo gestiona contenido, el backend transforma datos, el frontend presenta
2. **Seguridad**: WordPress no está expuesto directamente al frontend
3. **Flexibilidad**: Puedes cambiar el CMS sin afectar el frontend
4. **Performance**: El backend puede cachear y optimizar respuestas

---

## Arquitectura de Conexión

### Flujo de Datos

```
Usuario → Frontend (Nuxt) → Backend (FeathersJS) → WordPress (GraphQL/REST) → Backend → Frontend → Usuario
```

### Componentes

1. **WordPress (CMS)**
   - Almacena contenido (posts, páginas, productos, etc.)
   - Expone datos vía GraphQL (WPGraphQL) y REST API
   - Gestiona ACF fields y meta data

2. **Backend (FeathersJS)**
   - Recibe peticiones del frontend
   - Se conecta a WordPress usando GraphQL y REST API
   - Transforma y estructura los datos
   - Maneja autenticación, retry, timeout
   - Devuelve datos normalizados al frontend

3. **Frontend (Nuxt)**
   - Hace peticiones HTTP al backend
   - Gestiona estado con Pinia stores
   - Renderiza la UI

---

## Backend (FeathersJS)

### Estructura de Servicios

Cada servicio en el backend se conecta a WordPress de forma independiente:

```
backend/src/services/
├── insights/      # Posts/Blog
├── pages/         # Páginas estáticas
├── products/      # Productos (WooCommerce)
├── menus/         # Menús de navegación
├── settings/      # Configuración del tema
├── contact/       # Formulario de contacto
└── reservations/  # Reservas
```

### Conexión a WordPress

#### 1. Configuración Inicial

Cada servicio se inicializa con:

```javascript
class PagesService {
  constructor(options) {
    // URLs de WordPress
    this.wpGraphQLUrl = process.env.WP_GRAPHQL_URL || 'http://restaurant.local/graphql';
    this.wpRestUrl = process.env.WP_REST_URL || 'http://restaurant.local/wp-json/wp/v2';
    
    // Credenciales
    this.wpUser = process.env.WP_USER || 'admin';
    this.wpPassword = process.env.WP_PASSWORD || '';
    
    // Crear header de autenticación Basic Auth
    const credentials = Buffer.from(`${this.wpUser}:${this.wpPassword}`).toString('base64');
    this.authHeader = `Basic ${credentials}`;
    
    // Inicializar cliente GraphQL
    this.graphQLClient = new GraphQLClient(this.wpGraphQLUrl, {
      headers: {
        'Authorization': this.authHeader
      }
    });
  }
}
```

#### 2. Métodos de Conexión

**GraphQL (Principal)**
- Usado para: Posts, Pages, Products, Menus
- Cliente: `graphql-request`
- Ventajas: Consultas complejas, solo datos necesarios

**REST API (Complementario)**
- Usado para: Settings, Meta fields, cuando GraphQL no tiene el campo
- Cliente: `axios`
- Ventajas: Acceso a meta fields, opciones de WordPress

#### 3. Ejemplo: Pages Service

```javascript
async get(id, params) {
  // 1. Query GraphQL básica
  const graphqlQuery = `
    query GetPageBySlug($slug: ID!) {
      page(id: $slug, idType: URI) {
        id
        title
        slug
        content
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  `;
  
  // 2. Ejecutar con retry y timeout
  const data = await retry(
    () => timeout(
      this.graphQLClient.request(graphqlQuery, { slug: id }),
      10000, // 10 segundos timeout
      'Timeout al conectar con WordPress GraphQL'
    ),
    {
      retries: 2,
      delay: 1000,
      onRetry: (error, attempt) => {
        logger.warn(`Reintentando (intento ${attempt}/3):`, error.message);
      }
    }
  );
  
  // 3. Si faltan campos ACF, usar REST API como fallback
  if (!data.page.acf) {
    const metaFields = await this.fetchPageMetaFields(data.page.databaseId);
    // Transformar meta fields a formato ACF
  }
  
  // 4. Transformar y retornar
  return this.transformPage(data.page);
}
```

### Utilidades del Backend

#### Retry (Reintentos Automáticos)

```javascript
// backend/src/utils/retry.js
async function retry(fn, options = {}) {
  const { retries = 3, delay = 1000, backoff = 2 } = options;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt < retries) {
        const waitTime = delay * Math.pow(backoff, attempt);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  throw lastError;
}
```

**Características:**
- Reintentos exponenciales (1s, 2s, 4s)
- Logging de intentos
- Configurable por servicio

#### Timeout (Control de Tiempo)

```javascript
// backend/src/utils/timeout.js
function timeout(promise, ms, errorMessage = 'Operation timed out') {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), ms)
    )
  ]);
}
```

**Características:**
- Timeout de 10 segundos por defecto
- Previene peticiones colgadas
- Mensajes de error claros

### Transformación de Datos

Cada servicio transforma los datos de WordPress a un formato estándar:

```javascript
transformPage(page) {
  return {
    id: page.id,
    title: page.title,
    slug: page.slug,
    content: page.content,
    featuredImage: page.featuredImage?.node ? {
      url: page.featuredImage.node.sourceUrl,
      alt: page.featuredImage.node.altText || '',
      width: page.featuredImage.node.mediaDetails?.width || null,
      height: page.featuredImage.node.mediaDetails?.height || null
    } : null,
    acf: {
      // Transformar campos ACF
      homePageSections: this.transformACFSection(page.homePageSections)
    }
  };
}
```

---

## Frontend (Nuxt)

### Composable useApi

El frontend usa un composable centralizado para comunicarse con el backend:

```typescript
// frontend/composables/useApi.ts
export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl || 'http://localhost:3030'
  
  return {
    async get<T>(url: string, options?: any): Promise<{ data: T }> {
      const response = await $fetch<T>(url, {
        baseURL,
        method: 'GET',
        ...options
      })
      return { data: response }
    },
    
    async post<T>(url: string, data?: any): Promise<{ data: T }> {
      const response = await $fetch<T>(url, {
        baseURL,
        method: 'POST',
        body: data,
        ...options
      })
      return { data: response }
    }
  }
}
```

### Stores (Pinia)

Cada store gestiona un tipo de dato:

```typescript
// frontend/stores/pages.ts
export const usePagesStore = defineStore('pages', {
  state: () => ({
    pages: [] as Page[],
    currentPage: null as Page | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchPageBySlug(slug: string) {
      this.loading = true
      this.error = null

      try {
        const api = useApi()
        const response = await api.get<Page>(`/pages/${slug}`)
        this.currentPage = response.data
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Error al cargar la página'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
```

### Uso en Componentes

```vue
<script setup lang="ts">
import { usePagesStore } from '~/stores/pages'

const pagesStore = usePagesStore()

onMounted(async () => {
  await pagesStore.fetchPageBySlug('about')
})

const page = computed(() => pagesStore.currentPage)
</script>

<template>
  <div v-if="pagesStore.loading">Cargando...</div>
  <div v-else-if="pagesStore.error">{{ pagesStore.error }}</div>
  <div v-else-if="page">
    <h1>{{ page.title }}</h1>
    <div v-html="page.content"></div>
  </div>
</template>
```

---

## Flujo de Datos Completo

### Ejemplo: Cargar una Página

```
1. Usuario visita /about
   ↓
2. Nuxt ejecuta onMounted() en about.vue
   ↓
3. pagesStore.fetchPageBySlug('about')
   ↓
4. useApi().get('/pages/about')
   ↓
5. HTTP GET http://localhost:3030/pages/about
   ↓
6. Backend: PagesService.get('about')
   ↓
7. Backend: GraphQL query a WordPress
   POST http://restaurant.local/graphql
   Authorization: Basic <credentials>
   ↓
8. WordPress procesa query y retorna datos
   ↓
9. Backend transforma datos
   ↓
10. Backend retorna JSON al frontend
    ↓
11. Frontend actualiza store
    ↓
12. Componente se re-renderiza con datos
```

### Ejemplo: Cargar Posts con Búsqueda

```
1. Usuario busca "pizza" en blog
   ↓
2. insightsStore.fetchInsights({ search: 'pizza' })
   ↓
3. useApi().get('/insights', { params: { search: 'pizza' } })
   ↓
4. HTTP GET http://localhost:3030/insights?search=pizza
   ↓
5. Backend: InsightsService.find({ query: { search: 'pizza' } })
   ↓
6. Backend construye query GraphQL dinámica:
   query GetPosts($search: String) {
     posts(where: { search: $search }) {
       edges {
         node {
           title
           slug
           excerpt
         }
       }
     }
   }
   ↓
7. WordPress retorna posts que coinciden
   ↓
8. Backend transforma y retorna
   ↓
9. Frontend muestra resultados
```

---

## Autenticación

### Backend → WordPress

**Método:** Basic Authentication

```javascript
// Credenciales desde variables de entorno
const credentials = Buffer.from(`${wpUser}:${wpPassword}`).toString('base64');
const authHeader = `Basic ${credentials}`;

// En cada petición
headers: {
  'Authorization': authHeader
}
```

**Variables de Entorno:**
```env
WP_USER=admin
WP_PASSWORD=tu_contraseña
```

**¿Por qué Basic Auth?**
- Simple y directo
- WordPress lo soporta nativamente
- Suficiente para comunicación servidor-servidor
- No requiere tokens OAuth complejos

### Frontend → Backend

**Método:** Sin autenticación (público)

El backend es público porque:
- Solo expone datos de lectura
- WordPress ya controla qué datos son públicos
- No hay operaciones sensibles

**CORS Configurado:**
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

---

## Servicios Disponibles

### 1. Insights Service (`/insights`)

**Endpoints:**
- `GET /insights` - Lista de posts
- `GET /insights/:slug` - Post por slug

**Fuente:** WordPress Posts (GraphQL)

**Query GraphQL:**
```graphql
query GetPosts($first: Int, $search: String) {
  posts(first: $first, where: { search: $search, status: PUBLISH }) {
    edges {
      node {
        id
        title
        slug
        excerpt
        content
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
}
```

### 2. Pages Service (`/pages`)

**Endpoints:**
- `GET /pages` - Lista de páginas
- `GET /pages/:slug` - Página por slug con ACF fields

**Fuente:** WordPress Pages (GraphQL + REST API para meta fields)

**Características:**
- Query básica primero (rápida)
- Query extendida con ACF si está disponible
- Fallback a REST API para meta fields si GraphQL no tiene los campos

### 3. Products Service (`/products`)

**Endpoints:**
- `GET /products` - Lista de productos
- `GET /products/:id` - Producto por ID

**Fuente:** WooCommerce (GraphQL)

### 4. Menus Service (`/menus`)

**Endpoints:**
- `GET /menus` - Menús de navegación

**Fuente:** WordPress Menus (GraphQL)

### 5. Settings Service (`/settings`)

**Endpoints:**
- `GET /settings` - Configuración del tema

**Fuente:** WordPress Options (REST API)

**Ejemplo:**
```javascript
// Obtener opciones desde REST API
const response = await axios.get(`${wpRestUrl}/options`, {
  headers: { 'Authorization': authHeader }
});
```

### 6. Contact Service (`/contact`)

**Endpoints:**
- `POST /contact` - Enviar formulario de contacto

**Características:**
- Validación de datos
- Logging
- Preparado para envío de emails

### 7. Reservations Service (`/reservations`)

**Endpoints:**
- `POST /reservations` - Crear reserva

**Características:**
- Validación de datos
- Logging
- Preparado para notificaciones

---

## Manejo de Errores

### Backend

#### 1. Errores de Conexión

```javascript
try {
  const data = await this.graphQLClient.request(query, variables);
} catch (error) {
  // Error de GraphQL
  if (error.response) {
    const graphqlErrors = error.response.errors || [];
    const errorMessage = graphqlErrors.map(e => e.message).join(', ');
    throw new Error(errorMessage);
  }
  
  // Error de timeout
  if (error.message.includes('Timeout')) {
    throw new Error('Timeout al conectar con WordPress');
  }
  
  // Error genérico
  throw new Error(`Error: ${error.message}`);
}
```

#### 2. Retry Automático

```javascript
const data = await retry(
  () => timeout(
    this.graphQLClient.request(query, variables),
    10000,
    'Timeout'
  ),
  {
    retries: 2,
    delay: 1000,
    onRetry: (error, attempt) => {
      logger.warn(`Reintentando (${attempt}/3):`, error.message);
    }
  }
);
```

#### 3. Logging

```javascript
const logger = require('../../logger');

logger.info('Obteniendo páginas de WordPress');
logger.error('Error al obtener páginas:', error);
logger.warn('Campos ACF no disponibles, usando datos básicos');
```

### Frontend

#### 1. Manejo en Stores

```typescript
async fetchPageBySlug(slug: string) {
  this.loading = true
  this.error = null

  try {
    const api = useApi()
    const response = await api.get<Page>(`/pages/${slug}`)
    this.currentPage = response.data
  } catch (error: any) {
    this.error = error.message || 'Error al cargar la página'
    throw error
  } finally {
    this.loading = false
  }
}
```

#### 2. Manejo en Componentes

```vue
<template>
  <div v-if="pagesStore.loading">Cargando...</div>
  <div v-else-if="pagesStore.error" class="error">
    {{ pagesStore.error }}
  </div>
  <div v-else-if="page">
    <!-- Contenido -->
  </div>
</template>
```

---

## Configuración

### Variables de Entorno Backend

Crear archivo `backend/.env`:

```env
# WordPress URLs
WP_GRAPHQL_URL=http://restaurant.local/graphql
WP_REST_URL=http://restaurant.local/wp-json/wp/v2

# WordPress Credentials
WP_USER=admin
WP_PASSWORD=tu_contraseña_aqui

# Backend Configuration
PORT=3030
HOST=0.0.0.0
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Variables de Entorno Frontend

Crear archivo `frontend/.env`:

```env
# Backend API URL
API_BASE_URL=http://localhost:3030
```

Configurar en `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3030'
    }
  }
})
```

### Verificación de Conexión

#### 1. Verificar WordPress GraphQL

```bash
curl -X POST http://restaurant.local/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(echo -n 'admin:password' | base64)" \
  -d '{"query":"{ __typename }"}'
```

#### 2. Verificar Backend

```bash
curl http://localhost:3030/insights
```

#### 3. Verificar Frontend

Abrir `http://localhost:3000` y revisar la consola del navegador.

---

## Resumen

### Flujo Completo

1. **Frontend** hace petición HTTP al backend
2. **Backend** recibe petición y valida
3. **Backend** se conecta a WordPress usando GraphQL/REST
4. **WordPress** procesa y retorna datos
5. **Backend** transforma datos a formato estándar
6. **Backend** retorna JSON al frontend
7. **Frontend** actualiza store (Pinia)
8. **Frontend** re-renderiza componentes

### Ventajas de esta Arquitectura

✅ **Separación de responsabilidades**
✅ **Seguridad** (WordPress no expuesto)
✅ **Flexibilidad** (cambiar CMS sin afectar frontend)
✅ **Performance** (backend puede cachear)
✅ **Manejo robusto de errores** (retry, timeout)
✅ **Escalabilidad** (fácil agregar nuevos servicios)

### Puntos Clave

- **GraphQL** para consultas complejas y eficientes
- **REST API** como fallback para meta fields
- **Basic Auth** para autenticación servidor-servidor
- **Retry automático** para manejar errores temporales
- **Timeout** para prevenir peticiones colgadas
- **Transformación de datos** para formato consistente

---

**Última actualización:** 2024

