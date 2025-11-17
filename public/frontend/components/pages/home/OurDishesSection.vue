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

      <div class="row">
        <div class="col-lg-3 col-md-6" v-for="(dish, index) in dishes" :key="index">
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
interface Dish {
  title: string
  description: string
  image: string
}

interface Props {
  subtitle?: string
  title?: string
  dishes?: Dish[]
}

withDefaults(defineProps<Props>(), {
  subtitle: 'our main dishes',
  title: 'Satisfy your cravings with our signature mains',
  dishes: () => [
    {
      title: 'soups',
      description: 'Warm, comforting, and full of flavor, our soups are the perfect start to any meal.',
      image: '/images/our-dish-image-1.jpg'
    },
    {
      title: 'salads',
      description: 'Refreshing, vibrant, and full of fresh flavors, our salads are crafted to senses.',
      image: '/images/our-dish-image-2.jpg'
    },
    {
      title: 'main dishes',
      description: 'Offering bold flavors and expertly crafted recipes that cater to every taste.',
      image: '/images/our-dish-image-3.jpg'
    },
    {
      title: 'appetizers',
      description: 'Our appetizers are the perfect way to begin your dining experience flavors.',
      image: '/images/our-dish-image-4.jpg'
    }
  ]
})
</script>

