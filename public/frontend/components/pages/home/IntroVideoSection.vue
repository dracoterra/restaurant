<template>
  <div class="intro-video" v-if="videoUrl || videoBg">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-12">
          <!-- Intro Video Box Start -->
          <div class="intro-video-box">
            <div class="intro-bg-video" v-if="videoBg">
              <video autoplay muted loop id="myVideo">
                <source :src="videoBg" type="video/mp4">
              </video>
            </div>
            <div class="intro-bg-video" v-else>
              <video autoplay muted loop id="myVideo">
                <source src="/assets/videos/spicyhunt-intro-bg-video.mp4" type="video/mp4">
              </video>
            </div>
            <!-- Video Play Button Start -->
            <div class="video-play-button" v-if="videoUrl">
              <a :href="videoUrl" class="popup-video" data-cursor-text="Play">play</a>
            </div>
            <div class="video-play-button" v-else>
              <a href="https://www.youtube.com/watch?v=Y-x0efG1seA" class="popup-video" data-cursor-text="Play">play</a>
            </div>
            <!-- Video Play Button End -->
          </div>
          <!-- Intro Video Box End -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  videoBg?: string | null
  videoUrl?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  videoBg: null,
  videoUrl: null
})
</script>

