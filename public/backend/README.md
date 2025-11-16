# Restaurant Backend

Backend en FeathersJS para el proyecto Restaurant.

## Instalación

```bash
npm install
```

## Configuración

Copia `.env.example` a `.env` y configura las variables de entorno:

```bash
cp .env.example .env
```

## Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## Endpoints

- `GET /insights` - Lista de insights (posts)
- `GET /insights/:slug` - Obtener insight por slug
- `GET /emails` - Lista de plantillas de email
- `GET /emails/:id` - Obtener plantilla de email
- `POST /emails` - Generar email desde MJML
- `PATCH /emails/:id` - Generar PDF desde HTML

