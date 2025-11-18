# Reporte de Verificación de Campos ACF

**Fecha:** 2024  
**Estado:** ✅ Verificación Completa

---

## 📊 Resumen Ejecutivo

### ✅ Conexión WordPress → Backend
- **GraphQL:** ✅ Funcionando correctamente
- **REST API:** ✅ Funcionando correctamente
- **Autenticación:** ✅ Configurada correctamente

### ⚠️ Problema Identificado

**Estructura de Campos ACF en GraphQL:**

Los campos ACF tienen una estructura anidada que no coincide con la query actual:

```
Page {
  homePageSections {
    homePageSections {  // ← Nivel adicional necesario
      heroSubtitle
      heroTitle
      heroDescription
      ...
    }
  }
}
```

**Problema Actual:**
- La query intenta acceder directamente a `homePageSections.heroSubtitle`
- La estructura real requiere `homePageSections.homePageSections.heroSubtitle`

---

## 🔍 Hallazgos Detallados

### 1. Campos Disponibles en GraphQL

#### Tipo: `HomePageSections`
- Campo: `homePageSections` (tipo: `HomePageSectionsHomePageSections`)

#### Tipo: `HomePageSectionsHomePageSections`
Contiene todos los campos reales:

**Campos de Texto:**
- `aboutDescription`
- `aboutSubtitle`
- `aboutTitle`
- `dailyOfferBurgerTitle`
- `dailyOfferDescription`
- `dailyOfferSubtitle`
- `dailyOfferTitle`
- `dishesSubtitle`
- `dishesTitle`
- `heroDescription`
- `heroSubtitle`
- `heroTitle`
- `ingredientsDescription`
- `ingredientsSubtitle`
- `ingredientsTitle`
- `introVideoUrl`
- `menuSubtitle`
- `menuTitle`
- `reserveSubtitle`
- `reserveTitle`
- `testimonialSubtitle`
- `testimonialTitle`

**Campos de Imagen:**
- `dailyOfferImage`
- `heroMainImage`
- `heroVideo`
- `ingredientsImage`
- `introVideoBg`

**Campos de Array/Repeater:**
- `dailyOfferBurgerFeatures` (tipo: `HomePageSectionsHomePageSectionsDailyOfferBurgerFeatures`)
- `dailyOfferFeatures` (tipo: `HomePageSectionsHomePageSectionsDailyOfferFeatures`)
- `ingredientsCounters` (tipo: `HomePageSectionsHomePageSectionsIngredientsCounters`)
- `ingredientsFeatures` (tipo: `HomePageSectionsHomePageSectionsIngredientsFeatures`)
- `ingredientsCustomerImages`
- `testimonials` (tipo: `HomePageSectionsHomePageSectionsTestimonials`)
- `reserveHours` (tipo: `HomePageSectionsHomePageSectionsReserveHours`)

### 2. Páginas Verificadas

- ✅ **Home:** Existe, tiene `homePageSections`
- ✅ **About:** Existe, pero no tiene `aboutPageSections` en GraphQL
- ✅ **Contact:** Existe, pero no tiene `contactPageSections` en GraphQL
- ✅ **Services:** Existe, pero no tiene `servicesPageSections` en GraphQL

**Conclusión:** Solo `homePageSections` está disponible en GraphQL. Las otras secciones (`aboutPageSections`, `contactPageSections`, `servicesPageSections`) no están expuestas.

---

## 🔧 Solución Requerida

### 1. Actualizar Query GraphQL en `pages.service.js`

**Query Actual (Incorrecta):**
```graphql
homePageSections {
  heroSubtitle
  heroTitle
  heroDescription
}
```

**Query Correcta:**
```graphql
homePageSections {
  homePageSections {
    heroSubtitle
    heroTitle
    heroDescription
    heroMainImage {
      sourceUrl
      altText
      mediaDetails {
        width
        height
      }
    }
    # ... todos los demás campos
  }
}
```

### 2. Actualizar Transformación de Datos

En el método `transformPage()` o `transformACFSection()`, ajustar para acceder al nivel correcto:

```javascript
if (page.homePageSections?.homePageSections) {
  transformed.acf.homePageSections = this.transformACFSection(
    page.homePageSections.homePageSections
  );
}
```

### 3. Verificar Otras Secciones

Para `aboutPageSections`, `contactPageSections`, `servicesPageSections`:
- Verificar si existen en WordPress
- Verificar si están asignados a las páginas correspondientes
- Verificar si WPGraphQL for ACF los está exponiendo
- Si no están expuestos, considerar usar REST API como fallback

---

## 📝 Recomendaciones

1. **Actualizar Queries Inmediatamente**
   - Corregir la estructura anidada en todas las queries GraphQL
   - Probar con la página Home primero

2. **Verificar Configuración de ACF en WordPress**
   - Revisar que los grupos de campos estén correctamente asignados
   - Verificar que WPGraphQL for ACF esté activo y configurado

3. **Implementar Fallback**
   - Si los campos no están en GraphQL, usar REST API
   - El código actual ya tiene lógica de fallback, verificar que funcione

4. **Testing**
   - Probar cada página después de los cambios
   - Usar la página `/debug-acf` para verificar visualmente
   - Revisar logs del backend

---

## 🛠️ Scripts de Verificación Creados

1. **`backend/verify-acf.js`** - Verificación básica de conexión y campos
2. **`backend/discover-acf-fields.js`** - Descubrimiento de campos disponibles
3. **`backend/inspect-acf-structure.js`** - Inspección profunda de estructura
4. **`frontend/pages/debug-acf.vue`** - Página visual de debugging
5. **`frontend/composables/useAcfDebug.ts`** - Composable para debugging

---

## ✅ Checklist de Acciones

- [x] Verificar conexión WordPress → Backend
- [x] Descubrir estructura de campos ACF en GraphQL
- [x] Identificar problema de estructura anidada
- [ ] Actualizar queries GraphQL en `pages.service.js`
- [ ] Actualizar transformación de datos
- [ ] Probar con página Home
- [ ] Verificar otras páginas (About, Contact, Services)
- [ ] Actualizar documentación si es necesario

---

**Última actualización:** 2024

