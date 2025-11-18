<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-content">
      <h1>{{ errorTitle }}</h1>
      <p>{{ errorMessage }}</p>
      <div class="error-actions">
        <button @click="handleRetry" class="btn-retry">
          Intentar de nuevo
        </button>
        <NuxtLink to="/" class="btn-home">
          Ir al inicio
        </NuxtLink>
      </div>
      <details v-if="showDetails" class="error-details">
        <summary>Detalles técnicos</summary>
        <pre>{{ errorDetails }}</pre>
      </details>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, provide, inject } from 'vue'

interface Props {
  fallback?: {
    title?: string
    message?: string
  }
  showDetails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: false
})

const hasError = ref(false)
const error = ref<Error | null>(null)
const errorTitle = ref(props.fallback?.title || 'Algo salió mal')
const errorMessage = ref(props.fallback?.message || 'Ocurrió un error inesperado. Por favor, intenta de nuevo.')

const errorDetails = computed(() => {
  if (!error.value) return ''
  return `${error.value.name}: ${error.value.message}\n\n${error.value.stack || ''}`
})

// Capturar errores de componentes hijos
onErrorCaptured((err: Error, instance, info) => {
  hasError.value = true
  error.value = err
  
  // Log del error
  if (process.client) {
    console.error('Error capturado por ErrorBoundary:', {
      error: err,
      component: instance?.$?.type?.name || 'Unknown',
      info
    })
  }
  
  // Prevenir que el error se propague
  return false
})

// Función para resetear el error
function handleRetry() {
  hasError.value = false
  error.value = null
}

// Proveer función de reset para componentes hijos
provide('resetError', handleRetry)
</script>

<style scoped>
.error-boundary {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f5f5f5;
}

.error-content {
  max-width: 600px;
  text-align: center;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error-content h1 {
  color: #d32f2f;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.error-content p {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.btn-retry,
.btn-home {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.3s;
}

.btn-retry {
  background: #1976d2;
  color: white;
}

.btn-retry:hover {
  background: #1565c0;
}

.btn-home {
  background: #f5f5f5;
  color: #333;
}

.btn-home:hover {
  background: #e0e0e0;
}

.error-details {
  margin-top: 2rem;
  text-align: left;
}

.error-details summary {
  cursor: pointer;
  color: #666;
  margin-bottom: 1rem;
}

.error-details pre {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.875rem;
  color: #333;
}
</style>

