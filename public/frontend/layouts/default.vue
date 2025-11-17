<template>
  <div>
    <ClientOnly>
      <template #default>
        <LayoutPreloader />
      </template>
      <template #fallback>
        <!-- Placeholder durante SSR -->
      </template>
    </ClientOnly>
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

