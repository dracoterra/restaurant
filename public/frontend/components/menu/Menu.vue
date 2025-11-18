<template>
  <div class="nav-menu-wrapper">
    <ul class="navbar-nav mr-auto" id="menu" v-if="menuItems.length > 0">
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
    <MenuSkeleton v-else-if="menuStore.loading" />
    <MenuSkeleton v-else-if="menuStore.error" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useMenuStore } from '~/stores/menu'

interface Props {
  location?: string
}

const props = withDefaults(defineProps<Props>(), {
  location: 'primary'
})

const menuStore = useMenuStore()
const menuItems = computed(() => menuStore.items)

let slicknavInitialized = false

const initSlickNav = () => {
  if (process.client && !slicknavInitialized) {
    if ((window as any).jQuery) {
      const $ = (window as any).jQuery
      if ($ && $.fn.slicknav) {
        const $menu = $('#menu')
        if ($menu.length && $menu.data('slicknav') === undefined) {
          $menu.slicknav({
            label: '',
            prependTo: '.responsive-menu'
          })
          slicknavInitialized = true
        }
      }
    }
  }
}

onMounted(async () => {
  // Cargar menú si no está cargado
  if (menuItems.value.length === 0) {
    try {
      await menuStore.fetchMenu(props.location)
    } catch (error) {
      // Error loading menu
    }
  }

  // Inicializar menú móvil (SlickNav) cuando esté disponible
  if (process.client) {
    // Intentar inicializar inmediatamente
    initSlickNav()
    
    // Si jQuery no está disponible, intentar después de un delay
    if (!(window as any).jQuery) {
      const checkJQuery = setInterval(() => {
        if ((window as any).jQuery) {
          initSlickNav()
          clearInterval(checkJQuery)
        }
      }, 100)
      
      // Timeout de seguridad
      setTimeout(() => {
        clearInterval(checkJQuery)
      }, 5000)
    }
  }
})

onUnmounted(() => {
  // Limpiar SlickNav si es necesario
  if (process.client && slicknavInitialized && (window as any).jQuery) {
    const $ = (window as any).jQuery
    const $menu = $('#menu')
    if ($menu.length && $menu.data('slicknav')) {
      $menu.slicknav('destroy')
      slicknavInitialized = false
    }
  }
})
</script>

