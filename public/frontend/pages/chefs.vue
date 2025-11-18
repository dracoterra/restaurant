<template>
  <div>
    <!-- Page Header Start -->
    <SectionsPageHeader title="Our Chefs" />
    <!-- Page Header End -->

    <!-- Page Team Start -->
    <div class="page-team">
      <div class="container">
        <div class="row">
          <div 
            v-for="(chef, index) in chefs" 
            :key="chef.id || index"
            class="col-lg-3 col-md-6"
          >
            <!-- Team Member Item Start -->
            <div class="team-item wow fadeInUp" :data-wow-delay="`${index * 0.2}s`">
              <!-- team Image Start -->
              <div class="team-image">
                <NuxtLink :to="`/chefs/${chef.slug || chef.id}`" data-cursor-text="View">
                  <figure class="image-anime">
                    <img :src="chef.image" :alt="chef.name">
                  </figure>
                </NuxtLink>
              </div>
              <!-- team Image End -->
        
              <!-- Team Body Start -->
              <div class="team-body">
                <!-- Team Content Start -->
                <div class="team-content">
                  <h3>
                    <NuxtLink :to="`/chefs/${chef.slug || chef.id}`">{{ chef.name }}</NuxtLink>
                  </h3>
                  <p>{{ chef.position }}</p>
                </div>
                <!-- Team Content End -->

                <!-- Team Social List Start -->
                <div class="team-social-list" v-if="chef.social">
                  <ul>
                    <li v-if="chef.social.dribbble">
                      <a :href="chef.social.dribbble" target="_blank" rel="noopener">
                        <i class="fa-brands fa-dribbble"></i>
                      </a>
                    </li>
                    <li v-if="chef.social.facebook">
                      <a :href="chef.social.facebook" target="_blank" rel="noopener">
                        <i class="fa-brands fa-facebook-f"></i>
                      </a>
                    </li>
                    <li v-if="chef.social.instagram">
                      <a :href="chef.social.instagram" target="_blank" rel="noopener">
                        <i class="fa-brands fa-instagram"></i>
                      </a>
                    </li>
                  </ul>
                </div>
                <!-- Team Social List End -->
              </div>
              <!-- Team Body End -->
            </div>
            <!-- Team Member Item End -->
          </div>
        </div>
      </div>
    </div>
    <!-- Page Team End -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Chef {
  id?: string
  slug?: string
  name: string
  position: string
  image: string
  social?: {
    dribbble?: string
    facebook?: string
    instagram?: string
  }
}

const chefs = ref<Chef[]>([
  {
    id: '1',
    name: 'sophia martinez',
    position: 'executive chef',
    image: '/images/team-1.jpg',
    social: {
      dribbble: '#',
      facebook: '#',
      instagram: '#'
    }
  },
  {
    id: '2',
    name: 'liam patel',
    position: 'sous chef',
    image: '/images/team-2.jpg',
    social: {
      dribbble: '#',
      facebook: '#',
      instagram: '#'
    }
  },
  {
    id: '3',
    name: 'isabella carter',
    position: 'pastry chef',
    image: '/images/team-3.jpg',
    social: {
      dribbble: '#',
      facebook: '#',
      instagram: '#'
    }
  },
  {
    id: '4',
    name: 'ethan johnson',
    position: 'restaurant manager',
    image: '/images/team-4.jpg',
    social: {
      dribbble: '#',
      facebook: '#',
      instagram: '#'
    }
  },
  {
    id: '5',
    name: 'oliver bennett',
    position: 'executive chef',
    image: '/images/team-5.jpg',
    social: {
      dribbble: '#',
      facebook: '#',
      instagram: '#'
    }
  },
  {
    id: '6',
    name: 'james anderson',
    position: 'operations manager',
    image: '/images/team-6.jpg',
    social: {
      dribbble: '#',
      facebook: '#',
      instagram: '#'
    }
  }
])

onMounted(() => {
  useHead({
    title: 'Our Chefs - Restaurant',
    meta: [
      { name: 'description', content: 'Meet our talented team of chefs' }
    ]
  })

  if (process.client) {
    setTimeout(() => {
      if ((window as any).WOW) {
        new (window as any).WOW().init()
      }
    }, 500)
  }
})
</script>

