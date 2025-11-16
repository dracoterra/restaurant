<template>
  <div>
    <!-- Page Header Start -->
    <SectionsPageHeader title="About us" />
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
                  <img src="/images/about-us-image.jpg" alt="About Us">
                </figure>
              </div>
              <!-- About Us Img End -->

              <!-- Company Experience Box Start -->
              <div class="company-experience">
                <div class="icon-box">
                  <img src="/images/icon-company-experience.svg" alt="Experience">
                </div>
                <div class="company-experience-content">
                  <h3><span class="counter">30</span>+ years of experience</h3>
                </div>
              </div>
              <!-- Company Experience Box End -->

              <!-- About Author Image Start -->
              <div class="about-author-img">
                <figure class="image-anime">
                  <img src="/images/about-us-img-2.jpg" alt="About Author">
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
                <h3 class="wow fadeInUp">about us</h3>
                <h2 class="text-anime-style-2" data-cursor="-opaque">
                  Our Commitment to Authenticity & <span>excellence</span>
                </h2>
                <p class="wow fadeInUp" data-wow-delay="0.2s">
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
                          <h3 class="wow fadeInUp">our mission</h3>
                          <h2 class="text-anime-style-2" data-cursor="-opaque">creating moments around flavor</h2>
                          <p class="wow fadeInUp" data-wow-delay="0.2s">
                            At SpicyHunt, our vision is to redefine the dining experience by bringing people together over authentic, flavorful meals crafted with love and passion. We aim to be a beacon of culinary excellence, where every dish tells a story of tradition, innovation, and uncompromising quality.
                          </p>
                        </div>
                        <div class="approch-tab-content-list wow fadeInUp" data-wow-delay="0.4s">
                          <ul>
                            <li>Delivering unforgettable flavors with every dish we serve.</li>
                            <li>Creating a welcoming space where food connects hearts.</li>
                            <li>Committed to quality, innovation, and exceptional service.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="approch-tab-image">
                        <figure class="image-anime">
                          <img src="/images/approch-tab-img-1.jpg" alt="Mission">
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
                          <h3 class="wow fadeInUp">our vision</h3>
                          <h2 class="text-anime-style-2" data-cursor="-opaque">shaping the future of dining</h2>
                          <p class="wow fadeInUp" data-wow-delay="0.2s">
                            We envision a world where every meal is an opportunity to connect, celebrate, and create lasting memories. Our goal is to become the most trusted name in culinary excellence, known for our commitment to quality, sustainability, and the art of fine dining.
                          </p>
                        </div>
                        <div class="approch-tab-content-list wow fadeInUp" data-wow-delay="0.4s">
                          <ul>
                            <li>Leading innovation in culinary experiences.</li>
                            <li>Building a community around exceptional food.</li>
                            <li>Setting new standards for restaurant excellence.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="approch-tab-image">
                        <figure class="image-anime">
                          <img src="/images/approch-tab-img-2.jpg" alt="Vision">
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
                          <h3 class="wow fadeInUp">our value</h3>
                          <h2 class="text-anime-style-2" data-cursor="-opaque">what drives us forward</h2>
                          <p class="wow fadeInUp" data-wow-delay="0.2s">
                            Our values are the foundation of everything we do. We believe in authenticity, respect for ingredients, and creating experiences that matter. Every decision we make is guided by our commitment to excellence and our passion for bringing people together through food.
                          </p>
                        </div>
                        <div class="approch-tab-content-list wow fadeInUp" data-wow-delay="0.4s">
                          <ul>
                            <li>Authenticity in every dish we create.</li>
                            <li>Respect for ingredients and traditions.</li>
                            <li>Excellence in service and experience.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="approch-tab-image">
                        <figure class="image-anime">
                          <img src="/images/approch-tab-img-3.jpg" alt="Value">
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Meta tags
useHead({
  title: 'About Us - Restaurant',
  meta: [
    { name: 'description', content: 'Learn about our commitment to authenticity and excellence' }
  ]
})

const activeTab = ref('mission')

onMounted(() => {
  // Inicializar animaciones
  if (process.client) {
    setTimeout(() => {
      if ((window as any).WOW) {
        new (window as any).WOW().init()
      }
    }, 500)
  }
})
</script>

