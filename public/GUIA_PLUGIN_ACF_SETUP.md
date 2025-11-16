# 🚀 Guía del Plugin Restaurant ACF Setup

## 📦 ¿Qué es este plugin?

El plugin **Restaurant ACF Setup** es una herramienta que configura automáticamente todos los campos ACF necesarios para tu proyecto. Se encarga de:

- ✅ Importar automáticamente los grupos de campos ACF
- ✅ Activar plugins necesarios (WPGraphQL for ACF)
- ✅ Verificar que todo esté configurado correctamente
- ✅ Proporcionar una interfaz visual para gestionar todo

---

## 🎯 Instalación y Activación

### Paso 1: Verificar que el Plugin Existe

El plugin ya está creado en:
```
wp-content/plugins/restaurant-acf-setup/
```

### Paso 2: Activar el Plugin

1. **Ir a WordPress Admin**
   - URL: `http://restaurant.local/wp-admin` (o tu URL local)

2. **Navegar a Plugins**
   - En el menú lateral: **Plugins > Installed Plugins**

3. **Buscar el Plugin**
   - Busca **"Restaurant ACF Setup"**

4. **Activar**
   - Haz clic en **"Activate"**

5. **¡Listo!**
   - El plugin intentará importar los campos automáticamente al activarse

---

## 📋 Uso del Plugin

### Acceder a la Página de Administración

1. **Ir al Menú de WordPress Admin**
   - Busca **"ACF Setup"** en el menú lateral
   - O ve directamente a: `http://restaurant.local/wp-admin/admin.php?page=restaurant-acf-setup`

### Verificar el Estado

La página muestra el estado actual de:

- ✅ **Advanced Custom Fields** - Debe estar activo
- ⚠️ **WPGraphQL** - Opcional pero recomendado
- ⚠️ **WPGraphQL for ACF** - Opcional pero recomendado
- ✅ **Campos ACF Importados** - Debe mostrar 5 grupos

### Importar Campos ACF

Si los campos no están importados:

1. Haz clic en el botón **"Importar Campos ACF"**
2. Espera a que termine la importación
3. Verás un mensaje de éxito o error
4. La página se actualizará automáticamente

### Activar WPGraphQL for ACF

Si el plugin está instalado pero no activo:

1. Haz clic en el botón **"Activar WPGraphQL for ACF"**
2. El plugin se activará automáticamente
3. La página se recargará para mostrar el nuevo estado

### Verificar Estado

Para actualizar el estado manualmente:

1. Haz clic en **"Verificar Estado"**
2. El estado se actualizará y la página se recargará

---

## ✅ Verificación Post-Instalación

### 1. Verificar que los Campos Estén Importados

1. Ve a **Custom Fields > Field Groups** en WordPress Admin
2. Deberías ver estos 5 grupos:
   - Home Page Sections
   - About Page Sections
   - Contact Page Sections
   - Services Page Sections
   - Menu Page Sections

### 2. Verificar que los Campos Aparezcan en las Páginas

1. Ve a **Pages > All Pages**
2. Edita la página **"About Us"**
3. Deberías ver el meta box **"About Page Sections"** con todos los campos
4. Repite para otras páginas (Home, Services, Contact, Menu)

### 3. Verificar GraphQL (Opcional)

1. Ve a `http://restaurant.local/graphql` (GraphiQL IDE)
2. Ejecuta esta query:
```graphql
{
  page(id: "about", idType: SLUG) {
    title
    aboutPageSections {
      aboutContentTitle
      aboutFeatures {
        featureText
      }
    }
  }
}
```
3. Deberías ver los campos en la respuesta

---

## 🔧 Funcionalidades del Plugin

### Importación Automática

Al activar el plugin, automáticamente:
- ✅ Importa los 5 grupos de campos ACF
- ✅ Actualiza grupos existentes si ya están importados
- ✅ Muestra mensajes de éxito/error

### Activación Automática de Plugins

El plugin intenta activar automáticamente:
- ✅ WPGraphQL for ACF (si está instalado)

### Verificación de Dependencias

El plugin verifica:
- ✅ Que ACF esté activo (requerido)
- ✅ Que WPGraphQL esté activo (opcional)
- ✅ Que WPGraphQL for ACF esté activo (opcional)
- ✅ Cuántos grupos de campos están importados

### Interfaz Visual

La página de administración muestra:
- 📊 Estado visual de cada componente (✓, ⚠, ✗)
- 🎨 Colores para indicar estado (verde, amarillo, rojo)
- 🔘 Botones para acciones rápidas
- 📝 Mensajes de éxito/error claros

---

## 🐛 Solución de Problemas

### Problema: El plugin no aparece en la lista de plugins

**Solución:**
1. Verifica que el plugin esté en `wp-content/plugins/restaurant-acf-setup/`
2. Verifica que el archivo `restaurant-acf-setup.php` exista
3. Recarga la página de plugins (F5)

### Problema: Error al activar - "ACF no está activo"

**Solución:**
1. Instala y activa **Advanced Custom Fields** primero
2. Luego intenta activar Restaurant ACF Setup nuevamente

### Problema: Los campos no se importan

**Solución:**
1. Verifica que el archivo `acf-export.json` exista en el plugin
2. Verifica los permisos del archivo
3. Intenta importar manualmente desde la página de administración
4. Revisa los mensajes de error en la página

### Problema: WPGraphQL for ACF no se activa

**Solución:**
1. Verifica que el plugin esté instalado
2. Actívalo manualmente desde Plugins
3. Verifica que WPGraphQL esté activo primero

### Problema: Los campos no aparecen en las páginas

**Solución:**
1. Verifica que los grupos de campos estén importados
2. Verifica las "Location Rules" de cada grupo
3. Guarda las páginas nuevamente
4. Limpia la caché si usas algún plugin de caché

---

## 📝 Notas Importantes

- El plugin **no elimina** campos existentes, solo los actualiza
- Si ya tienes campos importados, el plugin los actualizará
- El plugin busca el archivo JSON en dos ubicaciones:
  1. `restaurant-acf-setup/acf-export.json` (prioridad)
  2. `restaurant-theme-config/acf-export.json` (fallback)

---

## 🎉 ¡Listo!

Una vez que el plugin esté activo y los campos importados, tendrás:

- ✅ Todos los campos ACF configurados
- ✅ Campos disponibles en WordPress Admin
- ✅ Campos disponibles en GraphQL (si WPGraphQL for ACF está activo)
- ✅ Backend listo para obtener los datos
- ✅ Frontend listo para mostrar los datos

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la sección de "Solución de Problemas" arriba
2. Verifica los mensajes de error en la página de administración
3. Revisa los logs de WordPress (`wp-content/debug.log`)

---

## 🔄 Actualizaciones Futuras

El plugin puede ser actualizado para:
- Agregar más grupos de campos
- Mejorar la interfaz de administración
- Agregar más verificaciones
- Mejorar los mensajes de error

Para actualizar, simplemente reemplaza los archivos del plugin y reactívalo.

