<template>
  <div>
    <!-- Page Header Start -->
    <SectionsPageHeader title="page not found" />
    <!-- Page Header End -->

    <!-- error section start -->
    <div class="error-page">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="error-page-image wow fadeInUp">
              <img src="/images/404-error-img.png" alt="404 Error">
            </div>
            <div class="error-page-content">
              <div class="section-title">
                <h2 class="text-anime-style-2" data-cursor="-opaque">Oops! page not found</h2>
              </div>
              <div class="error-page-content-body">
                <p class="wow fadeInUp" data-wow-delay="0.25s">Sorry, We can't find the page you're looking.</p>
                <NuxtLink class="btn-default wow fadeInUp" data-wow-delay="0.5s" to="/">
                  <span>back to home</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- error section end -->
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  useHead({
    title: '404 - Page Not Found',
    meta: [
      { name: 'description', content: 'Page not found' }
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

