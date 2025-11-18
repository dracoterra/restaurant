<template>
  <div>
    <!-- Page Header Start -->
    <SectionsPageHeader title="Testimonials" />
    <!-- Page Header End -->

    <!-- Our Testimonials Page Start -->
    <div class="page-testimonials">
      <div class="container">
        <div class="row">
          <div 
            v-for="(testimonial, index) in testimonials" 
            :key="testimonial.id || index"
            class="col-lg-4 col-md-6"
          >
            <!-- Testimonial Box Item Start -->
            <div class="testimonial-box-item wow fadeInUp" :data-wow-delay="`${index * 0.2}s`">
              <div class="testimonial-rating">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </div>
              <div class="testimonial-box-content">
                <p>{{ testimonial.content }}</p>
              </div>
              <div class="client-author-image">
                <figure class="image-anime">
                  <img :src="testimonial.authorImage" :alt="testimonial.authorName">
                </figure>
              </div>
              <div class="client-author-content">
                <h3>{{ testimonial.authorName }}</h3>
                <p>{{ testimonial.authorPosition }}</p>
              </div>
            </div>
            <!-- Testimonial Box Item End -->
          </div>
        </div>
      </div>
    </div>
    <!-- Our Testimonials Page End -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePagesStore, type Page } from '~/stores/pages'

interface Testimonial {
  id?: string
  content: string
  authorName: string
  authorPosition?: string
  authorImage: string
}

const pagesStore = usePagesStore()
const page = ref<Page | null>(null)

const acf = computed(() => page.value?.acf?.homePageSections)

const testimonials = computed<Testimonial[]>(() => {
  // Si hay testimonials desde ACF, usarlos
  if (acf.value?.testimonials && Array.isArray(acf.value.testimonials) && acf.value.testimonials.length > 0) {
    return acf.value.testimonials.map((t: any) => ({
      id: t.id,
      content: t.content,
      authorName: t.authorName,
      authorPosition: t.authorPosition || '',
      authorImage: t.authorImage?.sourceUrl || t.authorImage?.url || '/images/author-1.jpg'
    }))
  }

  // Fallback a datos por defecto
  return defaultTestimonials.value
})

const defaultTestimonials = ref<Testimonial[]>([
  {
    id: '1',
    content: 'The food here was exceptional, especially their Butter Garlic Prawns! The ambiance was cozy and cheerful. I\'ll definitely visit again.',
    authorName: 'anshul gupta',
    authorPosition: 'food blogger',
    authorImage: '/images/client-1.jpg'
  },
  {
    id: '2',
    content: 'The staff was helpful, attentive, and friendly. We ordered Spicy Bites, which exceeded our expectations in both taste and presentation.',
    authorName: 'pooja sharma',
    authorPosition: 'lifestyle influencer',
    authorImage: '/images/client-2.jpg'
  },
  {
    id: '3',
    content: 'This restaurant serves delicious food with amazing presentation. The Fire Grill Platter was a big hit with my entire family and friends!',
    authorName: 'rahul kumar',
    authorPosition: 'food critic',
    authorImage: '/images/client-3.jpg'
  },
  {
    id: '4',
    content: 'From the moment we walked in, the ambiance was welcoming, and the service was top-notch. The dish was absolutely delicious, full of fresh flavors, and perfectly cooked.',
    authorName: 'wade l warren',
    authorPosition: 'developer',
    authorImage: '/images/author-1.jpg'
  },
  {
    id: '5',
    content: 'I especially loved how the staff took the time to explain the menu and suggest pairings for our meal. A truly memorable dining experience!',
    authorName: 'liya allen',
    authorPosition: 'manager',
    authorImage: '/images/author-2.jpg'
  },
  {
    id: '6',
    content: 'The quality of ingredients and the attention to detail in every dish is remarkable. Highly recommend this restaurant to everyone!',
    authorName: 'sarah jones',
    authorPosition: 'food enthusiast',
    authorImage: '/images/client-1.jpg'
  }
])

onMounted(async () => {
  try {
    // Intentar obtener testimonials desde la página home
    page.value = await pagesStore.fetchPageBySlug('home')
  } catch (error) {
    // Error loading page, usar testimonials por defecto
  }

  useHead({
    title: 'Testimonials - Restaurant',
    meta: [
      { name: 'description', content: 'Read what our customers say about us' }
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

