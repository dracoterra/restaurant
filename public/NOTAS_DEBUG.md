# Notas sobre Debug.log

## Warnings y Notices en debug.log

### ✅ Corregido

1. **PHP Warning: Constant REST_REQUEST already defined**
   - **Causa**: Se estaba definiendo `REST_REQUEST` en `wp-config.php` pero WordPress ya lo define automáticamente.
   - **Solución**: Agregada verificación `if (!defined())` antes de definir la constante.
   - **Estado**: ✅ Corregido

### ⚠️ Avisos de Plugins (No críticos)

2. **PHP Notice: Function wp_send_json was called incorrectly**
   - **Causa**: Algunos plugins (probablemente WPGraphQL o WooCommerce) están usando `wp_send_json()` en callbacks de REST API en lugar de retornar `WP_REST_Response`.
   - **Impacto**: No afecta la funcionalidad, solo es un aviso de buenas prácticas.
   - **Solución**: Esto es un problema de los plugins, no de nuestro código. Se puede ignorar en desarrollo.
   - **Estado**: ⚠️ Aviso no crítico

3. **PHP Notice: Function _load_textdomain_just_in_time was called incorrectly**
   - **Causa**: WooCommerce está cargando traducciones muy temprano (antes del hook `init`).
   - **Impacto**: No afecta la funcionalidad, solo es un aviso de timing.
   - **Solución**: Esto es un problema de WooCommerce, no de nuestro código. Se puede ignorar.
   - **Estado**: ⚠️ Aviso no crítico

## Recomendaciones

### Para Desarrollo
- Estos avisos son normales en desarrollo y no afectan la funcionalidad.
- Se pueden ignorar mientras se desarrolla.

### Para Producción
- En producción, se recomienda desactivar `WP_DEBUG` o al menos `WP_DEBUG_LOG`.
- Los avisos de plugins no se pueden corregir desde nuestro código.

## Configuración Actual

```php
// wp-config.php
define( 'WP_DEBUG', true );           // Activo en desarrollo
define( 'WP_DEBUG_LOG', true );       // Logs en debug.log
define( 'WP_DEBUG_DISPLAY', false );  // No mostrar en pantalla
```

## Limpiar debug.log

Si el archivo crece mucho, puedes limpiarlo:

```bash
# En PowerShell
Clear-Content wp-content/debug.log
```

O simplemente eliminarlo y WordPress lo recreará automáticamente.
