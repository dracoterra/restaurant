<template>
  <div class="hero hero-video">
    <!-- Video Start -->
    <div class="hero-bg-video">
      <video autoplay muted loop id="heroVideo">
        <source src="/assets/videos/spicyhunt-video.mp4" type="video/mp4">
      </video>
    </div>
    <!-- Video End -->
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6">
          <!-- Hero Content Start -->
          <div class="hero-content">
            <!-- Section Title Start -->
            <div class="section-title">
              <h3 class="wow fadeInUp">{{ subtitle || 'art of fine dining' }}</h3>
              <h1 class="text-anime-style-2" data-cursor="-opaque" v-html="title || 'Dining redefined with <span>every bite</span>'">
              </h1>
              <p class="wow fadeInUp" data-wow-delay="0.2s">
                {{ description || 'Immerse yourself in a dining experience like no other, where every dish is a masterpiece of flavor, crafted with care and precision. From the freshest ingredients.' }}
              </p>
            </div>
            <!-- Section Title End -->

            <!-- Hero Button Start -->
            <div class="hero-btn wow fadeInUp" data-wow-delay="0.4s">
              <NuxtLink to="/contact" class="btn-default">book a table</NuxtLink>
              <a href="#" class="download-app-btn">
                download app <i class="fa-brands fa-google-play"></i>
              </a>
            </div>
            <!-- Hero Button End -->
          </div>
          <!-- Hero Content End -->
        </div>

        <div class="col-lg-6">
          <!-- Hero Images Start -->
          <div class="hero-images">
            <!-- Hero Image Start -->
            <div class="hero-image">
              <figure class="image-anime">
                <img 
                  :src="mainImage?.url || '/images/hero-img.jpg'" 
                  :alt="mainImage?.alt || 'Hero'"
                >
              </figure>
            </div>
            <!-- Hero Image End -->

            <!-- Hero Circle Image Start -->
            <div class="hero-circle-img-1">
              <figure class="image-anime">
                <img src="/images/hero-circle-img-1.jpg" alt="Hero Circle 1">
              </figure>
            </div>
            <!-- Hero Circle Image End -->

            <!-- Hero Circle Image Start -->
            <div class="hero-circle-img-2">
              <figure class="image-anime">
                <img src="/images/hero-circle-img-2.jpg" alt="Hero Circle 2">
              </figure>
            </div>
            <!-- Hero Circle Image End -->
          </div>
          <!-- Hero Images End -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  subtitle?: string
  title?: string
  description?: string
  mainImage?: {
    url: string
    alt?: string
  }
}

withDefaults(defineProps<Props>(), {
  subtitle: 'art of fine dining',
  title: 'Dining redefined with <span>every bite</span>',
  description: 'Immerse yourself in a dining experience like no other, where every dish is a masterpiece of flavor, crafted with care and precision. From the freshest ingredients.'
})
</script>

