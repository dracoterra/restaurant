<template>
  <div style="min-height: 100vh; background: white !important; color: black !important; padding: 20px; position: relative; z-index: 9999;">
    <h1 style="color: black !important;">Layout Simple - Si ves esto, Vue funciona</h1>
    <slot />
  </div>
</template>

<script setup lang="ts">
// Layout simple sin SSR
</script>

<style scoped>
div {
  background: white !important;
  color: black !important;
}
</style>

