# Configuración de WordPress

## Estado de la Configuración

### ✅ Completado
1. **Error de sintaxis corregido** en `frontend/pages/services.vue`
2. **GraphQL configurado** - Endpoint: http://restaurant.local/graphql
3. **Plugin Restaurant Theme Config activo** - Registra menús y opciones del tema

### 📋 Pendiente de Configuración Manual

#### 1. Crear Páginas
Necesitas crear las siguientes páginas en WordPress:
- **Home** (puede ser la página de inicio)
- **About Us** (slug: `about`)
- **Services** (slug: `services`)
- **Menu** (slug: `menu`)
- **Contact Us** (slug: `contact`)
- **Blog** (slug: `blog`)

#### 2. Crear Menú Principal
1. Ir a **Appearance > Menus**
2. Crear un nuevo menú llamado "Primary Menu"
3. Agregar las páginas creadas al menú
4. Asignar el menú a la ubicación "Primary Menu"

#### 3. Configurar Opciones del Tema
1. Ir a **Appearance > Theme Options**
2. Configurar:
   - Logo URL
   - Dirección
   - Teléfono
   - Email
   - Redes sociales (Facebook, Instagram, Dribbble)
   - Texto de copyright

#### 4. Crear Posts/Insights
Crear algunos posts de ejemplo para que aparezcan en el blog

#### 5. Crear Productos (WooCommerce)
Crear productos de ejemplo para que aparezcan en la página de menú

## Instrucciones Detalladas

### Crear Páginas
1. Ir a **Pages > Add New**
2. Crear cada página con su título correspondiente
3. Asegurarse de que el slug sea correcto (About Us → `about`, etc.)
4. Publicar las páginas

### Crear Menú
1. Ir a **Appearance > Menus**
2. Hacer clic en "Create Menu"
3. Nombrar el menú "Primary Menu"
4. Seleccionar las páginas y hacer clic en "Add to Menu"
5. En "Menu Settings", marcar "Primary Menu" en "Display location"
6. Guardar el menú

### Configurar Opciones del Tema
1. Ir a **Appearance > Theme Options**
2. Llenar todos los campos con la información del restaurante
3. Guardar los cambios

## Notas
- El frontend está configurado para obtener datos dinámicamente desde WordPress
- Si no hay contenido en WordPress, el frontend mostrará datos de ejemplo
- El backend tiene fallbacks para cuando WordPress no está disponible

