<template>
  <div class="our-testimonial parallaxie">
    <div class="container">
      <div class="row section-row">
        <div class="col-lg-12">
          <div class="section-title" v-if="subtitle || title">
            <h3 class="wow fadeInUp" v-if="subtitle">{{ subtitle }}</h3>
            <h3 class="wow fadeInUp" v-else>our testimonials</h3>
            <h2 class="text-anime-style-2" data-cursor="-opaque" v-if="title">
              <span v-html="formatTitle(title)"></span>
            </h2>
            <h2 class="text-anime-style-2" data-cursor="-opaque" v-else>real stories of memorable <span>meals and experiences</span></h2>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <!-- Testimonial Slider Start -->
          <div class="testimonial-slider">
            <div class="swiper" ref="testimonialSwiper">
              <div class="swiper-wrapper" data-cursor-text="Drag">
                <div 
                  v-for="(testimonial, index) in testimonials" 
                  :key="index"
                  class="swiper-slide"
                >
                  <div class="testimonial-item">
                    <div class="testimonial-quote">
                      <img src="/images/testimonial-quote.svg" alt="Quote">
                    </div>
                    <div class="testimonial-content">
                      <p>{{ testimonial.content }}</p>
                    </div>
                    <div class="author-info">
                      <div class="author-image">
                        <figure class="image-anime">
                          <img :src="getAuthorImageUrl(testimonial.authorImage)" :alt="testimonial.authorName">
                        </figure>
                      </div>
                      <div class="author-content">
                        <h3>{{ testimonial.authorName }}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="testimonial-btn">
                <div class="testimonial-btn-prev"></div>
                <div class="testimonial-btn-next"></div>
              </div>
            </div>
          </div>
          <!-- Testimonial Slider End -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

interface Testimonial {
  content: string
  authorName: string
  authorImage: string | { url: string; alt?: string }
}

interface Props {
  subtitle?: string
  title?: string
  testimonials?: Testimonial[]
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: '',
  title: '',
  testimonials: () => [
    {
      content: 'From the moment we walked in, the ambiance was welcoming, and the service was top-notch. The dish was absolutely delicious, full of fresh flavors, and perfectly cooked. I especially loved how the staff took the time to explain the menu and suggest pairings for our meal.',
      authorName: 'wade l warren, developer',
      authorImage: '/images/author-1.jpg'
    },
    {
      content: 'From the moment we walked in, the ambiance was welcoming, and the service was top-notch. The dish was absolutely delicious, full of fresh flavors, and perfectly cooked. I especially loved how the staff took the time to explain the menu and suggest pairings for our meal.',
      authorName: 'liya allen, manager',
      authorImage: '/images/author-2.jpg'
    }
  ]
})

// Helper para formatear el título con spans
const formatTitle = (title: string) => {
  if (!title) return ''
  return title.replace(/\<span\>(.*?)\<\/span\>/gi, '<span>$1</span>')
}

// Helper para obtener la URL de la imagen del autor
const getAuthorImageUrl = (authorImage: string | { url: string; alt?: string } | undefined): string => {
  if (!authorImage) return '/images/author-1.jpg'
  if (typeof authorImage === 'string') return authorImage
  return authorImage.url || '/images/author-1.jpg'
}

const testimonialSwiper = ref<HTMLElement | null>(null)

const initTestimonialSwiper = () => {
  if (process.client && (window as any).Swiper) {
    nextTick(() => {
      const Swiper = (window as any).Swiper
      if (testimonialSwiper.value) {
        new Swiper(testimonialSwiper.value, {
          slidesPerView: 1,
          spaceBetween: 30,
          loop: true,
          navigation: {
            nextEl: '.testimonial-btn-next',
            prevEl: '.testimonial-btn-prev'
          }
        })
      }
    })
  }
}

onMounted(() => {
  if (process.client) {
    setTimeout(() => {
      initTestimonialSwiper()
    }, 500)
  }
})
</script>

