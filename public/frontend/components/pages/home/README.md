# Componentes de la Página Home

Esta carpeta contiene todos los componentes específicos de la página Home (`/`).

## Componentes

1. **HeroSection.vue** - Sección hero con video de fondo
2. **AboutUsSection.vue** - Sección "About Us" con información de la empresa
3. **OurDishesSection.vue** - Sección de platos principales
4. **DailyOfferSection.vue** - Sección de ofertas diarias
5. **OurMenuSection.vue** - Sección de menú con pestañas interactivas
6. **IntroVideoSection.vue** - Sección de video introductorio
7. **OurIngredientsSection.vue** - Sección de ingredientes con contadores
8. **OurTestimonialSection.vue** - Sección de testimonios con slider Swiper
9. **OurBlogSection.vue** - Sección de blog/insights
10. **ReserveTableSection.vue** - Sección de reserva de mesa con formulario

## Uso

Estos componentes se utilizan en `frontend/pages/index.vue` y se auto-importan en Nuxt 3 con el prefijo `PagesHome`.

Ejemplo:
```vue
<PagesHomeHeroSection
  :subtitle="acf?.heroSubtitle"
  :title="acf?.heroTitle"
/>
```

## Estructura

```
components/
└── pages/
    └── home/
        ├── HeroSection.vue
        ├── AboutUsSection.vue
        ├── OurDishesSection.vue
        ├── DailyOfferSection.vue
        ├── OurMenuSection.vue
        ├── IntroVideoSection.vue
        ├── OurIngredientsSection.vue
        ├── OurTestimonialSection.vue
        ├── OurBlogSection.vue
        └── ReserveTableSection.vue
```

