<template>
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
              <h3 class="wow fadeInUp">{{ subtitle || 'about us' }}</h3>
              <h2 class="text-anime-style-2" data-cursor="-opaque">
                {{ title || 'Our Commitment to Authenticity & excellence' }}
              </h2>
              <p class="wow fadeInUp" data-wow-delay="0.2s">
                {{ description || 'Every dish we create is a celebration of connection, crafted with passion and inspired by diverse flavors. Join us in an inviting space where every bite sparks joy and every moment becomes a cherished memory.' }}
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
              <NuxtLink to="/about" class="btn-default btn-highlighted">read more</NuxtLink>
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
</template>

<script setup lang="ts">
interface Props {
  subtitle?: string
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  subtitle: 'about us',
  title: 'Our Commitment to Authenticity & excellence',
  description: 'Every dish we create is a celebration of connection, crafted with passion and inspired by diverse flavors. Join us in an inviting space where every bite sparks joy and every moment becomes a cherished memory.'
})
</script>

