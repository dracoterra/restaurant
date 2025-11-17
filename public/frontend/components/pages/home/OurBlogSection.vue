<template>
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
          v-for="(post, index) in posts" 
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
</template>

<script setup lang="ts">
interface Post {
  id?: string
  title: string
  slug: string
  featuredImage?: {
    url: string
    alt?: string
  }
}

interface Props {
  posts?: Post[]
}

withDefaults(defineProps<Props>(), {
  posts: () => []
})
</script>

