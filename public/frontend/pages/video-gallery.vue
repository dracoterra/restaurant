<template>
  <div>
    <!-- Page Header Start -->
    <SectionsPageHeader title="Videos" />
    <!-- Page Header End -->

    <!-- Page Video Gallery Start -->
    <div class="page-video-gallery">
      <div class="container">
        <div class="row">
          <div 
            v-for="(video, index) in videos" 
            :key="video.id || index"
            class="col-lg-4 col-md-6"
          >
            <!-- image gallery start -->
            <div class="video-gallery-image wow fadeInUp" :data-wow-delay="`${index * 0.2}s`" data-cursor-text="Play">
              <a :href="video.url" class="popup-video">
                <figure>
                  <img :src="video.thumbnail" :alt="video.title">
                </figure>
              </a>
            </div>
            <!-- image gallery end -->
          </div>
        </div>
      </div>
    </div>
    <!-- Page Video Gallery End -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Video {
  id?: string
  url: string
  thumbnail: string
  title: string
}

const videos = ref<Video[]>([
  {
    id: '1',
    url: 'https://www.youtube.com/watch?v=Y-x0efG1seA',
    thumbnail: '/images/video-gallery-img-1.jpg',
    title: 'Video 1'
  },
  {
    id: '2',
    url: 'https://www.youtube.com/watch?v=Y-x0efG1seA',
    thumbnail: '/images/video-gallery-img-2.jpg',
    title: 'Video 2'
  },
  {
    id: '3',
    url: 'https://www.youtube.com/watch?v=Y-x0efG1seA',
    thumbnail: '/images/video-gallery-img-3.jpg',
    title: 'Video 3'
  },
  {
    id: '4',
    url: 'https://www.youtube.com/watch?v=Y-x0efG1seA',
    thumbnail: '/images/video-gallery-img-4.jpg',
    title: 'Video 4'
  },
  {
    id: '5',
    url: 'https://www.youtube.com/watch?v=Y-x0efG1seA',
    thumbnail: '/images/video-gallery-img-5.jpg',
    title: 'Video 5'
  },
  {
    id: '6',
    url: 'https://www.youtube.com/watch?v=Y-x0efG1seA',
    thumbnail: '/images/video-gallery-img-6.jpg',
    title: 'Video 6'
  }
])

onMounted(() => {
  useHead({
    title: 'Video Gallery - Restaurant',
    meta: [
      { name: 'description', content: 'Watch our restaurant videos' }
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

