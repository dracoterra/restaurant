# Plan de Configuración WordPress para Auto-Administración

## Objetivo
Configurar WordPress para que todo el contenido del sitio sea auto-administrable desde el panel de WordPress, sin necesidad de editar código.

## Plugins Necesarios

### 1. Advanced Custom Fields (ACF) - OPCIONES
- **Propósito**: Crear campos personalizados para opciones del tema
- **Instalación**: Desde el repositorio de WordPress
- **Configuración**:
  - Crear grupo de campos "Theme Options"
  - Campos: Logo, Dirección, Teléfono, Email, Redes Sociales, Copyright

### 2. Menús de WordPress (Nativo)
- **Propósito**: Gestionar menús de navegación
- **Configuración**:
  - Ir a Apariencia > Menús
  - Crear menú "Primary Menu"
  - Asignar a ubicación "Primary"

## Configuración Requerida

### 1. Menús de Navegación
**Ubicación**: Apariencia > Menús

1. Crear nuevo menú llamado "Primary Menu"
2. Agregar páginas:
   - Home (/)
   - About Us (/about)
   - Services (/services)
   - Menu (/menu)
   - Contact Us (/contact)
3. Asignar a ubicación "Primary" (si existe)
4. Guardar menú

### 2. Opciones del Tema (ACF Options)
**Ubicación**: Personalizar > Opciones del Tema (si ACF está instalado)

**Campos a crear**:
- **Logo**: Imagen (subir logo)
- **Dirección**: Texto (ej: "4517 Washington Ave, Kentucky 39495")
- **Teléfono**: Texto (ej: "+01 780 859 632")
- **Email**: Email (ej: "info@restaurant.com")
- **Facebook**: URL
- **Instagram**: URL
- **Dribbble**: URL
- **Copyright**: Texto (ej: "Copyright © 2025 All Rights Reserved.")

### 3. Páginas Principales
**Ubicación**: Páginas > Añadir nueva

Crear las siguientes páginas:
1. **Home** (slug: `index` o usar página de inicio)
2. **About Us** (slug: `about`)
3. **Services** (slug: `services`)
4. **Menu** (slug: `menu`)
5. **Contact** (slug: `contact`)

### 4. Configuración de Página de Inicio
**Ubicación**: Configuración > Lectura

- Establecer "Página de inicio estática"
- Seleccionar página "Home"

## Endpoints del Backend

### Menús
- **GET** `/menus?location=primary`
- Obtiene menú desde WordPress GraphQL

### Settings
- **GET** `/settings`
- Obtiene opciones del tema desde WordPress ACF Options

## Próximos Pasos

1. ✅ Instalar ACF (si se requiere)
2. ⏳ Configurar menú en WordPress
3. ⏳ Crear campos ACF para opciones del tema
4. ⏳ Crear páginas principales
5. ⏳ Probar endpoints del backend

## Notas

- Si ACF no está disponible, el backend retornará valores por defecto
- Los menús se obtienen desde WordPress GraphQL
- Las opciones del tema se pueden gestionar desde ACF Options o WordPress Customizer

