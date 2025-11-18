<template>
  <figure :class="figureClass">
    <NuxtImg
      :src="imageUrl"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="loading"
      :placeholder="placeholder"
      :format="format"
      :quality="quality"
      :sizes="sizes"
      :preload="preload"
      :class="imageClass"
      @load="onLoad"
      @error="onError"
    />
    <slot />
  </figure>
</template>

<script setup lang="ts">
interface Props {
  src: string | { url?: string; sourceUrl?: string } | null
  alt?: string
  width?: number | string
  height?: number | string
  loading?: 'lazy' | 'eager'
  placeholder?: boolean
  format?: 'webp' | 'avif' | 'jpg' | 'png'
  quality?: number
  sizes?: string
  preload?: boolean
  figureClass?: string
  imageClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  loading: 'lazy',
  placeholder: true,
  format: 'webp',
  quality: 80,
  sizes: '100vw',
  preload: false,
  figureClass: '',
  imageClass: ''
})

const imageUrl = computed(() => {
  if (!props.src) return ''
  if (typeof props.src === 'string') return props.src
  return props.src.url || props.src.sourceUrl || ''
})

const onLoad = () => {
  // Imagen cargada exitosamente
}

const onError = () => {
  // Manejar error de carga de imagen
  console.warn('Error loading image:', imageUrl.value)
}
</script>

