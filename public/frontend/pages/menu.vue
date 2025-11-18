<template>
  <div>
    <!-- Page Header Start -->
    <SectionsPageHeader title="our menu" />
    <!-- Page Header End -->

    <!-- Page Menu Start -->
    <div class="page-menu">
      <div class="container">
        <div class="row section-row">
          <div class="col-lg-12">
            <!-- Section Title Start -->
            <div class="section-title">
              <h3 class="wow fadeInUp">{{ acf?.menuSubtitle || 'taste the best that surprise you' }}</h3>
              <h2 class="text-anime-style-2" data-cursor="-opaque">
                {{ acf?.menuTitle || 'our special menu' }}
              </h2>
              <p class="wow fadeInUp" data-wow-delay="0.2s" v-if="acf?.menuDescription">
                {{ acf.menuDescription }}
              </p>
              <p class="wow fadeInUp" data-wow-delay="0.2s" v-else>
                Enjoy the unique dishes from the basillico restaurant that only our restaurant has, Fusce malesuada, lorem vitae euismod lobortis.
              </p>
            </div>
            <!-- Section Title End -->
          </div>
        </div>

        <div class="row">
          <div class="col-lg-12">
            <!-- Special Menu List Start -->
            <div class="special-menu-list">
              <div 
                v-for="(category, index) in menuCategories" 
                :key="category.slug"
                class="special-menu-item wow fadeInUp" 
                :data-wow-delay="`${index * 0.2}s`"
              >
                <div class="special-menu-img">
                  <a 
                    :href="`#${category.slug}`" 
                    @click.prevent="scrollToCategory(category.slug)"
                    data-cursor-text="View"
                  >
                    <figure class="image-anime">
                      <img :src="category.image" :alt="category.name">
                    </figure>
                  </a>
                </div>
                <div class="special-menu-item-content">
                  <h3><a :href="`#${category.slug}`" @click.prevent="scrollToCategory(category.slug)">{{ category.name }}</a></h3>
                </div>
              </div>
            </div>
            <!-- Special Menu List End -->
          </div>
        </div>
      </div>
    </div>
    <!-- Page Menu End -->

    <!-- Our Food Menu Start -->
    <div class="our-food-menu" v-if="!productsStore.loading">
      <div 
        v-for="category in menuCategories" 
        :key="category.slug"
        class="food-menu-item" 
        :id="category.slug"
      >
        <div class="container">
          <div class="row">
            <div class="col-lg-3">
              <!-- Food Menu Sidebar Start -->
              <div class="food-menu-sidebar">
                <!-- Section Title Start -->
                <div class="section-title">
                  <h3 class="wow fadeInUp">menu & pricing</h3>
                  <h2 class="text-anime-style-2" data-cursor="-opaque">{{ category.name }}</h2>
                </div>
                <!-- Section Title End -->
              </div>
              <!-- Food Menu Sidebar End -->
            </div>

            <div class="col-lg-9">
              <!-- Our Menu List Start -->
              <div class="our-menu-list">
                <div 
                  v-for="(product, index) in productsStore.productsByCategory(category.slug)" 
                  :key="product.id"
                  class="our-menu-item wow fadeInUp" 
                  :data-wow-delay="`${index * 0.1}s`"
                >
                  <!-- Our Menu Image Start -->
                  <div class="our-menu-image" v-if="product.image">
                    <figure>
                      <img :src="product.image.url" :alt="product.image.alt || product.name">
                    </figure>
                  </div>
                  <!-- Our Menu Image End -->

                  <!-- Menu Item Body Start -->
                  <div class="menu-item-body">
                    <!-- Menu Item Title Start -->
                    <div class="menu-item-title">
                      <h3>{{ product.name }}</h3>
                      <hr>
                      <span>${{ product.onSale && product.salePrice ? product.salePrice : product.price }}</span>
                    </div>
                    <!-- Menu Item Title End -->

                    <!-- Menu Item Content Start -->
                    <div class="menu-item-content">
                      <p v-html="product.shortDescription || product.description"></p>
                    </div>
                    <!-- Menu Item Content End -->
                  </div>
                  <!-- Menu Item Body End -->
                </div>
                
                <!-- Mensaje si no hay productos -->
                <div v-if="productsStore.productsByCategory(category.slug).length === 0" class="text-center py-5">
                  <p>No hay productos en esta categoría aún.</p>
                </div>
              </div>
              <!-- Our Menu List End -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Our Food Menu End -->

    <!-- Loading State -->
    <div v-if="productsStore.loading" class="container py-5 text-center">
      <p>Cargando menú...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProductsStore } from '~/stores/products'
import { usePagesStore, type Page } from '~/stores/pages'

// Meta tags
const pagesStore = usePagesStore()
const productsStore = useProductsStore()
const page = ref<Page | null>(null)

// Computed para obtener campos ACF
const acf = computed(() => page.value?.acf?.menuPageSections)

// Categorías del menú con imágenes
const menuCategories = ref([
  { name: 'Starters', slug: 'starters', image: '/images/special-menu-img-1.jpg' },
  { name: 'Vegetables', slug: 'vegetables', image: '/images/special-menu-img-2.jpg' },
  { name: 'Seafood', slug: 'seafood', image: '/images/special-menu-img-3.jpg' },
  { name: 'Desserts', slug: 'desserts', image: '/images/special-menu-img-4.jpg' },
  { name: 'Beverages', slug: 'beverages', image: '/images/special-menu-img-5.jpg' },
  { name: 'Salads & Soups', slug: 'salads-soups', image: '/images/special-menu-img-6.jpg' }
])

const scrollToCategory = (categorySlug: string) => {
  const element = document.getElementById(categorySlug)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(async () => {
  try {
    // Cargar productos
    await productsStore.fetchProducts({ limit: 100 })
    
    // Intentar obtener página por slug (puede no existir en WordPress)
    try {
      page.value = await pagesStore.fetchPageBySlug('menu')
    } catch (error: any) {
      // Si la página no existe en WordPress, usar valores por defecto
      // Esto es normal si la página "menu" no se ha creado en WordPress
      page.value = null
    }
    
    // Actualizar meta tags si hay SEO
    if (page.value?.seo?.title) {
      useHead({
        title: page.value.seo.title,
        meta: [
          { name: 'description', content: page.value.seo.metaDesc || page.value.excerpt }
        ]
      })
    } else {
      useHead({
        title: 'Menu - Restaurant',
        meta: [
          { name: 'description', content: acf.value?.menuDescription || 'Our special menu with unique dishes' }
        ]
      })
    }
    
    // Inicializar animaciones
    if (process.client) {
      setTimeout(() => {
        if ((window as any).WOW) {
          new (window as any).WOW().init()
        }
      }, 500)
    }
  } catch (error) {
    // Error loading menu page
  }
})
</script>

