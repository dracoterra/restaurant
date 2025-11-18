<template>
  <div style="padding: 50px; background: white; color: black; min-height: 100vh; font-family: Arial;">
    <h1>Página de Debug</h1>
    <p>Si ves esto, Vue está funcionando.</p>
    <p>Fecha: {{ currentTime }}</p>
    <p>Backend Status: {{ backendStatus }}</p>
    <button @click="testBackend">Probar Backend</button>
    <div v-if="backendResponse" style="margin-top: 20px; padding: 10px; background: #f0f0f0;">
      <pre>{{ JSON.stringify(backendResponse, null, 2) }}</pre>
    </div>
    <NuxtLink to="/" style="display: block; margin-top: 20px;">Volver al inicio</NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  ssr: false
})

import { ref, onMounted } from 'vue'

const currentTime = ref(new Date().toLocaleString())
const backendStatus = ref('No probado')
const backendResponse = ref(null)

const testBackend = async () => {
  try {
    backendStatus.value = 'Probando...'
    const response = await fetch('http://localhost:3030/settings')
    const data = await response.json()
    backendResponse.value = data
    backendStatus.value = `OK (${response.status})`
  } catch (error: any) {
    backendStatus.value = `Error: ${error.message}`
    backendResponse.value = { error: error.message }
  }
}

onMounted(() => {
  setInterval(() => {
    currentTime.value = new Date().toLocaleString()
  }, 1000)
})
</script>

