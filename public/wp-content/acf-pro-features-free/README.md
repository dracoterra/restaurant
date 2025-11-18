# ACF Pro Features Free

Plugin de WordPress que recrea las funcionalidades de ACF PRO (Advanced Custom Fields PRO) de forma gratuita y segura. Compatible con ACF gratuito y GraphQL.

## 🎯 Características

- ✅ **Campo Repeater**: Crea campos repetibles con sub-campos
- ✅ **Campo Flexible Content**: Crea layouts flexibles con diferentes secciones
- ✅ **Campo Clone**: Clona campos o grupos de campos existentes
- ✅ **Integración GraphQL**: Compatible con WPGraphQL y WPGraphQL for ACF
- ✅ **100% Seguro**: Sin código malicioso, código abierto y revisable
- ✅ **Compatible con ACF Gratuito**: Funciona perfectamente con la versión gratuita de ACF

## 📋 Requisitos

- WordPress 5.0 o superior
- PHP 7.4 o superior
- Advanced Custom Fields (ACF) - Versión gratuita
- WPGraphQL (opcional, para integración GraphQL)
- WPGraphQL for ACF (opcional, para exponer campos en GraphQL)

## 🚀 Instalación

1. Descarga o clona este plugin en la carpeta `wp-content/plugins/`
2. Renombra la carpeta a `acf-pro-features-free`
3. Activa el plugin desde el panel de administración de WordPress
4. Asegúrate de que Advanced Custom Fields esté activo

## 📖 Uso

### Campo Repeater

El campo Repeater te permite crear listas repetibles de campos. Para usarlo:

1. Ve a **Custom Fields > Field Groups** en WordPress
2. Crea o edita un grupo de campos
3. Agrega un nuevo campo de tipo **Repeater**
4. Configura los sub-campos que quieres repetir
5. Guarda el grupo de campos

**Ejemplo de código:**

```php
// Obtener valor del repeater
$features = get_field('about_features');

if ($features) {
    foreach ($features as $feature) {
        echo $feature['feature_text'];
    }
}
```

### Campo Flexible Content

El campo Flexible Content te permite crear layouts modulares:

1. Crea un campo de tipo **Flexible Content**
2. Define los diferentes layouts disponibles
3. Cada layout puede tener sus propios sub-campos
4. Los usuarios pueden elegir qué layouts usar y en qué orden

**Ejemplo de código:**

```php
// Obtener layouts
$layouts = get_field('page_sections');

if ($layouts) {
    foreach ($layouts as $layout) {
        if ($layout['acf_fc_layout'] === 'hero_section') {
            // Renderizar sección hero
        } elseif ($layout['acf_fc_layout'] === 'content_section') {
            // Renderizar sección de contenido
        }
    }
}
```

### Campo Clone

El campo Clone te permite reutilizar campos o grupos de campos:

1. Crea un campo de tipo **Clone**
2. Selecciona qué campos o grupos quieres clonar
3. Los campos se expandirán automáticamente

## 🔌 Integración con GraphQL

Si tienes WPGraphQL y WPGraphQL for ACF instalados, todos los campos se expondrán automáticamente en GraphQL.

**Ejemplo de query GraphQL:**

```graphql
{
  page(id: "about", idType: SLUG) {
    title
    acfFields {
      ... on Page_AcfFields {
        aboutFeatures {
          featureText
        }
        aboutDetails {
          icon {
            url
            alt
          }
          title
          description
        }
      }
    }
  }
}
```

## 🛠️ Desarrollo

### Estructura del Plugin

```
acf-pro-features-free/
├── acf-pro-features-free.php    # Archivo principal
├── includes/
│   ├── class-repeater-field.php
│   ├── class-flexible-content-field.php
│   ├── class-clone-field.php
│   ├── class-graphql-integration.php
│   ├── class-admin-page.php
│   └── functions.php
├── assets/
│   ├── css/
│   │   └── admin.css
│   └── js/
│       └── admin.js
└── README.md
```

### Funciones Auxiliares

El plugin incluye funciones auxiliares para trabajar con los campos:

- `acf_pro_features_get_repeater_field($field_name, $post_id)` - Obtener valor de repeater
- `acf_pro_features_get_flexible_content_field($field_name, $post_id)` - Obtener valor de flexible content
- `acf_pro_features_get_field($field_name, $post_id)` - Obtener campo (compatible con PRO y Free)
- `acf_pro_features_is_pro_active()` - Verificar si ACF PRO está activo

## ⚙️ Configuración

Puedes acceder a la página de configuración del plugin en:

**Custom Fields > Pro Features Free**

Aquí podrás ver:
- Estado de los plugins relacionados
- Funcionalidades disponibles
- Información del plugin

## 🔒 Seguridad

Este plugin es 100% seguro:
- ✅ Sin código malicioso
- ✅ Código abierto y revisable
- ✅ Sin dependencias externas sospechosas
- ✅ Compatible con las mejores prácticas de WordPress

## 📝 Notas

- Este plugin **reemplaza** las funcionalidades de ACF PRO, no requiere una licencia
- Si ACF PRO está activo, este plugin no interferirá (ACF PRO tendrá prioridad)
- Todos los datos se guardan en el formato estándar de WordPress (meta fields)
- Compatible con la importación/exportación de campos ACF

## 🐛 Solución de Problemas

### Los campos no aparecen

1. Verifica que ACF esté activo
2. Verifica que el grupo de campos esté asignado a la ubicación correcta
3. Recarga la página de edición

### Los datos no se guardan

1. Verifica los permisos del usuario
2. Revisa los logs de WordPress
3. Asegúrate de que el plugin esté activo

### Problemas con GraphQL

1. Verifica que WPGraphQL esté activo
2. Verifica que WPGraphQL for ACF esté activo
3. Limpia la caché de GraphQL si es necesario

## 📄 Licencia

Este plugin está licenciado bajo GPL v2 o posterior.

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el repositorio
2. Crea una rama para tu feature
3. Realiza tus cambios
4. Envía un pull request

## 📞 Soporte

Para soporte, por favor abre un issue en el repositorio del plugin.

## 🙏 Agradecimientos

Este plugin está inspirado en Advanced Custom Fields PRO, pero es una implementación independiente y gratuita.

---

**Versión:** 1.0.0  
**Autor:** Restaurant Team  
**Última actualización:** 2025

