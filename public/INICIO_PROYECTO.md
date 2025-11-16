# Inicio del Proyecto

## 🚀 Servicios Iniciados

### Backend (FeathersJS)
- **Puerto**: 3030
- **URL**: http://localhost:3030
- **Estado**: ✅ Iniciado

### Frontend (Nuxt 4)
- **Puerto**: 3000
- **URL**: http://localhost:3000
- **Estado**: ✅ Iniciado

### WordPress
- **URL**: http://restaurant.local
- **Admin**: http://restaurant.local/wp-admin
- **Estado**: ✅ Configurado

## 📋 Endpoints Disponibles

### Backend
- `GET http://localhost:3030/menus` - Obtener menús
- `GET http://localhost:3030/settings` - Obtener configuración del tema
- `GET http://localhost:3030/products` - Obtener productos
- `GET http://localhost:3030/insights` - Obtener posts/blog

### Frontend
- `http://localhost:3000` - Página principal
- `http://localhost:3000/about` - Sobre nosotros
- `http://localhost:3000/contact` - Contacto
- `http://localhost:3000/menu` - Menú
- `http://localhost:3000/services` - Servicios
- `http://localhost:3000/blog` - Blog

## 🔧 Comandos Útiles

### Iniciar Backend
```bash
cd backend
npm start
```

### Iniciar Frontend
```bash
cd frontend
npm run dev
```

### Detener Servicios
- Cerrar las ventanas de PowerShell donde están corriendo
- O usar `Ctrl+C` en cada terminal

## ✅ Verificación

Para verificar que todo funciona:
1. Abre http://localhost:3000 en tu navegador
2. Verifica que el frontend se vea correctamente
3. Verifica que la navegación funcione
4. Verifica que los datos se carguen desde WordPress

## 📝 Notas

- El backend debe estar corriendo antes que el frontend
- Si cambias código, el frontend se recarga automáticamente
- El backend necesita reiniciarse manualmente si cambias código

