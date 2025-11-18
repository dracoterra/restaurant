<template>
  <div>
    <!-- Loading State -->
    <div v-if="pagesStore.loading" class="container py-5 text-center">
      <p>Cargando contenido...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="pagesStore.error" class="container py-5 text-center">
      <p class="text-danger">Error: {{ pagesStore.error }}</p>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Page Header Start -->
      <SectionsPageHeader :title="acf?.aboutContentSubtitle || 'About us'" />
      <!-- Page Header End -->

      <!-- About Us Section Start -->
      <div class="about-us">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6 order-lg-1 order-2">
              <!-- About Us Image Start -->
              <div class="about-us-image">
                <!-- About Us Img Start -->
                <div class="about-us-img">
                  <figure class="image-anime">
                    <img 
                      :src="acf?.aboutMainImage?.url || '/images/about-us-image.jpg'" 
                      :alt="acf?.aboutMainImage?.alt || 'About Us'"
                    >
                  </figure>
                </div>
                <!-- About Us Img End -->

                <!-- Company Experience Box Start -->
                <div class="company-experience" v-if="acf?.experienceYears || acf?.experienceText">
                  <div class="icon-box">
                    <img src="/images/icon-company-experience.svg" alt="Experience">
                  </div>
                  <div class="company-experience-content">
                    <h3>
                      <span class="counter">{{ acf?.experienceYears || 30 }}</span>
                      {{ acf?.experienceText || '+ years of experience' }}
                    </h3>
                  </div>
                </div>
                <!-- Company Experience Box End -->

                <!-- About Author Image Start -->
                <div class="about-author-img" v-if="acf?.aboutSecondaryImage">
                  <figure class="image-anime">
                    <img 
                      :src="acf.aboutSecondaryImage.url" 
                      :alt="acf.aboutSecondaryImage.alt || 'About Author'"
                    >
                  </figure>
                </div>
                <!-- About Author Image End -->
              </div>
              <!-- About Us Image End -->
            </div>

            <div class="col-lg-6 order-lg-2 order-1">
              <!-- About Us Content Start -->
              <div class="about-us-content">
                <!-- Section Title Start -->
                <div class="section-title">
                  <h3 class="wow fadeInUp">{{ acf?.aboutContentSubtitle || 'about us' }}</h3>
                  <h2 class="text-anime-style-2" data-cursor="-opaque">
                    {{ acf?.aboutContentTitle || 'Our Commitment to Authenticity & excellence' }}
                  </h2>
                  <p class="wow fadeInUp" data-wow-delay="0.2s" v-if="acf?.aboutContentDescription">
                    {{ acf.aboutContentDescription }}
                  </p>
                  <p class="wow fadeInUp" data-wow-delay="0.2s" v-else>
                    Every dish we create is a celebration of connection, crafted with passion and inspired by diverse flavors. Join us in an inviting space where every bite sparks joy and every moment becomes a cherished memory.
                  </p>
                </div>
                <!-- Section Title End -->

              <!-- About Content List Start -->
              <div class="about-content-list wow fadeInUp" data-wow-delay="0.4s">
                <ul>
                  <li>seasonal & locally sourced ingredients</li>
                  <li>vegetarian & dietary-friendly options</li>
                  <li>exquisite pairings & unique flavors</li>
                </ul>
              </div>
              <!-- About Content List End -->

              <!-- About Content Buttons Start -->
              <div class="about-content-btn wow fadeInUp" data-wow-delay="0.6s">
                <NuxtLink to="/contact" class="btn-default">order now</NuxtLink>
                <NuxtLink to="/contact" class="btn-default btn-highlighted">book a table</NuxtLink>
              </div>
              <!-- About Content Buttons End -->
            </div>
            <!-- About Us Content End -->
          </div>

          <div class="row">
            <div class="col-lg-12 order-3">
              <!-- About Detail Box Start -->
              <div class="about-detail-box">
                <!-- About Detail Item Start -->
                <div class="about-detail-item wow fadeInUp">
                  <div class="icon-box">
                    <img src="/images/icon-about-detail-1.svg" alt="Premium Dining">
                  </div>
                  <div class="about-detail-content">
                    <h3>premium dining</h3>
                    <p>It's very personal, and can only be a positive experience.</p>
                  </div>
                </div>
                <!-- About Detail Item End -->

                <!-- About Detail Item Start -->
                <div class="about-detail-item wow fadeInUp" data-wow-delay="0.2s">
                  <div class="icon-box">
                    <img src="/images/icon-about-detail-2.svg" alt="Abundant Flavors">
                  </div>
                  <div class="about-detail-content">
                    <h3>abundant flavors</h3>
                    <p>At secret recipe, we take immense pride in crafting.</p>
                  </div>
                </div>
                <!-- About Detail Item End -->

                <!-- About Detail Item Start -->
                <div class="about-detail-item wow fadeInUp" data-wow-delay="0.4s">
                  <div class="icon-box">
                    <img src="/images/icon-about-detail-3.svg" alt="Indigenous Meal">
                  </div>
                  <div class="about-detail-content">
                    <h3>indigenous meal</h3>
                    <p>With local ingredients, unique spins on traditional flavors.</p>
                  </div>
                </div>
                <!-- About Detail Item End -->
              </div>
              <!-- About Detail Box End -->
            </div>
          </div>
        </div>
      </div>
      <!-- About Us Section End -->

      <!-- Our Approach Section Start -->
      <div class="our-approach">
        <div class="container">
          <div class="row section-row">
            <div class="col-lg-12">
              <!-- Section Title Start -->
              <div class="section-title">
                <h3 class="wow fadeInUp">our approach</h3>
                <h2 class="text-anime-style-2" data-cursor="-opaque">
                  Delivering memorable dining <span>experiences</span>
                </h2>
              </div>
              <!-- Section Title End -->
            </div>
          </div>

          <div class="row">
            <div class="col-lg-12">
              <!-- Our Approch Tab Start -->
              <div class="our-approch-tab">
                <!-- Sidebar Our Approch Nav start -->
                <div class="our-approch-tab-nav wow fadeInUp" data-wow-delay="0.2s">
                  <ul class="nav nav-tabs" id="approchTab" role="tablist">
                    <li class="nav-item" role="presentation">
                      <button 
                        class="nav-link" 
                        :class="{ active: activeTab === 'mission' }"
                        @click="activeTab = 'mission'"
                        type="button"
                      >
                        our mission
                      </button>
                    </li>
                    <li class="nav-item" role="presentation">
                      <button 
                        class="nav-link" 
                        :class="{ active: activeTab === 'vision' }"
                        @click="activeTab = 'vision'"
                        type="button"
                      >
                        our vision
                      </button>
                    </li>
                    <li class="nav-item" role="presentation">
                      <button 
                        class="nav-link" 
                        :class="{ active: activeTab === 'value' }"
                        @click="activeTab = 'value'"
                        type="button"
                      >
                        our value
                      </button>
                    </li>
                  </ul>
                </div>
                <!-- Sidebar Our Approch Nav End -->

                <!-- Approch Box Start -->
                <div class="approch-box tab-content" id="approchTabContent">
                  <!-- Mission Tab -->
                  <div v-show="activeTab === 'mission'" class="approch-item">
                    <div class="row align-items-center">
                      <div class="col-lg-6">
                        <div class="approch-tab-content">
                          <div class="section-title">
                            <h3 class="wow fadeInUp">{{ acf?.missionTitle || 'our mission' }}</h3>
                            <h2 class="text-anime-style-2" data-cursor="-opaque">
                              {{ acf?.missionHeading || 'creating moments around flavor' }}
                            </h2>
                            <p class="wow fadeInUp" data-wow-delay="0.2s" v-if="acf?.missionContent" v-html="acf.missionContent"></p>
                            <p class="wow fadeInUp" data-wow-delay="0.2s" v-else>
                              At SpicyHunt, our vision is to redefine the dining experience by bringing people together over authentic, flavorful meals crafted with love and passion. We aim to be a beacon of culinary excellence, where every dish tells a story of tradition, innovation, and uncompromising quality.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-6" v-if="acf?.missionImage">
                        <div class="approch-tab-image">
                          <figure class="image-anime">
                            <img 
                              :src="acf.missionImage.url" 
                              :alt="acf.missionImage.alt || 'Mission'"
                            >
                          </figure>
                        </div>
                      </div>
                      <div class="col-lg-6" v-else>
                        <div class="approch-tab-image">
                          <figure class="image-anime">
                            <img src="/images/our-mission-img.jpg" alt="Mission">
                          </figure>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Vision Tab -->
                  <div v-show="activeTab === 'vision'" class="approch-item">
                    <div class="row align-items-center">
                      <div class="col-lg-6">
                        <div class="approch-tab-content">
                          <div class="section-title">
                            <h3 class="wow fadeInUp">{{ acf?.visionTitle || 'our vision' }}</h3>
                            <h2 class="text-anime-style-2" data-cursor="-opaque">
                              {{ acf?.visionHeading || 'shaping the future of dining' }}
                            </h2>
                            <p class="wow fadeInUp" data-wow-delay="0.2s" v-if="acf?.visionContent" v-html="acf.visionContent"></p>
                            <p class="wow fadeInUp" data-wow-delay="0.2s" v-else>
                              We envision a world where every meal is an opportunity to connect, celebrate, and create lasting memories. Our goal is to become the most trusted name in culinary excellence, known for our commitment to quality, sustainability, and the art of fine dining.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-6" v-if="acf?.visionImage">
                        <div class="approch-tab-image">
                          <figure class="image-anime">
                            <img 
                              :src="acf.visionImage.url" 
                              :alt="acf.visionImage.alt || 'Vision'"
                            >
                          </figure>
                        </div>
                      </div>
                      <div class="col-lg-6" v-else>
                        <div class="approch-tab-image">
                          <figure class="image-anime">
                            <img src="/images/our-vision-img.jpg" alt="Vision">
                          </figure>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Value Tab -->
                  <div v-show="activeTab === 'value'" class="approch-item">
                    <div class="row align-items-center">
                      <div class="col-lg-6">
                        <div class="approch-tab-content">
                          <div class="section-title">
                            <h3 class="wow fadeInUp">{{ acf?.valueTitle || 'our value' }}</h3>
                            <h2 class="text-anime-style-2" data-cursor="-opaque">
                              {{ acf?.valueHeading || 'what drives us forward' }}
                            </h2>
                            <p class="wow fadeInUp" data-wow-delay="0.2s" v-if="acf?.valueContent" v-html="acf.valueContent"></p>
                            <p class="wow fadeInUp" data-wow-delay="0.2s" v-else>
                              Our values are the foundation of everything we do. We believe in authenticity, respect for ingredients, and creating experiences that matter. Every decision we make is guided by our commitment to excellence and our passion for bringing people together through food.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-6" v-if="acf?.valueImage">
                        <div class="approch-tab-image">
                          <figure class="image-anime">
                            <img 
                              :src="acf.valueImage.url" 
                              :alt="acf.valueImage.alt || 'Value'"
                            >
                          </figure>
                        </div>
                      </div>
                      <div class="col-lg-6" v-else>
                        <div class="approch-tab-image">
                          <figure class="image-anime">
                            <img src="/images/our-value-img.jpg" alt="Value">
                          </figure>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Approch Box End -->
              </div>
              <!-- Our Approch Tab End -->
            </div>
          </div>
        </div>
      </div>
      <!-- Our Approach Section End -->
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePagesStore, type Page } from '~/stores/pages'

// Meta tags
const pagesStore = usePagesStore()
const page = ref<Page | null>(null)
const activeTab = ref('mission')

// Computed para obtener campos ACF
const acf = computed(() => page.value?.acf?.aboutPageSections)

onMounted(async () => {
  try {
    // Obtener página por slug
    page.value = await pagesStore.fetchPageBySlug('about')
    
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
        title: 'About Us - Restaurant',
        meta: [
          { name: 'description', content: 'Learn about our commitment to authenticity and excellence' }
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
    // Error loading page
  }
})
</script>

