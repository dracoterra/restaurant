<template>
  <ul class="navbar-nav mr-auto menu-skeleton" id="menu-skeleton">
    <li 
      v-for="(width, index) in skeletonWidths" 
      :key="index"
      class="nav-item skeleton-item"
    >
      <span class="skeleton-link" :style="{ width }"></span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Generar anchos aleatorios para hacer el skeleton más realista
const widths = ['60px', '70px', '80px', '90px', '100px', '110px']
const skeletonWidths = ref<string[]>([])

onMounted(() => {
  // Generar 5 anchos aleatorios una sola vez
  skeletonWidths.value = Array.from({ length: 5 }, () => 
    widths[Math.floor(Math.random() * widths.length)]
  )
})
</script>

<style scoped>
.menu-skeleton {
  display: inline-flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0;
}

.skeleton-item {
  position: relative;
  margin: 0;
}

.skeleton-link {
  display: block;
  height: 16px;
  margin: 12px 20px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 25%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.1) 75%
  );
  background-size: 200% 100%;
  border-radius: 2px;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  opacity: 0.6;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Responsive */
@media (max-width: 991px) {
  .menu-skeleton {
    flex-direction: column;
    width: 100%;
    align-items: flex-start;
  }
  
  .skeleton-item {
    width: 100%;
  }
  
  .skeleton-link {
    width: 150px !important;
    margin: 8px 0;
  }
}
</style>

