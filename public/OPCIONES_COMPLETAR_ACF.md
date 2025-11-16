# 🔧 Opciones para Completar ACF (Advanced Custom Fields)

## 📊 Estado Actual

### ✅ Lo que ya está configurado:
- Plugin ACF instalado y activo
- Plugin `restaurant-theme-config` crea campos programáticamente
- Archivo `acf-export.json` con algunos grupos de campos
- Backend configurado para obtener campos ACF vía GraphQL
- Frontend preparado para usar datos ACF

### ❌ Lo que está incompleto:
1. **Campos faltantes en el JSON**: El archivo `acf-export.json` no incluye todos los campos que están en el código PHP:
   - `about_features` (repeater) - ❌ Falta en JSON
   - `about_details` (repeater) - ❌ Falta en JSON  
   - `services_items` (repeater) - ❌ Falta en JSON

2. **Plugin ACF to GraphQL**: Puede no estar activado

3. **Campos no importados**: Los grupos de campos pueden no estar importados en WordPress

4. **Datos no guardados**: Las páginas pueden no tener los campos ACF guardados con datos

---

## 🎯 OPCIONES PARA COMPLETAR ACF

### **OPCIÓN 1: Actualizar y Re-importar el JSON (RECOMENDADA)** ⭐

**Ventajas:**
- ✅ Mantiene consistencia entre código y configuración
- ✅ Fácil de versionar y compartir
- ✅ Incluye todos los campos necesarios

**Pasos:**
1. Actualizar `acf-export.json` con los campos faltantes
2. Importar el JSON actualizado en WordPress
3. Verificar que todos los campos aparezcan

**Tiempo estimado:** 15-20 minutos

---

### **OPCIÓN 2: Usar Solo Campos Programáticos (PHP)**

**Ventajas:**
- ✅ Ya está implementado en `create-acf-fields.php`
- ✅ Se crea automáticamente cuando el plugin está activo
- ✅ No requiere importación manual

**Desventajas:**
- ⚠️ Los campos pueden no aparecer en GraphQL si ACF to GraphQL no está configurado
- ⚠️ Más difícil de modificar sin tocar código

**Pasos:**
1. Asegurar que el plugin `restaurant-theme-config` esté activo
2. Verificar que ACF esté activo
3. Recargar WordPress admin para que se creen los campos
4. Activar plugin "WPGraphQL for Advanced Custom Fields"

**Tiempo estimado:** 5-10 minutos

---

### **OPCIÓN 3: Crear Campos Manualmente en WordPress Admin**

**Ventajas:**
- ✅ Control total sobre cada campo
- ✅ Interfaz visual fácil de usar
- ✅ Puedes ver y ajustar cada detalle

**Desventajas:**
- ⚠️ Más lento (crear cada campo manualmente)
- ⚠️ Propenso a errores de nombres/keys
- ⚠️ No es versionable fácilmente

**Pasos:**
1. Ir a WordPress Admin > Custom Fields > Add New
2. Crear cada grupo de campos manualmente
3. Configurar ubicaciones (location rules)
4. Guardar y verificar

**Tiempo estimado:** 30-45 minutos

---

### **OPCIÓN 4: Híbrida - JSON + Campos Programáticos**

**Ventajas:**
- ✅ JSON para campos básicos (fácil de importar)
- ✅ PHP para campos complejos o dinámicos
- ✅ Mejor de ambos mundos

**Pasos:**
1. Importar JSON con campos básicos
2. Usar PHP para campos adicionales o complejos
3. Verificar que no haya duplicados

**Tiempo estimado:** 20-30 minutos

---

## 📋 CAMPOS FALTANTES DETECTADOS

### 1. About Page - Campos Faltantes en JSON:

```json
{
  "key": "field_about_features",
  "label": "About Features",
  "name": "about_features",
  "type": "repeater",
  "sub_fields": [
    {
      "key": "field_feature_text",
      "label": "Feature Text",
      "name": "feature_text",
      "type": "text"
    }
  ]
},
{
  "key": "field_about_details",
  "label": "About Details",
  "name": "about_details",
  "type": "repeater",
  "sub_fields": [
    {
      "key": "field_detail_icon",
      "label": "Icon",
      "name": "icon",
      "type": "image"
    },
    {
      "key": "field_detail_title",
      "label": "Title",
      "name": "title",
      "type": "text"
    },
    {
      "key": "field_detail_description",
      "label": "Description",
      "name": "description",
      "type": "textarea"
    }
  ]
}
```

### 2. Services Page - Campos Faltantes en JSON:

```json
{
  "key": "field_services_items",
  "label": "Services Items",
  "name": "services_items",
  "type": "repeater",
  "sub_fields": [
    {
      "key": "field_service_icon",
      "label": "Icon",
      "name": "icon",
      "type": "image"
    },
    {
      "key": "field_service_title",
      "label": "Title",
      "name": "title",
      "type": "text"
    },
    {
      "key": "field_service_description",
      "label": "Description",
      "name": "description",
      "type": "textarea"
    },
    {
      "key": "field_service_link",
      "label": "Link",
      "name": "link",
      "type": "text"
    }
  ]
}
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

### Paso 1: Verificar Plugins
- [ ] ACF está activo
- [ ] WPGraphQL está activo
- [ ] WPGraphQL for Advanced Custom Fields está activo
- [ ] restaurant-theme-config está activo

### Paso 2: Verificar Campos ACF
- [ ] Home Page Sections existe
- [ ] About Page Sections existe (con todos los campos)
- [ ] Contact Page Sections existe
- [ ] Services Page Sections existe (con services_items)
- [ ] Menu Page Sections existe

### Paso 3: Verificar en Páginas
- [ ] Editar página "About" - ver campos ACF
- [ ] Editar página "Home" - ver campos ACF
- [ ] Editar página "Services" - ver campos ACF
- [ ] Editar página "Contact" - ver campos ACF
- [ ] Editar página "Menu" - ver campos ACF

### Paso 4: Verificar GraphQL
- [ ] Probar query GraphQL para obtener campos ACF
- [ ] Verificar que los campos aparezcan en la respuesta

### Paso 5: Verificar Backend
- [ ] Backend obtiene campos ACF correctamente
- [ ] Los datos se transforman correctamente

### Paso 6: Verificar Frontend
- [ ] Frontend muestra datos de ACF
- [ ] No hay errores en consola

---

## 🚀 RECOMENDACIÓN FINAL

**Recomiendo la OPCIÓN 1** (Actualizar y Re-importar JSON) porque:
1. Es la más completa y mantenible
2. Incluye todos los campos necesarios
3. Es fácil de versionar
4. Permite compartir la configuración fácilmente

¿Quieres que actualice el archivo `acf-export.json` con los campos faltantes y te guíe en la importación?

