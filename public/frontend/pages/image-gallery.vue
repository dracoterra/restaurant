<template>
  <div>
    <!-- Page Header Start -->
    <SectionsPageHeader title="gallery" />
    <!-- Page Header End -->

    <!-- Photo Gallery Section Start -->
    <div class="page-gallery">
      <div class="container">
        <div class="row gallery-items page-gallery-box">
          <div 
            v-for="(image, index) in galleryImages" 
            :key="image.id || index"
            class="col-lg-4 col-6"
          >
            <!-- image gallery start -->
            <div class="photo-gallery wow fadeInUp" :data-wow-delay="`${index * 0.2}s`">
              <a :href="image.url" data-cursor-text="View">
                <figure class="image-anime">
                  <img :src="image.thumbnail || image.url" :alt="image.alt">
                </figure>
              </a>
            </div>
            <!-- image gallery end -->
          </div>
        </div>
      </div>
    </div>
    <!-- Photo Gallery Section End -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface GalleryImage {
  id?: string
  url: string
  thumbnail?: string
  alt: string
}

const galleryImages = ref<GalleryImage[]>([
  { id: '1', url: '/images/gallery-1.jpg', alt: 'Gallery Image 1' },
  { id: '2', url: '/images/gallery-2.jpg', alt: 'Gallery Image 2' },
  { id: '3', url: '/images/gallery-3.jpg', alt: 'Gallery Image 3' },
  { id: '4', url: '/images/gallery-4.jpg', alt: 'Gallery Image 4' },
  { id: '5', url: '/images/gallery-5.jpg', alt: 'Gallery Image 5' },
  { id: '6', url: '/images/gallery-6.jpg', alt: 'Gallery Image 6' },
  { id: '7', url: '/images/gallery-7.jpg', alt: 'Gallery Image 7' },
  { id: '8', url: '/images/gallery-8.jpg', alt: 'Gallery Image 8' },
  { id: '9', url: '/images/gallery-9.jpg', alt: 'Gallery Image 9' }
])

onMounted(() => {
  useHead({
    title: 'Image Gallery - Restaurant',
    meta: [
      { name: 'description', content: 'View our restaurant gallery' }
    ]
  })

  if (process.client) {
    setTimeout(() => {
      if ((window as any).WOW) {
        new (window as any).WOW().init()
      }
      
      // Inicializar magnific popup para galería
      if ((window as any).jQuery && (window as any).jQuery.fn.magnificPopup) {
        const $ = (window as any).jQuery
        $('.gallery-items').magnificPopup({
          delegate: 'a',
          type: 'image',
          closeOnContentClick: false,
          closeBtnInside: false,
          mainClass: 'mfp-with-zoom',
          image: {
            verticalFit: true
          },
          gallery: {
            enabled: true
          },
          zoom: {
            enabled: true,
            duration: 300
          }
        })
      }
    }, 500)
  }
})
</script>

