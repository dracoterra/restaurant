<template>
  <header class="main-header">
    <div class="header-sticky" :class="{ active: isScrolled }">
      <nav class="navbar navbar-expand-lg">
        <div class="container">
          <!-- Logo Start -->
          <NuxtLink class="navbar-brand" to="/">
            <img 
              :src="settings?.logo || '/images/logo.svg'" 
              :alt="settings?.logoData?.alt || 'Logo'"
              :width="settings?.logoData?.width"
              :height="settings?.logoData?.height"
            >
          </NuxtLink>
          <!-- Logo End -->

          <!-- Main Menu Start -->
          <div class="collapse navbar-collapse main-menu">
            <Menu location="primary" />
            <!-- Header Contact Box Start -->
            <div class="header-btn">
              <NuxtLink to="/contact" class="btn-default">book a table</NuxtLink>
            </div>
            <!-- Header Contact Box End -->
          </div>
          <!-- Main Menu End -->
          <div class="navbar-toggle"></div>
        </div>
      </nav>
      <div class="responsive-menu"></div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()

const isScrolled = ref(false)
const settings = computed(() => settingsStore.settings)

onMounted(async () => {
  // Cargar configuración
  try {
    await settingsStore.fetchSettings()
  } catch (error) {
    // Error loading settings
  }

  // Manejar scroll para sticky header
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll)
  }
})

const handleScroll = () => {
  if (typeof window !== 'undefined') {
    isScrolled.value = window.scrollY > 600
  }
}

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

