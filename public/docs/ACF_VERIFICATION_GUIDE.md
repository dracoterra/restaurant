# Guía de Verificación de Campos ACF

## 📋 Índice

1. [Herramientas de Verificación](#herramientas-de-verificación)
2. [Página de Debug Visual](#página-de-debug-visual)
3. [Composable de Debugging](#composable-de-debugging)
4. [Servicio de Debug Backend](#servicio-de-debug-backend)
5. [Verificación Paso a Paso](#verificación-paso-a-paso)
6. [Troubleshooting](#troubleshooting)

---

## Herramientas de Verificación

Se han creado herramientas profesionales para verificar si los campos ACF están llegando correctamente al frontend:

### 1. Página de Debug Visual (`/debug-acf`)

Una página completa de debugging con interfaz visual que permite:
- ✅ Verificar todas las páginas (Home, About, Contact, Services, Menu)
- ✅ Ver análisis detallado de campos ACF
- ✅ Visualizar datos raw (JSON completo)
- ✅ Identificar campos faltantes
- ✅ Ver muestras de datos

### 2. Composable `useAcfDebug`

Composable reutilizable para debugging programático:
- ✅ Análisis de campos ACF
- ✅ Generación de reportes
- ✅ Verificación de campos específicos
- ✅ Logging en consola

### 3. Servicio de Debug Backend (`/debug`)

Endpoint REST para verificación desde el backend:
- ✅ Verificar conexión con WordPress
- ✅ Probar GraphQL y REST API
- ✅ Analizar campos ACF de cualquier página

---

## Página de Debug Visual

### Acceso

Navega a: `http://localhost:3000/debug-acf`

### Características

1. **Selector de Página**
   - Botones para seleccionar entre Home, About, Contact, Services, Menu
   - Carga automática de datos al seleccionar

2. **Resumen de Estado**
   - ✅/❌ Indicador visual si hay campos ACF
   - Contador de campos totales
   - Lista de keys de ACF

3. **Análisis de Secciones**
   - Verificación de cada sección esperada
   - Lista de campos en cada sección
   - Muestra de datos (sample)

4. **Campos Faltantes**
   - Lista de campos que no están presentes
   - Identificación de problemas

5. **Datos Raw**
   - Pestañas para ver:
     - Full Page (datos completos de la página)
     - ACF Only (solo campos ACF)
     - Debug Report (reporte formateado)

### Uso

1. Abre `http://localhost:3000/debug-acf`
2. Selecciona una página (ej: "Home")
3. Revisa el resumen de estado
4. Analiza las secciones
5. Revisa los datos raw si es necesario

---

## Composable de Debugging

### Importar

```typescript
import { useAcfDebug } from '~/composables/useAcfDebug'

const { analyzeAcf, generateReport, logAcfData, checkFields } = useAcfDebug()
```

### Analizar Campos ACF

```typescript
const page = await pagesStore.fetchPageBySlug('home')
const info = analyzeAcf(page, ['homePageSections'])

console.log('Has ACF:', info.hasAcf)
console.log('Field Count:', info.fieldCount)
console.log('Missing Fields:', info.missingFields)
```

### Generar Reporte

```typescript
const report = generateReport(page, 'home')
console.log(report)
```

### Log en Consola

```typescript
logAcfData(page, 'home')
// Genera un log formateado en la consola del navegador
```

### Verificar Campos Específicos

```typescript
const fields = [
  'acf.homePageSections.heroTitle',
  'acf.homePageSections.heroDescription',
  'acf.homePageSections.heroMainImage.url'
]

const results = checkFields(page, fields)
// results = {
//   'acf.homePageSections.heroTitle': true,
//   'acf.homePageSections.heroDescription': false,
//   ...
// }
```

---

## Servicio de Debug Backend

### Endpoints Disponibles

#### 1. Verificar Estado General

```bash
GET http://localhost:3030/debug?action=status
```

**Respuesta:**
```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "wordpress": {
    "graphql": {
      "connected": true,
      "url": "http://restaurant.local/graphql"
    },
    "rest": {
      "connected": true,
      "url": "http://restaurant.local/wp-json/wp/v2",
      "version": "6.0"
    }
  },
  "authentication": {
    "user": "admin",
    "hasPassword": true
  }
}
```

#### 2. Probar GraphQL

```bash
GET http://localhost:3030/debug?action=graphql
```

#### 3. Probar REST API

```bash
GET http://localhost:3030/debug?action=rest
```

#### 4. Verificar Campos ACF

```bash
GET http://localhost:3030/debug?action=acf&slug=home
```

**Respuesta:**
```json
{
  "success": true,
  "page": {
    "id": "cG9zdDox",
    "slug": "home",
    "title": "Home"
  },
  "acf": {
    "hasAnyFields": true,
    "sections": {
      "homePageSections": {
        "exists": true,
        "isEmpty": false,
        "keys": ["heroSubtitle", "heroTitle", "heroDescription"],
        "sample": {
          "heroSubtitle": "Welcome",
          "heroTitle": "Restaurant"
        }
      }
    }
  }
}
```

---

## Verificación Paso a Paso

### Paso 1: Verificar Conexión Backend → WordPress

```bash
# Desde terminal
curl "http://localhost:3030/debug?action=status"
```

**Verificar:**
- ✅ `wordpress.graphql.connected` debe ser `true`
- ✅ `wordpress.rest.connected` debe ser `true`
- ✅ `authentication.hasPassword` debe ser `true`

### Paso 2: Verificar Campos ACF en GraphQL

```bash
curl "http://localhost:3030/debug?action=acf&slug=home"
```

**Verificar:**
- ✅ `success` debe ser `true`
- ✅ `acf.hasAnyFields` debe ser `true`
- ✅ `acf.sections.homePageSections.exists` debe ser `true`

### Paso 3: Verificar en Frontend

1. Abre `http://localhost:3000/debug-acf`
2. Selecciona "Home"
3. Verifica:
   - ✅ "Has ACF: YES ✅"
   - ✅ "Total Fields" > 0
   - ✅ Secciones listadas con datos

### Paso 4: Verificar en Consola del Navegador

1. Abre DevTools (F12)
2. Ve a la pestaña "Console"
3. Deberías ver logs como:
   ```
   🔍 ACF Debug - HOME
   === ACF DEBUG REPORT ===
   Has ACF: ✅ YES
   Field Count: 25
   ...
   ```

### Paso 5: Verificar en Logs del Backend

Revisa los logs del backend (consola donde corre FeathersJS):

```
=== ACF DEBUG - Page Data ===
Page Slug: home
Has ACF Fields: true
Home Page Sections Keys: ['heroSubtitle', 'heroTitle', ...]
After Transform - Has ACF: true
Transformed ACF Keys: ['homePageSections']
```

---

## Troubleshooting

### Problema: "Has ACF: NO ❌"

**Posibles causas:**
1. Los campos ACF no están configurados en WordPress
2. WPGraphQL for ACF no está activo
3. Los campos no están asignados a la página

**Solución:**
1. Verificar en WordPress Admin que los campos ACF existan
2. Verificar que WPGraphQL for ACF esté activo
3. Verificar que los grupos de campos estén asignados a la página

### Problema: "Has ACF: YES ✅" pero "Is Empty: YES ⚠️"

**Posibles causas:**
1. Los campos existen pero están vacíos
2. La transformación no está funcionando correctamente

**Solución:**
1. Verificar en WordPress que los campos tengan valores
2. Revisar los logs del backend para ver la transformación
3. Verificar la query GraphQL en el servicio

### Problema: Campos específicos faltantes

**Posibles causas:**
1. El campo no está en la query GraphQL
2. El nombre del campo es diferente
3. El campo está anidado incorrectamente

**Solución:**
1. Revisar la query GraphQL en `pages.service.js`
2. Verificar el nombre exacto del campo en WordPress
3. Agregar el campo a la query si falta

### Problema: Error de conexión

**Posibles causas:**
1. WordPress no está corriendo
2. URL incorrecta en variables de entorno
3. Credenciales incorrectas

**Solución:**
1. Verificar que WordPress esté corriendo
2. Revisar `backend/.env`:
   ```env
   WP_GRAPHQL_URL=http://restaurant.local/graphql
   WP_USER=admin
   WP_PASSWORD=tu_contraseña
   ```
3. Probar la conexión manualmente:
   ```bash
   curl -X POST http://restaurant.local/graphql \
     -H "Authorization: Basic $(echo -n 'admin:password' | base64)" \
     -H "Content-Type: application/json" \
     -d '{"query":"{ __typename }"}'
   ```

---

## Ejemplo de Uso Completo

### En un Componente Vue

```vue
<script setup lang="ts">
import { usePagesStore } from '~/stores/pages'
import { useAcfDebug } from '~/composables/useAcfDebug'

const pagesStore = usePagesStore()
const { analyzeAcf, logAcfData } = useAcfDebug()

onMounted(async () => {
  const page = await pagesStore.fetchPageBySlug('home')
  
  // Log automático
  logAcfData(page, 'home')
  
  // Análisis manual
  const info = analyzeAcf(page, ['homePageSections'])
  
  if (!info.hasAcf) {
    console.error('⚠️ No ACF fields found!')
  } else if (info.isEmpty) {
    console.warn('⚠️ ACF fields exist but are empty')
  } else {
    console.log('✅ ACF fields loaded successfully:', info.fieldCount, 'fields')
  }
})
</script>
```

### Desde Terminal (Backend)

```bash
# Verificar estado
curl "http://localhost:3030/debug?action=status"

# Verificar ACF de home
curl "http://localhost:3030/debug?action=acf&slug=home"

# Verificar ACF de about
curl "http://localhost:3030/debug?action=acf&slug=about"
```

---

## Checklist de Verificación

- [ ] Backend conectado a WordPress (GraphQL y REST)
- [ ] Autenticación funcionando
- [ ] Campos ACF existen en WordPress
- [ ] WPGraphQL for ACF activo
- [ ] Query GraphQL incluye campos ACF
- [ ] Transformación de datos funcionando
- [ ] Frontend recibe datos ACF
- [ ] Componentes muestran datos correctamente

---

**Última actualización:** 2024

