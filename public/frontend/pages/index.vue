<template>
  <div>
    <!-- Hero Section Start -->
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
                <h3 class="wow fadeInUp">{{ acf?.heroSubtitle || 'art of fine dining' }}</h3>
                <h1 class="text-anime-style-2" data-cursor="-opaque" v-html="acf?.heroTitle || 'Dining redefined with <span>every bite</span>'">
                </h1>
                <p class="wow fadeInUp" data-wow-delay="0.2s" v-if="acf?.heroDescription">
                  {{ acf.heroDescription }}
                </p>
                <p class="wow fadeInUp" data-wow-delay="0.2s" v-else>
                  Immerse yourself in a dining experience like no other, where every dish is a masterpiece of flavor, crafted with care and precision. From the freshest ingredients.
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
                    :src="acf?.heroMainImage?.url || '/images/hero-img.jpg'" 
                    :alt="acf?.heroMainImage?.alt || 'Hero'"
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
    <!-- Hero Section End -->

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
                <h3 class="wow fadeInUp">{{ acf?.aboutSubtitle || 'about us' }}</h3>
                <h2 class="text-anime-style-2" data-cursor="-opaque">
                  {{ acf?.aboutTitle || 'Our Commitment to Authenticity & excellence' }}
                </h2>
                <p class="wow fadeInUp" data-wow-delay="0.2s" v-if="acf?.aboutDescription">
                  {{ acf.aboutDescription }}
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
    <!-- About Us Section End -->

    <!-- Our Dishes Section Start -->
    <div class="our-dishes">
      <div class="container">
        <div class="row section-row">
          <div class="col-lg-12">
            <!-- Section Title Start -->
            <div class="section-title">
              <h3 class="wow fadeInUp">{{ acf?.dishesSubtitle || 'our main dishes' }}</h3>
              <h2 class="text-anime-style-2" data-cursor="-opaque">
                {{ acf?.dishesTitle || 'Satisfy your cravings with our signature mains' }}
              </h2>
            </div>
            <!-- Section Title End -->
          </div>
        </div>

        <div class="row">
          <div class="col-lg-3 col-md-6" v-for="(dish, index) in dishes" :key="index">
            <!-- Our Dish Item Start -->
            <div class="our-dish-item wow fadeInUp" :data-wow-delay="`${index * 0.2}s`">
              <div class="our-dish-img">
                <figure class="image-anime">
                  <img :src="dish.image" :alt="dish.title">
                </figure>
              </div>
              <div class="our-dish-content">
                <h3>{{ dish.title }}</h3>
                <p>{{ dish.description }}</p>
              </div>
            </div>
            <!-- Our Dish Item End -->
          </div>
        </div>

        <div class="row">
          <div class="col-lg-12">
            <!-- Section Footer Text Start -->
            <div class="section-footer-text wow fadeInUp" data-wow-delay="0.8s">
              <p>Hungry for Something Delicious? <NuxtLink to="/menu">View All Dishes!</NuxtLink></p>
            </div>
            <!-- Section Footer Text End -->
          </div>
        </div>
      </div>
    </div>
    <!-- Our Dishes Section End -->

    <!-- Daily Offer Section Start -->
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
    <!-- Daily Offer Section End -->

    <!-- Our Menu Section Start -->
    <div class="our-menu">
      <div class="container">
        <div class="row section-row">
          <div class="col-lg-12">
            <!-- Section Title Start -->
            <div class="section-title">
              <h3 class="wow fadeInUp">from our menu</h3>
              <h2 class="text-anime-style-2" data-cursor="-opaque">An Inspired Menu That <span>Blends Tradition</span></h2>
            </div>
            <!-- Section Title End -->
          </div>
        </div>

        <div class="row">
          <div class="col-lg-12">
            <!-- Our Menu Tab Start -->
            <div class="our-menu-tab">
              <!-- Sidebar Our Menu Nav start -->
              <div class="our-menu-tab-nav wow fadeInUp" data-wow-delay="0.2s">
                <ul class="nav nav-tabs" id="menuTab" role="tablist">
                  <li class="nav-item" role="presentation">
                    <button 
                      class="nav-link" 
                      :class="{ active: activeTab === 'appetizers' }"
                      @click="activeTab = 'appetizers'"
                      type="button"
                    >
                      appetizers
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button 
                      class="nav-link" 
                      :class="{ active: activeTab === 'maincourses' }"
                      @click="activeTab = 'maincourses'"
                      type="button"
                    >
                      main courses
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button 
                      class="nav-link" 
                      :class="{ active: activeTab === 'sides' }"
                      @click="activeTab = 'sides'"
                      type="button"
                    >
                      sides
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button 
                      class="nav-link" 
                      :class="{ active: activeTab === 'desserts' }"
                      @click="activeTab = 'desserts'"
                      type="button"
                    >
                      desserts
                    </button>
                  </li>
                </ul>
              </div>
              <!-- Sidebar Our Menu Nav End -->

              <!-- Menu Box Start -->
              <div class="tab-content">
                <!-- Appetizers Tab -->
                <div v-show="activeTab === 'appetizers'" class="tab-pane">
                  <div class="row align-items-center">
                    <div class="col-lg-12">
                      <div class="our-menu-list">
                        <div 
                          v-for="(item, index) in menuItems.appetizers" 
                          :key="index"
                          class="our-menu-item"
                        >
                          <div class="our-menu-image">
                            <figure>
                              <img :src="item.image" :alt="item.title">
                            </figure>
                          </div>
                          <div class="menu-item-body">
                            <div class="menu-item-title">
                              <h3>{{ item.title }}</h3>
                              <hr>
                              <span>${{ item.price }}</span>
                            </div>
                            <div class="menu-item-content">
                              <p>{{ item.description }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Main Courses Tab -->
                <div v-show="activeTab === 'maincourses'" class="tab-pane">
                  <div class="row align-items-center">
                    <div class="col-lg-12">
                      <div class="our-menu-list">
                        <div 
                          v-for="(item, index) in menuItems.maincourses" 
                          :key="index"
                          class="our-menu-item"
                        >
                          <div class="our-menu-image">
                            <figure>
                              <img :src="item.image" :alt="item.title">
                            </figure>
                          </div>
                          <div class="menu-item-body">
                            <div class="menu-item-title">
                              <h3>{{ item.title }}</h3>
                              <hr>
                              <span>${{ item.price }}</span>
                            </div>
                            <div class="menu-item-content">
                              <p>{{ item.description }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Sides Tab -->
                <div v-show="activeTab === 'sides'" class="tab-pane">
                  <div class="row align-items-center">
                    <div class="col-lg-12">
                      <div class="our-menu-list">
                        <div 
                          v-for="(item, index) in menuItems.sides" 
                          :key="index"
                          class="our-menu-item"
                        >
                          <div class="our-menu-image">
                            <figure>
                              <img :src="item.image" :alt="item.title">
                            </figure>
                          </div>
                          <div class="menu-item-body">
                            <div class="menu-item-title">
                              <h3>{{ item.title }}</h3>
                              <hr>
                              <span>${{ item.price }}</span>
                            </div>
                            <div class="menu-item-content">
                              <p>{{ item.description }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Desserts Tab -->
                <div v-show="activeTab === 'desserts'" class="tab-pane">
                  <div class="row align-items-center">
                    <div class="col-lg-12">
                      <div class="our-menu-list">
                        <div 
                          v-for="(item, index) in menuItems.desserts" 
                          :key="index"
                          class="our-menu-item"
                        >
                          <div class="our-menu-image">
                            <figure>
                              <img :src="item.image" :alt="item.title">
                            </figure>
                          </div>
                          <div class="menu-item-body">
                            <div class="menu-item-title">
                              <h3>{{ item.title }}</h3>
                              <hr>
                              <span>${{ item.price }}</span>
                            </div>
                            <div class="menu-item-content">
                              <p>{{ item.description }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Menu Box End -->
            </div>
            <!-- Our Menu Tab End -->
          </div>

          <div class="col-lg-12">
            <!-- Section Footer Text Start -->
            <div class="section-footer-text wow fadeInUp" data-wow-delay="0.4s">
              <p>Ready to Savor the Best? <NuxtLink to="/menu">Check Our Dishes!</NuxtLink></p>
            </div>
            <!-- Section Footer Text End -->
          </div>
        </div>
      </div>
    </div>
    <!-- Our Menu Section End -->

    <!-- Intro Video Section Start -->
    <div class="intro-video">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <!-- Intro Video Box Start -->
            <div class="intro-video-box">
              <div class="intro-bg-video">
                <video autoplay muted loop id="myVideo">
                  <source src="/assets/videos/spicyhunt-intro-bg-video.mp4" type="video/mp4">
                </video>
              </div>
              <!-- Video Play Button Start -->
              <div class="video-play-button">
                <a href="https://www.youtube.com/watch?v=Y-x0efG1seA" class="popup-video" data-cursor-text="Play">play</a>
              </div>
              <!-- Video Play Button End -->
            </div>
            <!-- Intro Video Box End -->
          </div>
        </div>
      </div>
    </div>
    <!-- Intro Video Section End -->

    <!-- Our Ingredients Section Start -->
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
    <!-- Our Ingredients Section End -->

    <!-- Our Testimonial Section Start -->
    <div class="our-testimonial parallaxie">
      <div class="container">
        <div class="row section-row">
          <div class="col-lg-12">
            <div class="section-title">
              <h3 class="wow fadeInUp">our testimonials</h3>
              <h2 class="text-anime-style-2" data-cursor="-opaque">real stories of memorable <span>meals and experiences</span></h2>
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
                            <img :src="testimonial.authorImage" :alt="testimonial.authorName">
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
    <!-- Our Testimonial Section End -->

    <!-- Our Blog Section Start -->
    <div class="our-blog">
      <div class="container">
        <div class="row section-row">
          <div class="col-lg-12">
            <div class="section-title">
              <h3 class="wow fadeInUp">Latest blog</h3>
              <h2 class="text-anime-style-2" data-cursor="-opaque">Explore our latest news <span>and updates</span></h2>
            </div>
          </div>
        </div>

        <div class="row">
          <div 
            v-for="(post, index) in blogPosts" 
            :key="post.id || index"
            class="col-lg-4 col-md-6"
          >
            <div class="post-item wow fadeInUp" :data-wow-delay="`${index * 0.2}s`">
              <div class="post-featured-image">
                <NuxtLink :to="`/insights/${post.slug}`" data-cursor-text="View">
                  <figure class="image-anime">
                    <img :src="post.featuredImage?.url || '/images/post-1.jpg'" :alt="post.title">
                  </figure>
                </NuxtLink>
              </div>
              <div class="blog-item-body">
                <div class="post-item-content">
                  <h3>
                    <NuxtLink :to="`/insights/${post.slug}`">{{ post.title }}</NuxtLink>
                  </h3>
                </div>
                <div class="blog-item-btn">
                  <NuxtLink :to="`/insights/${post.slug}`" class="readmore-btn">read more</NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Our Blog Section End -->

    <!-- Reserve Table Section Start -->
    <div class="reserve-table">
      <div class="container">
        <div class="row">
          <div class="col-lg-6">
            <div class="reserve-table-content">
              <div class="section-title">
                <h3 class="wow fadeInUp">reserve a table</h3>
                <h2 class="text-anime-style-2" data-cursor="-opaque">reserve now your table and <span>enjoy dining experience.</span></h2>
              </div>
              <div class="reserve-table-body wow fadeInUp" data-wow-delay="0.2s">
                <h3>open hours</h3>
                <ul>
                  <li>Mon - Thu <span>10:00 AM - 09:00 PM</span></li>
                  <li>Fri - Sat <span>09:00 AM - 10:00 PM</span></li>
                  <li>Sun <span>Closed</span></li>
                </ul>
              </div>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="reserve-table-form">
              <form @submit.prevent="handleReservation" class="wow fadeInUp">
                <div class="row">
                  <div class="form-group col-md-12 mb-4">
                    <label class="form-label">your name</label>
                    <input 
                      v-model="reservationForm.name" 
                      type="text" 
                      class="form-control" 
                      placeholder="e.g. John" 
                      required
                    >
                  </div>
                  <div class="form-group col-md-6 mb-4">
                    <label class="form-label">email address</label>
                    <input 
                      v-model="reservationForm.email" 
                      type="email" 
                      class="form-control" 
                      placeholder="e.g. John@example.com" 
                      required
                    >
                  </div>
                  <div class="form-group col-md-6 mb-4">
                    <label class="form-label">phone number</label>
                    <input 
                      v-model="reservationForm.phone" 
                      type="text" 
                      class="form-control" 
                      placeholder="e.g. + 123 456 8792" 
                      required
                    >
                  </div>
                  <div class="form-group col-md-4 mb-4">
                    <label class="form-label">date</label>
                    <input 
                      v-model="reservationForm.date" 
                      type="date" 
                      class="form-control" 
                      required
                    >
                  </div>
                  <div class="form-group col-md-4 mb-4">
                    <label class="form-label">time</label>
                    <select v-model="reservationForm.time" class="form-control form-select" required>
                      <option value="" disabled selected>Select time</option>
                      <option value="6_30pm">06:30 PM</option>
                      <option value="7_00pm">07:00 PM</option>
                      <option value="7_30pm">07:30 PM</option>
                      <option value="8_00pm">08:00 PM</option>
                      <option value="8_30pm">08:30 PM</option>
                      <option value="9_00pm">09:00 PM</option>
                    </select>
                  </div>
                  <div class="form-group col-md-4 mb-4">
                    <label class="form-label">Number Of Person</label>
                    <select v-model="reservationForm.person" class="form-control form-select" required>
                      <option value="" disabled selected>number of person</option>
                      <option value="1_person">1 Person</option>
                      <option value="5_person">5 Person</option>
                      <option value="10_person">10 Person</option>
                      <option value="15_person">15 Person</option>
                      <option value="20_person">20 Person</option>
                    </select>
                  </div>
                  <div class="col-lg-12">
                    <div class="reserve-table-btn">
                      <button type="submit" class="btn-default">reserve now</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Reserve Table Section End -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { usePagesStore, type Page } from '~/stores/pages'
import { useInsightsStore } from '~/stores/insights'

// Stores
const pagesStore = usePagesStore()
const insightsStore = useInsightsStore()

// Meta tags
const page = ref<Page | null>(null)
const acf = computed(() => page.value?.acf?.homePageSections)

// Active tab para el menú
const activeTab = ref('appetizers')

// Dishes data
const dishes = ref([
  {
    title: 'soups',
    description: 'Warm, comforting, and full of flavor, our soups are the perfect start to any meal.',
    image: '/images/our-dish-image-1.jpg'
  },
  {
    title: 'salads',
    description: 'Refreshing, vibrant, and full of fresh flavors, our salads are crafted to senses.',
    image: '/images/our-dish-image-2.jpg'
  },
  {
    title: 'main dishes',
    description: 'Offering bold flavors and expertly crafted recipes that cater to every taste.',
    image: '/images/our-dish-image-3.jpg'
  },
  {
    title: 'appetizers',
    description: 'Our appetizers are the perfect way to begin your dining experience flavors.',
    image: '/images/our-dish-image-4.jpg'
  }
])

// Menu items data
const menuItems = ref({
  appetizers: [
    {
      title: 'chips & dip',
      price: '16.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-1.png'
    },
    {
      title: 'caprese salad',
      price: '12.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-2.png'
    },
    {
      title: 'garlic fries',
      price: '26.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-3.png'
    },
    {
      title: 'tortilla soup',
      price: '20.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-4.png'
    },
    {
      title: 'kale salad',
      price: '10.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-5.png'
    },
    {
      title: 'thai curry',
      price: '22.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-6.png'
    }
  ],
  maincourses: [
    {
      title: 'Fish fry',
      price: '26.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-1.png'
    },
    {
      title: 'Prawn masala',
      price: '28.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-2.png'
    },
    {
      title: 'Pasta alfredo',
      price: '30.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-3.png'
    },
    {
      title: 'Sushi platter',
      price: '20.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-4.png'
    },
    {
      title: 'Veg biryani',
      price: '29.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-5.png'
    },
    {
      title: 'Mutton curry',
      price: '24.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-6.png'
    }
  ],
  sides: [
    {
      title: 'Fries',
      price: '6.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-1.png'
    },
    {
      title: 'Veggies',
      price: '8.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-2.png'
    },
    {
      title: 'Chips',
      price: '7.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-3.png'
    },
    {
      title: 'Mash',
      price: '9.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-4.png'
    },
    {
      title: 'Salad',
      price: '4.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-5.png'
    },
    {
      title: 'Slaw',
      price: '10.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-6.png'
    }
  ],
  desserts: [
    {
      title: 'Tang yuan',
      price: '16.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-1.png'
    },
    {
      title: 'Egg custard',
      price: '26.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-2.png'
    },
    {
      title: 'Zabaione',
      price: '21.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-3.png'
    },
    {
      title: 'Almond soup',
      price: '30.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-4.png'
    },
    {
      title: 'Bomboloni',
      price: '28.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-5.png'
    },
    {
      title: 'Tiramisu',
      price: '22.00',
      description: 'A perfect pairing of crispy, freshly made chips and rich, flavorful dips that bring a burst of taste in every bite.',
      image: '/images/our-menu-image-6.png'
    }
  ]
})

// Testimonials data
const testimonials = ref([
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
])

// Blog posts (desde insights)
const blogPosts = computed(() => insightsStore.insights.slice(0, 3))

// Reservation form
const reservationForm = ref({
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  person: ''
})

// Refs
const testimonialSwiper = ref(null)

// Handle reservation form
const handleReservation = () => {
  // TODO: Implementar envío de formulario
  console.log('Reservation submitted:', reservationForm.value)
  alert('Reservation submitted! (This is a placeholder)')
}

// Initialize Swiper for testimonials
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

// Initialize counters
const initCounters = () => {
  if (process.client && (window as any).jQuery) {
    const $ = (window as any).jQuery
    if ($.fn.counterUp) {
      $('.counter').counterUp({
        delay: 10,
        time: 2000
      })
    }
  }
}

// Initialize video popup
const initVideoPopup = () => {
  if (process.client && (window as any).jQuery) {
    const $ = (window as any).jQuery
    if ($.fn.magnificPopup) {
      $('.popup-video').magnificPopup({
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false
      })
    }
  }
}

onMounted(async () => {
  try {
    // Obtener página Home y insights
    await Promise.all([
      pagesStore.fetchPageBySlug('home').catch(() => null).then(p => { page.value = p }),
      insightsStore.fetchInsights({ limit: 3 })
    ])
    
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
        title: 'Home - Restaurant',
        meta: [
          { name: 'description', content: acf.value?.heroDescription || 'Dining redefined with every bite' }
        ]
      })
    }
    
    // Inicializar animaciones y scripts cuando estén cargados
    if (process.client) {
      setTimeout(() => {
        // WOW animations
        if ((window as any).WOW) {
          new (window as any).WOW().init()
        }
        
        // Counters
        initCounters()
        
        // Video popup
        initVideoPopup()
        
        // Testimonial swiper
        initTestimonialSwiper()
      }, 500)
    }
  } catch (error) {
    console.error('Error loading home page:', error)
    useHead({
      title: 'Home - Restaurant',
      meta: [
        { name: 'description', content: 'Dining redefined with every bite' }
      ]
    })
  }
})
</script>
