# Guía: Dónde Colocar HTML en Nuxt 4

## Opciones Disponibles

### 1. **Template HTML Base** (Recomendado para HTML completo)
**Ruta**: `frontend/app.html`

Este es el template HTML base de Nuxt. Si necesitas personalizar el HTML completo de la aplicación:

```html
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
  <head {{ HEAD_ATTRS }}>
    {{ HEAD }}
  </head>
  <body {{ BODY_ATTRS }}>
    {{ APP }}
  </body>
</html>
```

**Cuándo usar**: Cuando necesitas modificar la estructura HTML base (meta tags, scripts globales, etc.)

---

### 2. **Páginas Vue** (Recomendado para contenido)
**Ruta**: `frontend/pages/`

Convierte tu HTML en componentes Vue (.vue):

```vue
<template>
  <!-- Tu HTML aquí -->
  <div class="container">
    <h1>Mi Página</h1>
  </div>
</template>

<script setup>
// Lógica aquí
</script>

<style scoped>
/* Estilos aquí */
</style>
```

**Estructura actual**:
- `frontend/pages/index.vue` - Página principal
- `frontend/pages/insights/[slug].vue` - Página dinámica

**Cuándo usar**: Para páginas con contenido dinámico, componentes Vue, etc.

---

### 3. **Archivos Estáticos HTML** (Para HTML puro)
**Ruta**: `frontend/public/` (crear si no existe)

Si tienes HTML estático que no necesita procesamiento de Nuxt:

```
frontend/
  public/
    pagina-estatica.html
    otro-archivo.html
```

**Acceso**: `http://localhost:3000/pagina-estatica.html`

**Cuándo usar**: Para HTML completamente estático, landing pages simples, etc.

---

### 4. **Componentes Vue**
**Ruta**: `frontend/components/`

Para reutilizar bloques de HTML:

```vue
<!-- frontend/components/MiComponente.vue -->
<template>
  <div class="mi-componente">
    <!-- HTML del componente -->
  </div>
</template>
```

**Uso en páginas**:
```vue
<template>
  <div>
    <MiComponente />
  </div>
</template>
```

**Cuándo usar**: Para bloques de HTML reutilizables

---

### 5. **Layouts Personalizados**
**Ruta**: `frontend/layouts/` (crear si no existe)

Para estructuras HTML que se repiten en múltiples páginas:

```vue
<!-- frontend/layouts/default.vue -->
<template>
  <div class="layout-default">
    <header>Header</header>
    <main>
      <slot />
    </main>
    <footer>Footer</footer>
  </div>
</template>
```

**Uso en páginas**:
```vue
<script setup>
definePageMeta({
  layout: 'default'
})
</script>
```

**Cuándo usar**: Para estructuras comunes (header, footer, sidebar, etc.)

---

## Recomendación Según el Caso

### Si tienes HTML completo de un diseño:
1. **Crea componentes Vue** en `frontend/components/` para cada sección
2. **Crea layouts** en `frontend/layouts/` para la estructura general
3. **Crea páginas** en `frontend/pages/` que usen los componentes

### Si es HTML estático simple:
- Colócalo en `frontend/public/`

### Si necesitas modificar el HTML base:
- Crea `frontend/app.html`

---

## Ejemplo de Estructura Recomendada

```
frontend/
  app.html              # Template base (opcional)
  app.vue              # Componente raíz
  pages/
    index.vue          # Página principal
    about.vue          # Página about
  components/
    Header.vue         # Componente header
    Footer.vue         # Componente footer
    Card.vue           # Componente card
  layouts/
    default.vue        # Layout por defecto
    admin.vue          # Layout para admin
  public/
    favicon.ico        # Archivos estáticos
    robots.txt
```

---

## Próximos Pasos

1. **Dime qué tipo de HTML tienes** y te ayudo a estructurarlo
2. **Si es un diseño completo**, podemos crear los componentes necesarios
3. **Si es HTML estático**, lo colocamos en `public/`

