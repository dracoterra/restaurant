# Arquitectura del Proyecto Restaurant

## Visión General

Este proyecto es una aplicación web completa con tres componentes principales:

1. **Frontend (Nuxt 3)**: Aplicación cliente Vue.js
2. **Backend (FeathersJS)**: API REST que actúa como intermediario
3. **CMS (WordPress)**: Sistema de gestión de contenido

## Flujo de Datos

```
Frontend (Nuxt) → Backend (FeathersJS) → WordPress (GraphQL/REST API)
```

### Flujo Detallado

1. El usuario interactúa con la aplicación Nuxt
2. Nuxt hace peticiones HTTP al backend FeathersJS
3. FeathersJS se comunica con WordPress usando:
   - **GraphQL** (WPGraphQL) para consultas complejas
   - **REST API** para operaciones simples y meta fields
4. WordPress procesa las peticiones y devuelve los datos
5. FeathersJS transforma y estructura los datos
6. Nuxt recibe los datos y los muestra al usuario

## Estructura del Backend

### Servicios Disponibles

#### 1. Insights Service (`/insights`)
- **GET /insights**: Lista de posts/insights
- **GET /insights/:slug**: Obtener insight por slug
- **Fuente**: WordPress Posts (GraphQL)

#### 2. Pages Service (`/pages`)
- **GET /pages**: Lista de páginas
- **GET /pages/:slug**: Obtener página por slug con campos ACF
- **Fuente**: WordPress Pages (GraphQL + REST API para meta fields)

#### 3. Products Service (`/products`)
- **GET /products**: Lista de productos
- **GET /products/:id**: Obtener producto por ID
- **Fuente**: WooCommerce (GraphQL)

#### 4. Menus Service (`/menus`)
- **GET /menus**: Obtener menús de navegación
- **Fuente**: WordPress Menus (GraphQL)

#### 5. Settings Service (`/settings`)
- **GET /settings**: Obtener configuración del tema
- **Fuente**: WordPress Options (REST API)

#### 6. Emails Service (`/emails`)
- **GET /emails**: Lista de plantillas de email
- **POST /emails**: Generar email desde MJML
- **PATCH /emails/:id**: Generar PDF desde HTML

### Utilidades del Backend

- **Retry**: Reintentos automáticos para peticiones fallidas
- **Timeout**: Control de tiempo de espera para peticiones
- **Logger**: Sistema de logging con Winston

## Estructura del Frontend

### Stores (Pinia)

#### 1. Insights Store
- Gestiona posts/insights del blog
- Métodos: `fetchInsights()`, `fetchInsightBySlug()`

#### 2. Pages Store
- Gestiona páginas estáticas
- Métodos: `fetchPages()`, `fetchPageBySlug()`

#### 3. Products Store
- Gestiona productos del menú
- Métodos: `fetchProducts()`, `fetchCategories()`

#### 4. Menu Store
- Gestiona menús de navegación
- Métodos: `fetchMenu()`

#### 5. Settings Store
- Gestiona configuración del tema
- Métodos: `fetchSettings()`

### Composables

#### useApi
- Cliente HTTP para comunicarse con el backend
- Maneja errores y transforma respuestas

#### useDayjs
- Utilidad para formateo de fechas
- Configurado con locale español

### Páginas

- `/`: Home (index.vue)
- `/about`: Sobre nosotros
- `/menu`: Menú del restaurante
- `/services`: Servicios
- `/blog`: Blog/Insights
- `/insights/[slug]`: Detalle de insight
- `/contact`: Contacto

## Configuración

### Variables de Entorno Backend

```env
WP_GRAPHQL_URL=http://restaurant.local/graphql
WP_REST_URL=http://restaurant.local/wp-json/wp/v2
WP_USER=admin
WP_PASSWORD=your_password
PORT=3030
HOST=0.0.0.0
CORS_ORIGIN=http://localhost:3000
```

### Variables de Entorno Frontend

```env
API_BASE_URL=http://localhost:3030
```

## Autenticación

El backend usa **Basic Authentication** para comunicarse con WordPress:
- Usuario y contraseña se configuran en variables de entorno
- Las credenciales se codifican en Base64
- Se envían en el header `Authorization: Basic <credentials>`

## Manejo de Errores

### Backend
- Timeout de 10 segundos por defecto
- Reintentos automáticos (2 intentos adicionales)
- Logging de errores con Winston
- Transformación de errores GraphQL a formato estándar

### Frontend
- Manejo de errores en stores
- Estados de carga y error en componentes
- Mensajes de error amigables al usuario

## Optimizaciones

1. **Caché**: Los datos se almacenan en stores de Pinia
2. **Lazy Loading**: Componentes cargados bajo demanda
3. **SSR Deshabilitado**: Para evitar problemas de hidratación
4. **Retry Logic**: Reintentos automáticos en el backend
5. **Timeout**: Control de tiempo de espera

## Tecnologías Clave

### Backend
- FeathersJS v5
- Express
- GraphQL Client
- Axios
- Winston (Logging)

### Frontend
- Nuxt 3
- Vue 3
- Pinia
- TypeScript
- Day.js

### CMS
- WordPress
- WPGraphQL
- ACF (Advanced Custom Fields)
- WooCommerce (opcional)

