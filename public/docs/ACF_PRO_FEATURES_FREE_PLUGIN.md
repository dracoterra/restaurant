# ACF Pro Features Free - Documentación Completa

## 📋 Índice

1. [Introducción](#introducción)
2. [Características](#características)
3. [Instalación y Activación](#instalación-y-activación)
4. [Funcionalidades Detalladas](#funcionalidades-detalladas)
   - [Repeater Field](#1-repeater-field)
   - [Flexible Content Field](#2-flexible-content-field)
   - [Clone Field](#3-clone-field)
   - [Gallery Field](#4-gallery-field)
   - [Options Pages](#5-options-pages)
5. [Uso y Ejemplos](#uso-y-ejemplos)
6. [Integración con GraphQL](#integración-con-graphql)
7. [API y Funciones](#api-y-funciones)
8. [Seguridad](#seguridad)
9. [Troubleshooting](#troubleshooting)
10. [Changelog](#changelog)

---

## Introducción

**ACF Pro Features Free** es un plugin de WordPress que proporciona todas las funcionalidades premium de Advanced Custom Fields (ACF PRO) de forma gratuita. Este plugin extiende ACF Free para incluir campos avanzados y funcionalidades que normalmente requieren una licencia PRO.

### ¿Qué hace este plugin?

Este plugin implementa las siguientes funcionalidades de ACF PRO:

- ✅ **Repeater Field**: Campos repetibles para crear listas dinámicas
- ✅ **Flexible Content Field**: Contenido flexible con layouts personalizables
- ✅ **Clone Field**: Clonar campos y grupos de campos existentes
- ✅ **Gallery Field**: Gestión avanzada de galerías de imágenes
- ✅ **Options Pages**: Páginas de opciones globales en el admin

### Compatibilidad

- **WordPress**: 5.0+
- **ACF**: 6.0+
- **PHP**: 7.4+
- **WPGraphQL**: Compatible (con WPGraphQL for ACF)

---

## Características

### ✨ Funcionalidades Principales

1. **100% Compatible con ACF**: Usa la misma API que ACF PRO
2. **Integración con GraphQL**: Todos los campos están disponibles en WPGraphQL
3. **Interfaz de Admin**: Interfaz nativa de ACF para todos los campos
4. **Validaciones Avanzadas**: Validaciones completas para todos los campos
5. **Sanitización de Datos**: Todas las entradas están sanitizadas y validadas
6. **Sin Dependencias Externas**: Funciona solo con ACF Free

### 🔒 Seguridad

- ✅ Sanitización de todas las entradas
- ✅ Validación de nonces en AJAX
- ✅ Verificación de permisos de usuario
- ✅ Protección contra XSS
- ✅ Validación de tipos de datos

---

## Instalación y Activación

### Requisitos Previos

1. WordPress 5.0 o superior
2. Advanced Custom Fields (ACF) instalado y activo
3. PHP 7.4 o superior

### Pasos de Instalación

1. Copiar el plugin a `wp-content/plugins/acf-pro-features-free/`
2. Activar el plugin desde el panel de administración de WordPress
3. Verificar que ACF esté activo
4. El plugin se activará automáticamente

### Verificación de Instalación

Después de activar el plugin, puedes verificar su estado:

1. Ir a **ACF > Pro Features Free** en el menú de WordPress
2. Verificar que todas las funcionalidades estén marcadas como "Activas"

---

## Funcionalidades Detalladas

### 1. Repeater Field

El campo Repeater permite crear listas repetibles de campos.

#### Características

- ✅ Campos repetibles ilimitados
- ✅ Sub-campos de cualquier tipo
- ✅ Ordenamiento por drag & drop
- ✅ Límites mínimo y máximo de filas
- ✅ Layouts personalizables
- ✅ Integración completa con GraphQL

#### Uso Básico

```php
// Registrar un campo Repeater
acf_add_local_field_group(array(
    'key' => 'group_repeater_example',
    'title' => 'Ejemplo Repeater',
    'fields' => array(
        array(
            'key' => 'field_items',
            'label' => 'Items',
            'name' => 'items',
            'type' => 'repeater',
            'instructions' => 'Agrega items a la lista',
            'required' => 0,
            'min' => 1,
            'max' => 10,
            'layout' => 'table', // 'table', 'block', 'row'
            'sub_fields' => array(
                array(
                    'key' => 'field_item_title',
                    'label' => 'Título',
                    'name' => 'title',
                    'type' => 'text',
                    'required' => 1,
                ),
                array(
                    'key' => 'field_item_description',
                    'label' => 'Descripción',
                    'name' => 'description',
                    'type' => 'textarea',
                ),
            ),
        ),
    ),
    'location' => array(
        array(
            array(
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'post',
            ),
        ),
    ),
));
```

#### Obtener Valores

```php
// Obtener valores del repeater
$items = get_field('items');

if ($items) {
    foreach ($items as $item) {
        echo $item['title'];
        echo $item['description'];
    }
}
```

#### GraphQL Query

```graphql
query {
  post(id: "1") {
    items {
      title
      description
    }
  }
}
```

---

### 2. Flexible Content Field

El campo Flexible Content permite crear layouts dinámicos y reutilizables.

#### Características

- ✅ Múltiples layouts personalizables
- ✅ Campos específicos por layout
- ✅ Ordenamiento por drag & drop
- ✅ Límites mínimo y máximo de layouts
- ✅ Integración completa con GraphQL

#### Uso Básico

```php
// Registrar un campo Flexible Content
acf_add_local_field_group(array(
    'key' => 'group_flexible_example',
    'title' => 'Ejemplo Flexible Content',
    'fields' => array(
        array(
            'key' => 'field_content_blocks',
            'label' => 'Bloques de Contenido',
            'name' => 'content_blocks',
            'type' => 'flexible_content',
            'instructions' => 'Agrega bloques de contenido',
            'required' => 0,
            'min' => 1,
            'max' => 0, // 0 = ilimitado
            'layouts' => array(
                'layout_text' => array(
                    'key' => 'layout_text',
                    'name' => 'text_block',
                    'label' => 'Bloque de Texto',
                    'display' => 'block',
                    'sub_fields' => array(
                        array(
                            'key' => 'field_text_content',
                            'label' => 'Contenido',
                            'name' => 'content',
                            'type' => 'wysiwyg',
                        ),
                    ),
                ),
                'layout_image' => array(
                    'key' => 'layout_image',
                    'name' => 'image_block',
                    'label' => 'Bloque de Imagen',
                    'display' => 'block',
                    'sub_fields' => array(
                        array(
                            'key' => 'field_image',
                            'label' => 'Imagen',
                            'name' => 'image',
                            'type' => 'image',
                        ),
                        array(
                            'key' => 'field_image_caption',
                            'label' => 'Caption',
                            'name' => 'caption',
                            'type' => 'text',
                        ),
                    ),
                ),
            ),
        ),
    ),
    'location' => array(
        array(
            array(
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'page',
            ),
        ),
    ),
));
```

#### Obtener Valores

```php
// Obtener bloques de contenido flexible
$blocks = get_field('content_blocks');

if ($blocks) {
    foreach ($blocks as $block) {
        if ($block['acf_fc_layout'] == 'text_block') {
            echo $block['content'];
        } elseif ($block['acf_fc_layout'] == 'image_block') {
            echo '<img src="' . $block['image']['url'] . '" alt="' . $block['image']['alt'] . '">';
            echo '<p>' . $block['caption'] . '</p>';
        }
    }
}
```

#### GraphQL Query

```graphql
query {
  page(id: "1") {
    contentBlocks {
      ... on TextBlock {
        content
      }
      ... on ImageBlock {
        image {
          url
          alt
        }
        caption
      }
    }
  }
}
```

---

### 3. Clone Field

El campo Clone permite clonar campos y grupos de campos existentes.

#### Características

- ✅ Clonar campos individuales
- ✅ Clonar grupos completos de campos
- ✅ Múltiples modos de visualización
- ✅ Prefijos opcionales para nombres de campos
- ✅ Integración completa con GraphQL

#### Uso Básico

```php
// Registrar un campo Clone
acf_add_local_field_group(array(
    'key' => 'group_clone_example',
    'title' => 'Ejemplo Clone',
    'fields' => array(
        array(
            'key' => 'field_cloned_fields',
            'label' => 'Campos Clonados',
            'name' => 'cloned_fields',
            'type' => 'clone',
            'instructions' => 'Campos clonados de otro grupo',
            'display' => 'seamless', // 'seamless', 'group'
            'prefix_label' => 0,
            'prefix_name' => 0,
            'clone' => array(
                'group_5f8a1b2c3d4e5', // Key del grupo a clonar
            ),
        ),
    ),
    'location' => array(
        array(
            array(
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'post',
            ),
        ),
    ),
));
```

#### Modos de Visualización

- **Seamless**: Los campos se muestran sin contenedor adicional
- **Group**: Los campos se agrupan en un contenedor

#### Obtener Valores

```php
// Los valores se obtienen normalmente como si fueran campos originales
$value = get_field('field_name_from_cloned_group');
```

---

### 4. Gallery Field

El campo Gallery permite gestionar colecciones de imágenes de manera intuitiva.

#### Características

- ✅ Gestión visual de imágenes
- ✅ Ordenamiento por drag & drop
- ✅ Edición de metadatos (título, caption, alt, descripción)
- ✅ Validaciones avanzadas:
  - Mínimo/máximo de imágenes
  - Dimensiones mínimas/máximas (ancho/alto)
  - Tamaño de archivo mínimo/máximo
  - Tipos MIME permitidos
- ✅ Integración con WordPress Media Library
- ✅ Integración completa con GraphQL

#### Uso Básico

```php
// Registrar un campo Gallery
acf_add_local_field_group(array(
    'key' => 'group_gallery_example',
    'title' => 'Ejemplo Gallery',
    'fields' => array(
        array(
            'key' => 'field_gallery',
            'label' => 'Galería',
            'name' => 'gallery',
            'type' => 'gallery',
            'instructions' => 'Selecciona imágenes para la galería',
            'required' => 0,
            'return_format' => 'array', // 'array', 'id'
            'preview_size' => 'medium',
            'insert' => 'append', // 'append', 'prepend'
            'library' => 'all', // 'all', 'uploadedTo'
            'min' => 1,
            'max' => 10,
            'min_width' => 800,
            'min_height' => 600,
            'min_size' => 0.5, // MB
            'max_width' => 2000,
            'max_height' => 2000,
            'max_size' => 5, // MB
            'mime_types' => 'jpg,jpeg,png,webp',
        ),
    ),
    'location' => array(
        array(
            array(
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'post',
            ),
        ),
    ),
));
```

#### Validaciones Disponibles

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `min` | integer | Número mínimo de imágenes |
| `max` | integer | Número máximo de imágenes |
| `min_width` | integer | Ancho mínimo en píxeles |
| `min_height` | integer | Alto mínimo en píxeles |
| `max_width` | integer | Ancho máximo en píxeles |
| `max_height` | integer | Alto máximo en píxeles |
| `min_size` | float | Tamaño mínimo en MB |
| `max_size` | float | Tamaño máximo en MB |
| `mime_types` | string | Tipos MIME permitidos (separados por coma) |

#### Obtener Valores

```php
// Obtener galería
$gallery = get_field('gallery');

if ($gallery) {
    foreach ($gallery as $image) {
        // Si return_format es 'array'
        echo '<img src="' . $image['url'] . '" alt="' . $image['alt'] . '">';
        echo '<p>' . $image['caption'] . '</p>';
        
        // O si return_format es 'id'
        // $image_url = wp_get_attachment_image_url($image, 'full');
        // echo '<img src="' . $image_url . '">';
    }
}
```

#### GraphQL Query

```graphql
query {
  post(id: "1") {
    gallery {
      id
      url
      width
      height
      alt
      title
      caption
      description
    }
  }
}
```

---

### 5. Options Pages

Las Options Pages permiten crear páginas de administración personalizadas para gestionar opciones globales.

#### Características

- ✅ Páginas de opciones principales
- ✅ Sub-páginas de opciones
- ✅ Integración con grupos de campos ACF
- ✅ Interfaz nativa de ACF
- ✅ Acceso global desde cualquier lugar
- ✅ Integración completa con GraphQL

#### Uso Básico

```php
// Crear una página de opciones principal
if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
        'page_title' => 'Configuración General',
        'menu_title' => 'Configuración',
        'menu_slug' => 'general-settings',
        'capability' => 'edit_posts',
        'icon_url' => 'dashicons-admin-generic',
        'position' => 30,
    ));
}

// Crear una sub-página de opciones
if (function_exists('acf_add_options_sub_page')) {
    acf_add_options_sub_page(array(
        'page_title' => 'Configuración de Redes Sociales',
        'menu_title' => 'Redes Sociales',
        'parent_slug' => 'general-settings',
    ));
}
```

#### Asignar Grupos de Campos a Options Pages

```php
// Asignar un grupo de campos a una Options Page
acf_add_local_field_group(array(
    'key' => 'group_options_social',
    'title' => 'Redes Sociales',
    'fields' => array(
        array(
            'key' => 'field_facebook_url',
            'label' => 'Facebook URL',
            'name' => 'facebook_url',
            'type' => 'url',
        ),
        array(
            'key' => 'field_twitter_url',
            'label' => 'Twitter URL',
            'name' => 'twitter_url',
            'type' => 'url',
        ),
    ),
    'location' => array(
        array(
            array(
                'param' => 'options_page',
                'operator' => '==',
                'value' => 'general-settings',
            ),
        ),
    ),
));
```

#### Obtener Valores de Options

```php
// Obtener valores de opciones
$facebook_url = get_field('facebook_url', 'option');
$twitter_url = get_field('twitter_url', 'option');

// O usando get_option directamente
$facebook_url = get_option('options_facebook_url');
```

#### Interfaz de Administración

El plugin intercepta la página "Options Pages" de ACF y muestra una interfaz personalizada donde puedes:

1. Ver todas las Options Pages registradas
2. Crear nuevas Options Pages con el botón "+ Add Options Page"
3. Editar páginas existentes
4. Gestionar sub-páginas

#### GraphQL Query

```graphql
query {
  generalSettings {
    facebookUrl
    twitterUrl
  }
}
```

---

## Uso y Ejemplos

### Ejemplo Completo: Página con Múltiples Campos PRO

```php
// functions.php o plugin personalizado

// 1. Crear Options Page
if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
        'page_title' => 'Configuración del Sitio',
        'menu_title' => 'Configuración',
        'menu_slug' => 'site-settings',
    ));
}

// 2. Grupo de campos para página
acf_add_local_field_group(array(
    'key' => 'group_page_content',
    'title' => 'Contenido de Página',
    'fields' => array(
        // Flexible Content
        array(
            'key' => 'field_page_sections',
            'label' => 'Secciones',
            'name' => 'sections',
            'type' => 'flexible_content',
            'layouts' => array(
                'layout_hero' => array(
                    'key' => 'layout_hero',
                    'name' => 'hero',
                    'label' => 'Hero',
                    'sub_fields' => array(
                        array(
                            'key' => 'field_hero_title',
                            'label' => 'Título',
                            'name' => 'title',
                            'type' => 'text',
                        ),
                        array(
                            'key' => 'field_hero_gallery',
                            'label' => 'Galería',
                            'name' => 'gallery',
                            'type' => 'gallery',
                            'min' => 1,
                            'max' => 5,
                        ),
                    ),
                ),
                'layout_testimonials' => array(
                    'key' => 'layout_testimonials',
                    'name' => 'testimonials',
                    'label' => 'Testimonios',
                    'sub_fields' => array(
                        array(
                            'key' => 'field_testimonials',
                            'label' => 'Testimonios',
                            'name' => 'testimonials',
                            'type' => 'repeater',
                            'sub_fields' => array(
                                array(
                                    'key' => 'field_testimonial_text',
                                    'label' => 'Texto',
                                    'name' => 'text',
                                    'type' => 'textarea',
                                ),
                                array(
                                    'key' => 'field_testimonial_author',
                                    'label' => 'Autor',
                                    'name' => 'author',
                                    'type' => 'text',
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    ),
    'location' => array(
        array(
            array(
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'page',
            ),
        ),
    ),
));
```

### Renderizado en Template

```php
// page.php o template personalizado

$sections = get_field('sections');

if ($sections) {
    foreach ($sections as $section) {
        if ($section['acf_fc_layout'] == 'hero') {
            ?>
            <section class="hero">
                <h1><?php echo esc_html($section['title']); ?></h1>
                <?php if ($section['gallery']): ?>
                    <div class="hero-gallery">
                        <?php foreach ($section['gallery'] as $image): ?>
                            <img src="<?php echo esc_url($image['url']); ?>" alt="<?php echo esc_attr($image['alt']); ?>">
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </section>
            <?php
        } elseif ($section['acf_fc_layout'] == 'testimonials') {
            ?>
            <section class="testimonials">
                <?php if ($section['testimonials']): ?>
                    <?php foreach ($section['testimonials'] as $testimonial): ?>
                        <div class="testimonial">
                            <p><?php echo esc_html($testimonial['text']); ?></p>
                            <cite><?php echo esc_html($testimonial['author']); ?></cite>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </section>
            <?php
        }
    }
}
```

---

## Integración con GraphQL

El plugin incluye integración completa con WPGraphQL y WPGraphQL for ACF.

### Configuración

1. Instalar y activar WPGraphQL
2. Instalar y activar WPGraphQL for ACF
3. Los campos PRO estarán disponibles automáticamente en GraphQL

### Ejemplo de Query Completo

```graphql
query GetPageContent($id: ID!) {
  page(id: $id) {
    title
    sections {
      ... on Hero {
        title
        gallery {
          id
          url
          alt
          caption
        }
      }
      ... on Testimonials {
        testimonials {
          text
          author
        }
      }
    }
  }
  
  generalSettings {
    facebookUrl
    twitterUrl
  }
}
```

### Formato de Datos en GraphQL

#### Repeater Field
```graphql
items {
  title
  description
}
```

#### Flexible Content Field
```graphql
contentBlocks {
  ... on TextBlock {
    content
  }
  ... on ImageBlock {
    image {
      url
      alt
    }
    caption
  }
}
```

#### Gallery Field
```graphql
gallery {
  id
  url
  width
  height
  alt
  title
  caption
  description
}
```

#### Options Pages
```graphql
generalSettings {
  fieldName
}
```

---

## API y Funciones

### Funciones Helper

#### `acf_add_options_page($args)`

Crea una página de opciones principal.

**Parámetros:**
- `page_title` (string): Título de la página
- `menu_title` (string): Título en el menú
- `menu_slug` (string): Slug único para la página
- `capability` (string): Capacidad requerida (default: 'edit_posts')
- `icon_url` (string): URL del icono
- `position` (int): Posición en el menú

**Ejemplo:**
```php
acf_add_options_page(array(
    'page_title' => 'Configuración',
    'menu_title' => 'Configuración',
    'menu_slug' => 'settings',
));
```

#### `acf_add_options_sub_page($args)`

Crea una sub-página de opciones.

**Parámetros:**
- `page_title` (string): Título de la página
- `menu_title` (string): Título en el menú
- `parent_slug` (string): Slug de la página padre
- `menu_slug` (string): Slug único (opcional, se genera automáticamente)

**Ejemplo:**
```php
acf_add_options_sub_page(array(
    'page_title' => 'Redes Sociales',
    'menu_title' => 'Redes Sociales',
    'parent_slug' => 'settings',
));
```

#### `acf_get_options_pages()`

Obtiene todas las Options Pages registradas.

**Retorna:** Array de páginas de opciones

**Ejemplo:**
```php
$pages = acf_get_options_pages();
foreach ($pages as $page) {
    echo $page['page_title'];
}
```

---

## Seguridad

### Sanitización Implementada

El plugin implementa sanitización completa en todos los puntos de entrada:

1. **AJAX Requests**: 
   - Validación de nonces
   - Sanitización de parámetros
   - Verificación de permisos

2. **Formularios**:
   - Sanitización de todos los campos
   - Validación de tipos de datos
   - Escapado de salidas

3. **Validaciones**:
   - Validación de tipos MIME
   - Validación de dimensiones
   - Validación de tamaños de archivo
   - Validación de límites numéricos

### Funciones de Sanitización Utilizadas

- `sanitize_text_field()`: Texto simple
- `sanitize_textarea_field()`: Textareas
- `sanitize_email()`: Emails
- `sanitize_url()`: URLs
- `sanitize_key()`: Keys y slugs
- `absint()`: Enteros positivos
- `esc_html()`: HTML
- `esc_attr()`: Atributos HTML
- `esc_url()`: URLs
- `wp_kses_post()`: Contenido HTML permitido

---

## Troubleshooting

### Problemas Comunes

#### 1. Los campos no aparecen en el editor

**Solución:**
- Verificar que el grupo de campos esté asignado correctamente a la ubicación
- Verificar que el post type/page template coincida
- Limpiar caché si usas plugins de caché

#### 2. Los valores no se guardan

**Solución:**
- Verificar permisos de usuario
- Verificar que el campo tenga un `key` único
- Verificar que el `name` del campo sea válido

#### 3. Gallery Field no muestra imágenes

**Solución:**
- Verificar que las imágenes cumplan con las validaciones (dimensiones, tamaño, tipo)
- Verificar permisos de la carpeta de uploads
- Verificar que WordPress Media Library funcione correctamente

#### 4. Options Pages no aparecen en el menú

**Solución:**
- Verificar que `acf_add_options_page()` se llame en el hook correcto
- Verificar que el plugin esté activo
- Verificar permisos de usuario

#### 5. GraphQL no muestra los campos

**Solución:**
- Verificar que WPGraphQL y WPGraphQL for ACF estén activos
- Verificar que los campos estén configurados para GraphQL
- Limpiar caché de GraphQL

### Debug Mode

Para activar el modo debug, agregar en `wp-config.php`:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

Los logs se guardarán en `wp-content/debug.log`.

---

## Changelog

### Versión 1.0.0 (2024)

#### Funcionalidades Iniciales
- ✅ Repeater Field implementado
- ✅ Flexible Content Field implementado
- ✅ Clone Field implementado
- ✅ Gallery Field implementado con validaciones avanzadas
- ✅ Options Pages implementado con interfaz de administración
- ✅ Integración completa con GraphQL
- ✅ Sanitización y validación de datos
- ✅ Interfaz de administración personalizada

#### Mejoras de Seguridad
- ✅ Sanitización de todas las entradas
- ✅ Validación de nonces en AJAX
- ✅ Verificación de permisos
- ✅ Protección contra XSS

#### Integración
- ✅ Compatibilidad total con ACF Free
- ✅ Interfaz nativa de ACF
- ✅ API compatible con ACF PRO

---

## Soporte y Contribuciones

### Reportar Problemas

Si encuentras algún problema o tienes sugerencias:

1. Verificar que el problema no esté documentado en Troubleshooting
2. Activar modo debug y revisar logs
3. Documentar el problema con:
   - Versión de WordPress
   - Versión de ACF
   - Versión de PHP
   - Pasos para reproducir
   - Mensajes de error

### Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Seguir las convenciones de código de WordPress
2. Incluir documentación para nuevas funcionalidades
3. Agregar tests cuando sea posible
4. Mantener compatibilidad con versiones anteriores

---

## Licencia

Este plugin está licenciado bajo GPL v2 o posterior, compatible con la licencia de WordPress.

---

## Créditos

Desarrollado para proporcionar funcionalidades de ACF PRO de forma gratuita, manteniendo compatibilidad total con la API de ACF.

---

**Última actualización:** 2024
**Versión del documento:** 1.0.0

