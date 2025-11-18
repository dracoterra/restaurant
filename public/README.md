# Restaurant Project

Aplicación web completa con Backend (FeathersJS), Frontend (Nuxt 4) y CMS (WordPress).

## Estructura del Proyecto

```
app/
├── public/          # WordPress (CMS)
├── backend/         # FeathersJS Backend
├── frontend/        # Nuxt 4 Frontend
└── docs/            # Documentación del proyecto
```

## Arquitectura

- **Frontend (Nuxt 4)**: Cliente que se comunica con el Backend
- **Backend (FeathersJS)**: Servidor que se comunica con WordPress
- **WordPress**: CMS que actúa como fuente de datos

## Configuración Inicial

### 1. WordPress

WordPress ya está configurado con:
- WPGraphQL activado
- REST API habilitada
- Debug mode activado para desarrollo

**URLs importantes:**
- WordPress Admin: `http://restaurant.local/wp-admin`
- GraphQL Endpoint: `http://restaurant.local/graphql`
- REST API: `http://restaurant.local/wp-json/wp/v2`

### 2. Backend (FeathersJS)

```bash
cd backend
npm install
npm run dev
```

El backend estará disponible en `http://localhost:3030`

**Endpoints:**
- `GET /insights` - Lista de insights (posts)
- `GET /insights/:slug` - Obtener insight por slug
- `GET /emails` - Lista de plantillas de email
- `POST /emails` - Generar email desde MJML
- `PATCH /emails/:id` - Generar PDF desde HTML

**Configuración:**
- Edita `backend/.env` con tus credenciales de WordPress

### 3. Frontend (Nuxt 4)

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

**Configuración:**
- Edita `frontend/.env` con la URL del backend

## Tecnologías

### Backend
- FeathersJS v5
- Express
- MongoDB
- Redis
- Puppeteer (PDFs)
- MJML (Emails)
- GraphQL Client
- Axios

### Frontend
- Nuxt 4
- Vue 3
- Pinia
- @nuxt/ui
- @nuxt/image
- Chart.js
- Day.js
- nuxt-jsonld

### CMS
- WordPress
- WPGraphQL
- REST API

## Desarrollo

1. Asegúrate de que WordPress esté corriendo en `http://restaurant.local`
2. Inicia el backend: `cd backend && npm run dev`
3. Inicia el frontend: `cd frontend && npm run dev`

## Producción

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Documentación

Toda la documentación histórica y técnica del proyecto se encuentra en la carpeta `docs/`. Consulta `docs/README.md` para ver el índice completo.

## Notas

- El backend usa Basic Auth para autenticarse con WordPress
- Las credenciales se configuran en `backend/.env`
- El frontend solo se comunica con el backend, nunca directamente con WordPress
- **IMPORTANTE**: Nunca commitees archivos `.env` con credenciales reales

## Documentación Adicional

### Documentación General
- [Arquitectura del Proyecto](docs/ARCHITECTURE.md) - Descripción detallada de la arquitectura
- [Guía de Configuración](docs/SETUP.md) - Instrucciones paso a paso para configurar el proyecto
- [Conexión WordPress - Backend - Frontend](docs/WORDPRESS_CONNECTION.md) - Explicación completa de cómo funciona la conexión entre WordPress, Backend y Frontend
- [Backend README](backend/README.md) - Documentación específica del backend

### Plugins
- [ACF Pro Features Free - Documentación Completa](docs/ACF_PRO_FEATURES_FREE_PLUGIN.md) - Plugin que proporciona todas las funcionalidades de ACF PRO de forma gratuita (Repeater, Flexible Content, Clone, Gallery, Options Pages)

