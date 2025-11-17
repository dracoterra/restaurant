<template>
  <div class="our-ingredients">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6 order-lg-1 order-2">
          <!-- Our Ingredients Image Start -->
          <div class="our-ingredients-image">
            <div class="our-ingredients-img">
              <figure>
                <img src="/images/our-ingredients-image.png" alt="Our Ingredients">
              </figure>
            </div>

            <!-- Happy Customer Box Start -->
            <div class="happy-customer-box">
              <div class="happy-customer-content">
                <h3><span class="counter">620</span>+ exclusive</h3>
                <p>happy customer</p>
              </div>
              <div class="happy-customer-images">
                <div class="customer-image">
                  <figure class="image-anime">
                    <img src="/images/happy-customer-img-1.jpg" alt="Customer">
                  </figure>
                </div>
                <div class="customer-image">
                  <figure class="image-anime">
                    <img src="/images/happy-customer-img-2.jpg" alt="Customer">
                  </figure>
                </div>
                <div class="customer-image">
                  <figure class="image-anime">
                    <img src="/images/happy-customer-img-3.jpg" alt="Customer">
                  </figure>
                </div>
                <div class="customer-image add-more">
                  <i class="fa-solid fa-plus"></i>
                </div>
              </div>
            </div>
            <!-- Happy Customer Box End -->
          </div>
          <!-- Our Ingredients Image End -->
        </div>

        <div class="col-lg-6 order-lg-2 order-1">
          <!-- Our Ingredients Content Start -->
          <div class="our-ingredients-content">
            <div class="section-title">
              <h3 class="wow fadeInUp">our ingredients</h3>
              <h2 class="text-anime-style-2" data-cursor="-opaque">Crafting Dishes with <span>freshest Flavors</span></h2>
              <p class="wow fadeInUp" data-wow-delay="0.2s">We take pride in using only the freshest, hand-picked ingredients that are free from preservatives and artificial additives. Taste the difference with every bite as we serve dishes made from nature's finest.</p>
            </div>

            <div class="our-ingredients-list wow fadeInUp" data-wow-delay="0.4s">
              <div class="ingredients-list-item">
                <div class="icon-box">
                  <img src="/images/icon-ingredients-list-1.svg" alt="Best Qualities">
                </div>
                <div class="ingredients-list-content">
                  <h3>best qualities</h3>
                </div>
              </div>
              <div class="ingredients-list-item">
                <div class="icon-box">
                  <img src="/images/icon-ingredients-list-2.svg" alt="Discount System">
                </div>
                <div class="ingredients-list-content">
                  <h3>discount system</h3>
                </div>
              </div>
              <div class="ingredients-list-item">
                <div class="icon-box">
                  <img src="/images/icon-ingredients-list-3.svg" alt="First Delivery">
                </div>
                <div class="ingredients-list-content">
                  <h3>first delivery</h3>
                </div>
              </div>
            </div>

            <div class="our-ingredients-btn wow fadeInUp" data-wow-delay="0.6s">
              <NuxtLink to="/contact" class="btn-default">book table</NuxtLink>
            </div>
          </div>
          <!-- Our Ingredients Content End -->
        </div>

        <div class="col-lg-12 order-3">
          <!-- Ingredient Counter List Start -->
          <div class="ingredient-counter-list">
            <div class="ingredient-counter-item">
              <div class="icon-box">
                <img src="/images/icon-ingredient-counter-1.svg" alt="Chefs">
              </div>
              <div class="ingredient-counter-content">
                <h2><span class="counter">309</span></h2>
                <p>Professional chefs</p>
              </div>
            </div>
            <div class="ingredient-counter-item">
              <div class="icon-box">
                <img src="/images/icon-ingredient-counter-2.svg" alt="Food Items">
              </div>
              <div class="ingredient-counter-content">
                <h2><span class="counter">453</span></h2>
                <p>Items of food</p>
              </div>
            </div>
            <div class="ingredient-counter-item">
              <div class="icon-box">
                <img src="/images/icon-ingredient-counter-3.svg" alt="Experience">
              </div>
              <div class="ingredient-counter-content">
                <h2><span class="counter">25</span>+</h2>
                <p>Years of experience</p>
              </div>
            </div>
            <div class="ingredient-counter-item">
              <div class="icon-box">
                <img src="/images/icon-ingredient-counter-4.svg" alt="Clients">
              </div>
              <div class="ingredient-counter-content">
                <h2><span class="counter">300</span>+</h2>
                <p>Satisfied clients</p>
              </div>
            </div>
          </div>
          <!-- Ingredient Counter List End -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for this component
</script>

