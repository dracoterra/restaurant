# Restaurant Backend

Backend en FeathersJS v5 para el proyecto Restaurant. Actúa como intermediario entre el frontend Nuxt y WordPress.

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env` en la raíz del backend con las siguientes variables:

```env
WP_GRAPHQL_URL=http://restaurant.local/graphql
WP_REST_URL=http://restaurant.local/wp-json/wp/v2
WP_USER=admin
WP_PASSWORD=tu_contraseña_aqui
PORT=3030
HOST=0.0.0.0
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## Ejecución

### Desarrollo
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3030`

### Producción
```bash
npm start
```

## Servicios Disponibles

### Insights Service
- `GET /insights` - Lista de insights (posts) con paginación
- `GET /insights/:slug` - Obtener insight por slug
- **Fuente**: WordPress Posts (GraphQL)

### Pages Service
- `GET /pages` - Lista de páginas
- `GET /pages/:slug` - Obtener página por slug con campos ACF
- **Fuente**: WordPress Pages (GraphQL + REST API)

### Products Service
- `GET /products` - Lista de productos
- `GET /products/:id` - Obtener producto por ID
- **Fuente**: WooCommerce (GraphQL)

### Menus Service
- `GET /menus` - Obtener menús de navegación
- **Fuente**: WordPress Menus (GraphQL)

### Settings Service
- `GET /settings` - Obtener configuración del tema
- **Fuente**: WordPress Options (REST API)

### Emails Service
- `GET /emails` - Lista de plantillas de email
- `GET /emails/:id` - Obtener plantilla de email
- `POST /emails` - Generar email desde MJML
- `PATCH /emails/:id` - Generar PDF desde HTML

## Características

- **Retry Logic**: Reintentos automáticos para peticiones fallidas
- **Timeout**: Control de tiempo de espera (10 segundos por defecto)
- **Logging**: Sistema de logging con Winston
- **Error Handling**: Transformación de errores GraphQL a formato estándar
- **CORS**: Configuración de CORS para permitir peticiones del frontend

## Estructura

```
backend/
├── src/
│   ├── services/        # Servicios de la API
│   │   ├── insights/
│   │   ├── pages/
│   │   ├── products/
│   │   ├── menus/
│   │   ├── settings/
│   │   └── emails/
│   ├── middleware/      # Middleware personalizado
│   ├── utils/          # Utilidades (retry, timeout)
│   ├── index.js        # Punto de entrada
│   └── logger.js       # Configuración de logging
├── default.json        # Configuración por defecto
└── package.json
```

## Autenticación

El backend usa **Basic Authentication** para comunicarse con WordPress:
- Las credenciales se configuran en variables de entorno
- Se codifican en Base64 y se envían en el header `Authorization`

## Dependencias Principales

- `@feathersjs/feathers`: Framework FeathersJS
- `@feathersjs/express`: Integración con Express
- `graphql-request`: Cliente GraphQL
- `axios`: Cliente HTTP
- `winston`: Sistema de logging
- `puppeteer`: Generación de PDFs
- `mjml`: Generación de emails

