<template>
  <div class="daily-offer">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6">
          <!-- Daily Offer Image Start -->
          <div class="daily-offer-image">
            <div class="daily-offer-img">
              <figure>
                <img src="/images/daily-offer-image.png" alt="Daily Offer">
              </figure>
            </div>

            <!-- Delicious Burger Box Start -->
            <div class="delicious-burger-box">
              <div class="delicious-burger-title">
                <h3>Delicious Burger</h3>
              </div>
              <div class="delicious-burger-rating">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </div>
              <div class="delicious-burger-list">
                <ul>
                  <li>tomato sauces</li>
                  <li>vegitables</li>
                  <li>lettuce</li>
                  <li>cheese slice</li>
                </ul>
              </div>
            </div>
            <!-- Delicious Burger Box End -->
          </div>
          <!-- Daily Offer Image End -->
        </div>

        <div class="col-lg-6">
          <!-- Daily Offer Content Start -->
          <div class="daily-offer-content">
            <!-- Section Title Start -->
            <div class="section-title">
              <h3 class="wow fadeInUp">our daily offers</h3>
              <h2 class="text-anime-style-2" data-cursor="-opaque">taste the savings with our <span>daily specials</span></h2>
              <p class="wow fadeInUp" data-wow-delay="0.2s">Every day is an opportunity to enjoy your favorites at a discounted price. Explore our daily rotating specials and indulge in flavorful meals at a fraction of the cost.</p>
            </div>
            <!-- Section Title End -->

            <!-- Daily Offer List Start -->
            <div class="daily-offer-list wow fadeInUp" data-wow-delay="0.4s">
              <ul>
                <li>seasonal & locally sourced ingredients</li>
                <li>vegetarian & dietary-friendly options</li>
                <li>exquisite pairings & unique flavors</li>
              </ul>
            </div>
            <!-- Daily Offer List End -->

            <!-- Daily Offer Button Start -->
            <div class="daily-offer-btn wow fadeInUp" data-wow-delay="0.6s">
              <NuxtLink to="/contact" class="btn-default">book table</NuxtLink>
              <NuxtLink to="/menu" class="btn-default btn-highlighted">explore menu</NuxtLink>
            </div>
            <!-- Daily Offer Button End -->
          </div>
          <!-- Daily Offer Content End -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for this component as it uses static content
</script>

