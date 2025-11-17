<template>
  <ClientOnly>
    <div class="preloader" v-if="isLoading">
      <div class="loading-container">
        <div class="loading"></div>
        <div id="loading-icon">
          <img src="/images/loader.svg" alt="Loading">
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isLoading = ref(true)

onMounted(() => {
  // Simular carga inicial
  setTimeout(() => {
    isLoading.value = false
  }, 600)
})
</script>

