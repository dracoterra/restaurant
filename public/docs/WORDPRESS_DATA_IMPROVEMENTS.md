# Mejoras de Integración WordPress - Frontend

## 📋 Análisis de Datos Faltantes

### Datos que WordPress envía pero NO estamos capturando:

1. **Body Classes** - Clases CSS dinámicas del `<body>` que WordPress genera según el contexto
2. **Logo del Customizer** - Logo personalizado desde Apariencia > Personalizar
3. **Theme Mods** - Configuraciones del tema (colores, fondos, etc.)
4. **Widgets y Sidebars** - Widgets registrados y sus contenidos
5. **Site Info Completo** - Información adicional del sitio (timezone, formatos de fecha, etc.)
6. **WordPress Options** - Opciones adicionales del sistema
7. **Metadata del sitio** - Para SEO y configuración

---

## 🎯 Lista de Mejoras Propuestas

### **PRIORIDAD ALTA** 🔴

#### 1. **Body Classes en el Frontend**
- **Problema**: WordPress genera clases CSS dinámicas en el `<body>` que son necesarias para estilos y funcionalidad
- **Solución**: 
  - Crear endpoint REST API para obtener body classes por página
  - Aplicar clases dinámicamente en `app.vue` o `layouts/default.vue`
- **Impacto**: Alto - Necesario para compatibilidad con temas y plugins

#### 2. **Logo desde Customizer**
- **Problema**: El logo está hardcodeado, no se obtiene del Customizer de WordPress
- **Solución**:
  - Crear endpoint para obtener `custom_logo` desde theme mods
  - Actualizar `SettingsService` para incluir logo
  - Actualizar Header y Footer para usar logo dinámico
- **Impacto**: Alto - Personalización del sitio

#### 3. **Site Info Completo**
- **Problema**: No estamos usando toda la información del sitio disponible
- **Solución**:
  - Extender `SettingsService` para incluir site info completo
  - Usar para metadata, SEO, y configuración
- **Impacto**: Medio-Alto - Mejora SEO y configuración

### **PRIORIDAD MEDIA** 🟡

#### 4. **Widgets y Sidebars**
- **Problema**: Los widgets de WordPress no se muestran en el frontend
- **Solución**:
  - Crear endpoint para obtener widgets por sidebar
  - Crear componente Vue para renderizar widgets
  - Integrar en layouts donde corresponda
- **Impacto**: Medio - Funcionalidad adicional

#### 5. **Theme Mods (Colores, Fondos, etc.)**
- **Problema**: Configuraciones del Customizer no se aplican
- **Solución**:
  - Obtener theme mods desde REST API
  - Aplicar como CSS variables o estilos inline
- **Impacto**: Medio - Personalización visual

#### 6. **WordPress Options Adicionales**
- **Problema**: Algunas opciones pueden ser útiles para el frontend
- **Solución**:
  - Crear endpoint para obtener opciones específicas
  - Usar según necesidad
- **Impacto**: Bajo-Medio - Funcionalidad específica

### **PRIORIDAD BAJA** 🟢

#### 7. **Metadata Mejorada**
- **Problema**: Metadata básica, podría ser más completa
- **Solución**:
  - Incluir más metadata en respuestas
  - Usar para SEO mejorado
- **Impacto**: Bajo - Mejora SEO

---

## 🚀 Plan de Implementación

### Fase 1: Plugin WordPress (Backend)
1. ✅ Crear plugin `restaurant-api-extensions`
2. ✅ Implementar endpoints REST API:
   - `/restaurant/v1/site-info`
   - `/restaurant/v1/body-classes`
   - `/restaurant/v1/theme-mods`
   - `/restaurant/v1/widgets`
   - `/restaurant/v1/options`
3. ✅ Extender GraphQL (opcional)

### Fase 2: Backend FeathersJS
1. Actualizar `SettingsService` para incluir nuevos datos
2. Crear servicio para body classes (o integrar en PagesService)
3. Actualizar servicios existentes para incluir metadata adicional

### Fase 3: Frontend Nuxt
1. Actualizar `SettingsStore` para incluir nuevos campos
2. Aplicar body classes dinámicamente
3. Actualizar Header/Footer para usar logo dinámico
4. Crear componente para widgets (si se implementa)
5. Aplicar theme mods como CSS variables

---

## 📝 Detalles de Implementación

### Body Classes
```javascript
// Backend: Obtener body classes por página
GET /restaurant/v1/body-classes?slug=home

// Frontend: Aplicar en app.vue
const bodyClasses = computed(() => pageStore.bodyClasses)
document.body.className = bodyClasses.value.join(' ')
```

### Logo Dinámico
```javascript
// Backend: Incluir en SettingsService
{
  logo: themeMods.custom_logo_url || '/images/logo.svg',
  logoData: themeMods.custom_logo_data
}

// Frontend: Usar en Header/Footer
<img :src="settings.logo" :alt="settings.logoData?.alt || 'Logo'">
```

### Widgets
```vue
<!-- Frontend: Componente Widget -->
<WidgetSidebar sidebar="footer" />
```

---

## ✅ Checklist de Implementación

- [ ] Plugin WordPress creado y activado
- [ ] Endpoints REST API funcionando
- [ ] Backend actualizado para usar nuevos endpoints
- [ ] Frontend actualizado para body classes
- [ ] Frontend actualizado para logo dinámico
- [ ] Frontend actualizado para site info
- [ ] Widgets implementados (opcional)
- [ ] Theme mods aplicados (opcional)
- [ ] Testing completo
- [ ] Documentación actualizada

