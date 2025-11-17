<template>
  <div class="our-menu">
    <div class="container">
      <div class="row section-row">
        <div class="col-lg-12">
          <!-- Section Title Start -->
          <div class="section-title">
            <h3 class="wow fadeInUp">from our menu</h3>
            <h2 class="text-anime-style-2" data-cursor="-opaque">An Inspired Menu That <span>Blends Tradition</span></h2>
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
                        v-for="(item, index) in menuItems.appetizers" 
                        :key="index"
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
                        v-for="(item, index) in menuItems.maincourses" 
                        :key="index"
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
                        v-for="(item, index) in menuItems.sides" 
                        :key="index"
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
                        v-for="(item, index) in menuItems.desserts" 
                        :key="index"
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
import { ref } from 'vue'

interface MenuItem {
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

const activeTab = ref('appetizers')

const menuItems: MenuItems = {
  appetizers: [
    {
      title: 'chips & dip',
      price: '16.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-1.png'
    },
    {
      title: 'caprese salad',
      price: '12.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-2.png'
    },
    {
      title: 'garlic fries',
      price: '26.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-3.png'
    },
    {
      title: 'tortilla soup',
      price: '20.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-4.png'
    },
    {
      title: 'kale salad',
      price: '10.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-5.png'
    },
    {
      title: 'thai curry',
      price: '22.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-6.png'
    }
  ],
  maincourses: [
    {
      title: 'Fish fry',
      price: '26.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-1.png'
    },
    {
      title: 'Prawn masala',
      price: '28.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-2.png'
    },
    {
      title: 'Pasta alfredo',
      price: '30.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-3.png'
    },
    {
      title: 'Sushi platter',
      price: '20.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-4.png'
    },
    {
      title: 'Veg biryani',
      price: '29.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-5.png'
    },
    {
      title: 'Mutton curry',
      price: '24.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-6.png'
    }
  ],
  sides: [
    {
      title: 'Fries',
      price: '6.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-1.png'
    },
    {
      title: 'Veggies',
      price: '8.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-2.png'
    },
    {
      title: 'Chips',
      price: '7.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-3.png'
    },
    {
      title: 'Mash',
      price: '9.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-4.png'
    },
    {
      title: 'Salad',
      price: '4.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-5.png'
    },
    {
      title: 'Slaw',
      price: '10.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-6.png'
    }
  ],
  desserts: [
    {
      title: 'Tang yuan',
      price: '16.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-1.png'
    },
    {
      title: 'Egg custard',
      price: '26.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-2.png'
    },
    {
      title: 'Zabaione',
      price: '21.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-3.png'
    },
    {
      title: 'Almond soup',
      price: '30.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-4.png'
    },
    {
      title: 'Bomboloni',
      price: '28.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-5.png'
    },
    {
      title: 'Tiramisu',
      price: '22.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-6.png'
    }
  ]
}
</script>

