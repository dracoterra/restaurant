# Verificación del Proyecto

## Estado de los Servicios

### ✅ Frontend (Nuxt 4)
- **URL**: http://localhost:3000
- **Estado**: ✅ Funcionando (200 OK)
- **Puerto**: 3000

### ✅ WordPress
- **URL**: http://restaurant.local
- **Estado**: ✅ Funcionando (200 OK)
- **Plugins activos**:
  - ✅ WooCommerce
  - ✅ WPGraphQL
  - ✅ WPGraphQL WooCommerce

### ⚠️ Backend (FeathersJS)
- **URL**: http://localhost:3030
- **Estado**: ⚠️ Error 500 (investigando)
- **Puerto**: 3030
- **Endpoints**:
  - `/insights` - ⚠️ Error 500
  - `/products` - ⚠️ Por verificar
  - `/emails` - ⚠️ Por verificar

### ⚠️ WPGraphQL
- **URL**: http://restaurant.local/graphql
- **Estado**: ⚠️ Error 500 (puede ser por autenticación)

## Problemas Detectados

### 1. Backend Error 500
- **Causa posible**: Error en la conexión con WordPress GraphQL
- **Acción**: Verificar logs del backend y conexión con WordPress

### 2. WPGraphQL Error 500
- **Causa posible**: Requiere autenticación o hay un error en la query
- **Acción**: Verificar configuración de WPGraphQL

## Próximos Pasos

1. ✅ Verificar que todos los servicios estén corriendo
2. ⚠️ Investigar error 500 del backend
3. ⚠️ Verificar conexión backend -> WordPress
4. ⚠️ Probar endpoints individuales
5. ⚠️ Verificar logs del backend

## Comandos Útiles

### Iniciar Backend
```powershell
cd backend
npm run dev
```

### Iniciar Frontend
```powershell
cd frontend
npm run dev
```

### Verificar Backend
```powershell
Invoke-RestMethod -Uri "http://localhost:3030/insights" -Method GET
```

### Verificar Frontend
```powershell
Invoke-WebRequest -Uri "http://localhost:3000" -Method GET
```

### Verificar WordPress
```powershell
Invoke-WebRequest -Uri "http://restaurant.local" -Method GET
```

