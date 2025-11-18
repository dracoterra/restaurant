<template>
  <div class="our-dishes">
    <div class="container">
      <div class="row section-row">
        <div class="col-lg-12">
          <!-- Section Title Start -->
          <div class="section-title">
            <h3 class="wow fadeInUp">{{ subtitle || 'our main dishes' }}</h3>
            <h2 class="text-anime-style-2" data-cursor="-opaque">
              {{ title || 'Satisfy your cravings with our signature mains' }}
            </h2>
          </div>
          <!-- Section Title End -->
        </div>
      </div>

      <div class="row" v-if="!productsStore.loading && dishes.length > 0">
        <div class="col-lg-3 col-md-6" v-for="(dish, index) in dishes" :key="dish.id || index">
          <!-- Our Dish Item Start -->
          <div class="our-dish-item wow fadeInUp" :data-wow-delay="`${index * 0.2}s`">
            <div class="our-dish-img">
              <figure class="image-anime">
                <img :src="dish.image" :alt="dish.title">
              </figure>
            </div>
            <div class="our-dish-content">
              <h3>{{ dish.title }}</h3>
              <p>{{ dish.description }}</p>
            </div>
          </div>
          <!-- Our Dish Item End -->
        </div>
      </div>

      <div class="row" v-else-if="productsStore.loading">
        <div class="col-lg-12">
          <p class="text-center">Cargando platos...</p>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <!-- Section Footer Text Start -->
          <div class="section-footer-text wow fadeInUp" data-wow-delay="0.8s">
            <p>Hungry for Something Delicious? <NuxtLink to="/menu">View All Dishes!</NuxtLink></p>
          </div>
          <!-- Section Footer Text End -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProductsStore, type Product } from '~/stores/products'

interface Dish {
  id?: string
  title: string
  description: string
  image: string
}

interface Props {
  subtitle?: string
  title?: string
  dishes?: Dish[]
}

const props = defineProps<Props>()

const productsStore = useProductsStore()

// Si se pasan dishes como prop, usarlos; si no, usar productos
const dishes = computed<Dish[]>(() => {
  if (props.dishes && props.dishes.length > 0) {
    return props.dishes
  }
  
  // Usar productos desde el store, limitar a 4
  return productsStore.products.slice(0, 4).map((product: Product) => ({
    id: product.id,
    title: product.name,
    description: product.shortDescription || product.description || '',
    image: product.image?.url || '/images/our-dish-image-1.jpg'
  }))
})

onMounted(async () => {
  // Si no hay dishes pasados como prop, cargar productos
  if (!props.dishes || props.dishes.length === 0) {
    if (productsStore.products.length === 0) {
      await productsStore.fetchProducts({ limit: 4 })
    }
  }
})
</script>

