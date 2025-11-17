<template>
  <header class="main-header">
    <div class="header-sticky" :class="{ active: isScrolled }">
      <nav class="navbar navbar-expand-lg">
        <div class="container">
          <!-- Logo Start -->
          <NuxtLink class="navbar-brand" to="/">
            <img :src="settings.logo" alt="Logo">
          </NuxtLink>
          <!-- Logo End -->

          <!-- Main Menu Start -->
          <div class="navbar-collapse main-menu show">
            <div class="nav-menu-wrapper">
              <ul class="navbar-nav mr-auto" id="menu">
                <li 
                  v-for="item in menuItems" 
                  :key="item.id"
                  class="nav-item"
                  :class="{ submenu: item.children && item.children.length > 0 }"
                >
                  <NuxtLink :to="item.path" class="nav-link">{{ item.label }}</NuxtLink>
                  <ul v-if="item.children && item.children.length > 0">
                    <li 
                      v-for="child in item.children" 
                      :key="child.id"
                      class="nav-item"
                    >
                      <NuxtLink :to="child.path" class="nav-link">{{ child.label }}</NuxtLink>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
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
import { useMenuStore } from '~/stores/menu'
import { useSettingsStore } from '~/stores/settings'

const menuStore = useMenuStore()
const settingsStore = useSettingsStore()

const isScrolled = ref(false)

const menuItems = computed(() => menuStore.items)
const settings = computed(() => settingsStore.settings)

onMounted(async () => {
  // Cargar menú y configuración
  try {
    await Promise.all([
      menuStore.fetchMenu('primary'),
      settingsStore.fetchSettings()
    ])
  } catch (error) {
    console.error('Error loading menu or settings:', error)
  }

  // Manejar scroll para sticky header
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll)
  }

  // Inicializar menú móvil (SlickNav) cuando esté disponible
  if (typeof window !== 'undefined' && (window as any).jQuery) {
    setTimeout(() => {
      const $ = (window as any).jQuery
      if ($ && $.fn.slicknav) {
        $('#menu').slicknav({
          label: '',
          prependTo: '.responsive-menu'
        })
      }
    }, 100)
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

