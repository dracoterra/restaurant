# Instrucciones de Configuración - WordPress Auto-Administrable

## ✅ Plugin Creado y Activado

El plugin **Restaurant Theme Config** ha sido creado y debe estar activado. Este plugin:
- ✅ Registra ubicaciones de menús (Primary, Footer)
- ✅ Crea página de opciones del tema
- ✅ Expone endpoint REST API para opciones

## 📋 Pasos de Configuración

### 1. Configurar Menú Principal

1. Ir a **Apariencia > Menús**
2. Crear nuevo menú llamado "Primary Menu"
3. Agregar páginas/links:
   - Home (/)
   - About Us (/about)
   - Services (/services)
   - Menu (/menu)
   - Contact Us (/contact)
4. En "Ubicaciones del menú", marcar "Primary"
5. Guardar menú

### 2. Configurar Opciones del Tema

1. Ir a **Apariencia > Theme Options**
2. Configurar:
   - **Logo**: Subir logo del restaurante
   - **Dirección**: Dirección del restaurante
   - **Teléfono**: Número de teléfono
   - **Email**: Email de contacto
   - **Facebook**: URL de Facebook
   - **Instagram**: URL de Instagram
   - **Dribbble**: URL de Dribbble
   - **Copyright**: Texto de copyright
3. Guardar cambios

### 3. Crear Páginas Principales

1. Ir a **Páginas > Añadir nueva**
2. Crear las siguientes páginas:
   - **Home** (slug: `index` o dejar vacío para página de inicio)
   - **About Us** (slug: `about`)
   - **Services** (slug: `services`)
   - **Menu** (slug: `menu`)
   - **Contact** (slug: `contact`)

### 4. Configurar Página de Inicio (Opcional)

1. Ir a **Configuración > Lectura**
2. Seleccionar "Página de inicio estática"
3. Elegir página "Home"

## 🔌 Endpoints Disponibles

### Menús
- **Backend**: `GET /menus?location=primary`
- **WordPress**: Obtiene menú desde GraphQL

### Settings
- **Backend**: `GET /settings`
- **WordPress REST API**: `GET /wp-json/restaurant/v1/settings`

## ✅ Estado Actual

- ✅ Plugin creado y activado
- ✅ Ubicaciones de menús registradas
- ✅ Página de opciones del tema creada
- ✅ Endpoint REST API configurado
- ⏳ Pendiente: Configurar menú y opciones manualmente

## 📝 Notas

- El plugin funciona sin necesidad de ACF
- Las opciones se guardan en `wp_options` de WordPress
- El menú se obtiene desde WordPress GraphQL
- Si no hay menú configurado, se usa menú por defecto
- Si no hay opciones configuradas, se usan valores por defecto

