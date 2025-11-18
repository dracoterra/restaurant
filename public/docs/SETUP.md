# Guía de Configuración del Proyecto

## Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0
- WordPress instalado y configurado
- MongoDB (opcional, para funcionalidades futuras)
- Redis (opcional, para caché)

## Configuración Inicial

### 1. WordPress

Asegúrate de tener WordPress instalado con:
- WPGraphQL plugin activado
- REST API habilitada
- ACF (Advanced Custom Fields) instalado
- WooCommerce (opcional, para productos)

**URLs importantes:**
- WordPress Admin: `http://restaurant.local/wp-admin`
- GraphQL Endpoint: `http://restaurant.local/graphql`
- REST API: `http://restaurant.local/wp-json/wp/v2`

### 2. Backend (FeathersJS)

1. Navega a la carpeta del backend:
```bash
cd backend
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` en la carpeta `backend/`:
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

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

El backend estará disponible en `http://localhost:3030`

### 3. Frontend (Nuxt 3)

1. Navega a la carpeta del frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` en la carpeta `frontend/`:
```env
API_BASE_URL=http://localhost:3030
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## Verificación

### Verificar Backend

1. Abre `http://localhost:3030/insights` en tu navegador
2. Deberías ver una respuesta JSON con los insights

### Verificar Frontend

1. Abre `http://localhost:3000` en tu navegador
2. La página principal debería cargar correctamente

## Solución de Problemas

### Error: "Cannot connect to WordPress"

- Verifica que WordPress esté corriendo
- Verifica las credenciales en `.env`
- Verifica que WPGraphQL esté activado

### Error: "CORS error"

- Verifica que `CORS_ORIGIN` en el backend coincida con la URL del frontend
- Verifica que el backend esté corriendo

### Error: "TypeScript errors"

- Ejecuta `npm install` en el frontend para instalar los tipos
- Verifica que `tsconfig.json` esté configurado correctamente

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

## Estructura de Archivos

```
app/
├── public/          # WordPress (CMS)
├── backend/         # FeathersJS Backend
│   ├── src/
│   │   ├── services/    # Servicios de la API
│   │   ├── middleware/  # Middleware personalizado
│   │   └── utils/       # Utilidades
│   └── .env            # Variables de entorno
├── frontend/        # Nuxt 3 Frontend
│   ├── components/      # Componentes Vue
│   ├── pages/          # Páginas
│   ├── stores/         # Stores Pinia
│   ├── composables/    # Composables
│   └── .env            # Variables de entorno
└── docs/            # Documentación
```

