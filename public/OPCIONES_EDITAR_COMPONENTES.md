# Opciones para Editar Componentes/Secciones desde WordPress

## 🎯 Problema
Cada página tiene múltiples secciones/componentes que necesitas poder editar desde WordPress:
- Títulos, subtítulos, descripciones
- Imágenes
- Listas de items
- Botones y enlaces
- Tabs (Mission, Vision, Value)
- Formularios

## 📋 Opciones Disponibles

### **OPCIÓN 1: Advanced Custom Fields (ACF) - RECOMENDADA** ⭐

**Ventajas:**
- ✅ Interfaz visual en WordPress admin
- ✅ Fácil de usar para no programadores
- ✅ Campos organizados por sección
- ✅ Soporte para imágenes, texto, listas, etc.
- ✅ Integración con GraphQL (con plugin ACF to GraphQL)

**Cómo funciona:**
1. Instalas el plugin ACF en WordPress
2. Creas grupos de campos para cada página
3. Cada sección tiene sus propios campos editables
4. El frontend obtiene los datos via GraphQL
5. Los componentes Vue renderizan los datos

**Ejemplo para página About:**
```
Grupo: "About Page Sections"
├── Hero Section
│   ├── hero_title (text)
│   ├── hero_subtitle (text)
│   └── hero_image (image)
├── About Content Section
│   ├── about_title (text)
│   ├── about_subtitle (text)
│   ├── about_description (textarea)
│   ├── about_features (repeater)
│   │   ├── feature_text (text)
│   └── about_image (image)
├── Experience Box
│   ├── experience_years (number)
│   └── experience_text (text)
└── Our Approach Tabs
    ├── mission_title (text)
    ├── mission_content (wysiwyg)
    ├── vision_title (text)
    ├── vision_content (wysiwyg)
    ├── value_title (text)
    └── value_content (wysiwyg)
```

**Costo:** Plugin gratuito (versión básica) o $49/año (pro)

---

### **OPCIÓN 2: Meta Fields Personalizados (Sin plugins)**

**Ventajas:**
- ✅ Gratis (sin plugins)
- ✅ Control total del código
- ✅ Ligero

**Desventajas:**
- ❌ Interfaz menos amigable
- ❌ Requiere código PHP
- ❌ Más trabajo de implementación

**Cómo funciona:**
1. Creas campos meta personalizados en WordPress
2. Agregas interfaz en el editor de páginas
3. Guardas datos en post_meta
4. El backend los obtiene via GraphQL
5. El frontend los renderiza

---

### **OPCIÓN 3: Gutenberg Blocks Personalizados**

**Ventajas:**
- ✅ Interfaz nativa de WordPress
- ✅ Editor visual (drag & drop)
- ✅ Reutilizable

**Desventajas:**
- ❌ Más complejo de implementar
- ❌ Requiere React/JavaScript
- ❌ Puede ser confuso para usuarios

**Cómo funciona:**
1. Creas bloques personalizados en WordPress
2. Cada sección es un bloque
3. El usuario edita con el editor de bloques
4. Los datos se guardan en el contenido
5. El frontend parsea y renderiza

---

### **OPCIÓN 4: JSON en el Contenido (Estructura de datos)**

**Ventajas:**
- ✅ Sin plugins
- ✅ Flexible
- ✅ Todo en un lugar

**Desventajas:**
- ❌ No es user-friendly
- ❌ Requiere conocimiento técnico
- ❌ Difícil de validar

**Cómo funciona:**
1. Guardas estructura JSON en el contenido de la página
2. El frontend parsea el JSON
3. Renderiza según la estructura

---

### **OPCIÓN 5: Post Types Personalizados por Sección**

**Ventajas:**
- ✅ Organización clara
- ✅ Reutilizable entre páginas
- ✅ Fácil de gestionar

**Desventajas:**
- ❌ Más complejo
- ❌ Requiere más configuración
- ❌ Puede ser confuso

**Cómo funciona:**
1. Creas post types para cada tipo de sección
2. Cada sección es un post separado
3. Las páginas referencian las secciones
4. El frontend obtiene y renderiza

---

## 🏆 RECOMENDACIÓN: OPCIÓN 1 (ACF)

**Por qué:**
1. **Más fácil para el usuario final** - Interfaz visual clara
2. **Profesional** - Estándar de la industria
3. **Flexible** - Soporta todos los tipos de datos necesarios
4. **Mantenible** - Fácil de extender y modificar
5. **Integración GraphQL** - Plugin disponible

## 📝 Implementación Recomendada

### Estructura de Campos ACF por Página:

#### **Página Home (`index`)**
```
- hero_section
  - hero_subtitle (text)
  - hero_title (text)
  - hero_description (textarea)
  - hero_primary_button_text (text)
  - hero_primary_button_link (text)
  - hero_secondary_button_text (text)
  - hero_secondary_button_link (text)
  - hero_main_image (image)
  - hero_circle_image_1 (image)
  - hero_circle_image_2 (image)

- about_section
  - about_subtitle (text)
  - about_title (text)
  - about_description (textarea)
  - about_image (image)
  - about_features (repeater)
    - feature_text (text)

- dishes_section
  - dishes_subtitle (text)
  - dishes_title (text)
  - dishes_description (textarea)
  - dishes_items (repeater)
    - dish_title (text)
    - dish_description (textarea)
    - dish_image (image)
```

#### **Página About (`about`)**
```
- about_content_section
  - about_subtitle (text)
  - about_title (text)
  - about_description (textarea)
  - about_features (repeater)
    - feature_text (text)
  - about_main_image (image)
  - about_secondary_image (image)
  - experience_years (number)
  - experience_text (text)

- about_details (repeater)
  - detail_icon (image)
  - detail_title (text)
  - detail_description (textarea)

- approach_section
  - mission_title (text)
  - mission_content (wysiwyg)
  - mission_image (image)
  - vision_title (text)
  - vision_content (wysiwyg)
  - vision_image (image)
  - value_title (text)
  - value_content (wysiwyg)
  - value_image (image)
```

#### **Página Contact (`contact`)**
```
- contact_section
  - contact_subtitle (text)
  - contact_title (text)
  - contact_description (textarea)
  - contact_address (text)
  - contact_phone (text)
  - contact_email (email)

- map_section
  - map_embed_code (textarea)
  - map_latitude (text)
  - map_longitude (text)

- reserve_form
  - form_title (text)
  - form_description (textarea)
```

#### **Página Services (`services`)**
```
- services_section
  - services_subtitle (text)
  - services_title (text)
  - services_description (textarea)
  - services_items (repeater)
    - service_icon (image)
    - service_title (text)
    - service_description (textarea)
    - service_link (text)
```

## 🚀 Próximos Pasos

1. **Instalar ACF** en WordPress
2. **Instalar ACF to GraphQL** para exponer campos en GraphQL
3. **Crear grupos de campos** para cada página
4. **Modificar el servicio del backend** para incluir campos ACF
5. **Actualizar componentes Vue** para usar datos de ACF

## 💡 Alternativa Rápida (Sin ACF)

Si no quieres instalar ACF ahora, puedo crear:
- Campos meta personalizados básicos
- Interfaz simple en el editor
- Integración con GraphQL

¿Cuál opción prefieres?

