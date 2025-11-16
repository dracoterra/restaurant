<template>
  <div>
    <LayoutPreloader />
    <LayoutHeader />
    <main>
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
// Layout por defecto con Header, Footer y Preloader
</script>

