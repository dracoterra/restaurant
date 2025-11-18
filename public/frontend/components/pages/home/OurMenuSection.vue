<template>
  <div class="our-menu">
    <div class="container">
      <div class="row section-row">
        <div class="col-lg-12">
          <!-- Section Title Start -->
          <div class="section-title" v-if="subtitle || title">
            <h3 class="wow fadeInUp" v-if="subtitle">{{ subtitle }}</h3>
            <h2 class="text-anime-style-2" data-cursor="-opaque" v-if="title">
              <span v-html="formatTitle(title)"></span>
            </h2>
          </div>
          <!-- Section Title End -->
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <!-- Our Menu Tab Start -->
          <div class="our-menu-tab">
            <!-- Sidebar Our Menu Nav start -->
            <div class="our-menu-tab-nav wow fadeInUp" data-wow-delay="0.2s">
              <ul class="nav nav-tabs" id="menuTab" role="tablist">
                <li class="nav-item" role="presentation">
                  <button 
                    class="nav-link" 
                    :class="{ active: activeTab === 'appetizers' }"
                    @click="activeTab = 'appetizers'"
                    type="button"
                  >
                    appetizers
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button 
                    class="nav-link" 
                    :class="{ active: activeTab === 'maincourses' }"
                    @click="activeTab = 'maincourses'"
                    type="button"
                  >
                    main courses
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button 
                    class="nav-link" 
                    :class="{ active: activeTab === 'sides' }"
                    @click="activeTab = 'sides'"
                    type="button"
                  >
                    sides
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button 
                    class="nav-link" 
                    :class="{ active: activeTab === 'desserts' }"
                    @click="activeTab = 'desserts'"
                    type="button"
                  >
                    desserts
                  </button>
                </li>
              </ul>
            </div>
            <!-- Sidebar Our Menu Nav End -->

            <!-- Menu Box Start -->
            <div class="tab-content">
              <!-- Appetizers Tab -->
              <div v-show="activeTab === 'appetizers'" class="tab-pane">
                <div class="row align-items-center">
                  <div class="col-lg-12">
                    <div class="our-menu-list">
                      <div 
                        v-for="(item, index) in computedMenuItems.appetizers" 
                        :key="item.id || index"
                        class="our-menu-item"
                      >
                        <div class="our-menu-image">
                          <figure>
                            <img :src="item.image" :alt="item.title">
                          </figure>
                        </div>
                        <div class="menu-item-body">
                          <div class="menu-item-title">
                            <h3>{{ item.title }}</h3>
                            <hr>
                            <span>${{ item.price }}</span>
                          </div>
                          <div class="menu-item-content">
                            <p>{{ item.description }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Main Courses Tab -->
              <div v-show="activeTab === 'maincourses'" class="tab-pane">
                <div class="row align-items-center">
                  <div class="col-lg-12">
                    <div class="our-menu-list">
                      <div 
                        v-for="(item, index) in computedMenuItems.maincourses" 
                        :key="item.id || index"
                        class="our-menu-item"
                      >
                        <div class="our-menu-image">
                          <figure>
                            <img :src="item.image" :alt="item.title">
                          </figure>
                        </div>
                        <div class="menu-item-body">
                          <div class="menu-item-title">
                            <h3>{{ item.title }}</h3>
                            <hr>
                            <span>${{ item.price }}</span>
                          </div>
                          <div class="menu-item-content">
                            <p>{{ item.description }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sides Tab -->
              <div v-show="activeTab === 'sides'" class="tab-pane">
                <div class="row align-items-center">
                  <div class="col-lg-12">
                    <div class="our-menu-list">
                      <div 
                        v-for="(item, index) in computedMenuItems.sides" 
                        :key="item.id || index"
                        class="our-menu-item"
                      >
                        <div class="our-menu-image">
                          <figure>
                            <img :src="item.image" :alt="item.title">
                          </figure>
                        </div>
                        <div class="menu-item-body">
                          <div class="menu-item-title">
                            <h3>{{ item.title }}</h3>
                            <hr>
                            <span>${{ item.price }}</span>
                          </div>
                          <div class="menu-item-content">
                            <p>{{ item.description }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Desserts Tab -->
              <div v-show="activeTab === 'desserts'" class="tab-pane">
                <div class="row align-items-center">
                  <div class="col-lg-12">
                    <div class="our-menu-list">
                      <div 
                        v-for="(item, index) in computedMenuItems.desserts" 
                        :key="item.id || index"
                        class="our-menu-item"
                      >
                        <div class="our-menu-image">
                          <figure>
                            <img :src="item.image" :alt="item.title">
                          </figure>
                        </div>
                        <div class="menu-item-body">
                          <div class="menu-item-title">
                            <h3>{{ item.title }}</h3>
                            <hr>
                            <span>${{ item.price }}</span>
                          </div>
                          <div class="menu-item-content">
                            <p>{{ item.description }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Menu Box End -->
          </div>
          <!-- Our Menu Tab End -->
        </div>

        <div class="col-lg-12">
          <!-- Section Footer Text Start -->
          <div class="section-footer-text wow fadeInUp" data-wow-delay="0.4s">
            <p>Ready to Savor the Best? <NuxtLink to="/menu">Check Our Dishes!</NuxtLink></p>
          </div>
          <!-- Section Footer Text End -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProductsStore, type Product } from '~/stores/products'

interface MenuItem {
  id?: string
  title: string
  price: string
  description: string
  image: string
}

interface MenuItems {
  appetizers: MenuItem[]
  maincourses: MenuItem[]
  sides: MenuItem[]
  desserts: MenuItem[]
}

interface Props {
  subtitle?: string
  title?: string
  menuItems?: MenuItems
}

const props = defineProps<Props>()

const productsStore = useProductsStore()
const activeTab = ref('appetizers')

// Helper para formatear el título con spans
const formatTitle = (title: string) => {
  if (!title) return ''
  return title.replace(/\<span\>(.*?)\<\/span\>/gi, '<span>$1</span>')
}

// Mapear productos a items del menú según categorías
const computedMenuItems = computed<MenuItems>(() => {
  // Si se pasan menuItems como prop, usarlos
  if (props.menuItems) {
    return props.menuItems
  }

  // Si no, usar productos desde el store
  const products = productsStore.products

  // Función helper para convertir producto a menu item
  const productToMenuItem = (product: Product): MenuItem => ({
    id: product.id,
    title: product.name,
    price: product.salePrice || product.price || '0.00',
    description: product.shortDescription || product.description || '',
    image: product.image?.url || '/images/our-menu-image-1.png'
  })

  // Categorizar productos por slug de categoría
  const appetizers: MenuItem[] = []
  const maincourses: MenuItem[] = []
  const sides: MenuItem[] = []
  const desserts: MenuItem[] = []

  products.forEach((product: Product) => {
    const categorySlugs = product.categories?.map(cat => cat.slug.toLowerCase()) || []
    
    if (categorySlugs.some(slug => slug.includes('appetizer') || slug.includes('entrada'))) {
      appetizers.push(productToMenuItem(product))
    } else if (categorySlugs.some(slug => slug.includes('main') || slug.includes('principal') || slug.includes('course'))) {
      maincourses.push(productToMenuItem(product))
    } else if (categorySlugs.some(slug => slug.includes('side') || slug.includes('acompañamiento'))) {
      sides.push(productToMenuItem(product))
    } else if (categorySlugs.some(slug => slug.includes('dessert') || slug.includes('postre'))) {
      desserts.push(productToMenuItem(product))
    } else {
      // Si no tiene categoría específica, agregar a maincourses por defecto
      maincourses.push(productToMenuItem(product))
    }
  })

  return {
    appetizers: appetizers.slice(0, 6),
    maincourses: maincourses.slice(0, 6),
    sides: sides.slice(0, 6),
    desserts: desserts.slice(0, 6)
  }
})

onMounted(async () => {
  // Si no hay menuItems pasados como prop, cargar productos
  if (!props.menuItems) {
    if (productsStore.products.length === 0) {
      await productsStore.fetchProducts({ limit: 50 })
    }
  }
})
</script>

