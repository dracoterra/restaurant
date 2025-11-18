<template>
  <div class="container py-5">
    <h1 class="mb-4">🔍 ACF Fields Debug Tool</h1>
    
    <div class="alert alert-info mb-4">
      <strong>Herramienta de Verificación Profesional</strong><br>
      Esta página verifica si los campos ACF están llegando correctamente desde WordPress al frontend.
    </div>

    <!-- Selector de Página -->
    <div class="card mb-4">
      <div class="card-header">
        <h3>Seleccionar Página</h3>
      </div>
      <div class="card-body">
        <div class="btn-group" role="group">
          <button 
            v-for="pageType in pageTypes" 
            :key="pageType.value"
            type="button" 
            class="btn"
            :class="selectedPage === pageType.value ? 'btn-primary' : 'btn-outline-primary'"
            @click="loadPage(pageType.value)"
          >
            {{ pageType.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2">Cargando datos de la página...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger">
      <strong>Error:</strong> {{ error }}
    </div>

    <!-- Results -->
    <div v-else-if="pageData && debugInfo">
      <!-- Summary Card -->
      <div class="card mb-4" :class="debugInfo.hasAcf ? 'border-success' : 'border-danger'">
        <div class="card-header" :class="debugInfo.hasAcf ? 'bg-success text-white' : 'bg-danger text-white'">
          <h3>
            {{ debugInfo.hasAcf ? '✅ ACF Fields Detected' : '❌ No ACF Fields Found' }}
          </h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <p><strong>Page Slug:</strong> {{ pageData.slug || 'N/A' }}</p>
              <p><strong>Page ID:</strong> {{ pageData.id || 'N/A' }}</p>
              <p><strong>Page Title:</strong> {{ pageData.title || 'N/A' }}</p>
            </div>
            <div class="col-md-6">
              <p><strong>Has ACF:</strong> 
                <span :class="debugInfo.hasAcf ? 'text-success' : 'text-danger'">
                  {{ debugInfo.hasAcf ? 'YES ✅' : 'NO ❌' }}
                </span>
              </p>
              <p><strong>ACF Keys:</strong> {{ debugInfo.acfKeys.length }}</p>
              <p><strong>Total Fields:</strong> {{ debugInfo.fieldCount }}</p>
              <p><strong>Is Empty:</strong> 
                <span :class="debugInfo.isEmpty ? 'text-warning' : 'text-success'">
                  {{ debugInfo.isEmpty ? 'YES ⚠️' : 'NO ✅' }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sections Analysis -->
      <div class="card mb-4">
        <div class="card-header">
          <h3>Sections Analysis</h3>
        </div>
        <div class="card-body">
          <div v-for="(section, sectionKey) in debugInfo.sections" :key="sectionKey" class="mb-3">
            <h5>
              {{ sectionKey }}
              <span :class="section.exists ? 'badge bg-success' : 'badge bg-danger'">
                {{ section.exists ? 'EXISTS' : 'MISSING' }}
              </span>
            </h5>
            <div v-if="section.exists" class="ms-4">
              <p><strong>Keys:</strong> {{ section.keys.length }} fields</p>
              <ul>
                <li v-for="key in section.keys" :key="key">{{ key }}</li>
              </ul>
              <details class="mt-2">
                <summary>Sample Data</summary>
                <pre class="bg-light p-3 mt-2"><code>{{ JSON.stringify(section.sample, null, 2) }}</code></pre>
              </details>
            </div>
            <div v-else class="ms-4 text-danger">
              ⚠️ This section is missing
            </div>
          </div>
        </div>
      </div>

      <!-- Missing Fields -->
      <div v-if="debugInfo.missingFields.length > 0" class="card mb-4 border-warning">
        <div class="card-header bg-warning">
          <h3>⚠️ Missing Fields</h3>
        </div>
        <div class="card-body">
          <ul>
            <li v-for="field in debugInfo.missingFields" :key="field" class="text-danger">
              {{ field }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Raw Data -->
      <div class="card mb-4">
        <div class="card-header">
          <h3>Raw Data</h3>
        </div>
        <div class="card-body">
          <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item">
              <button 
                class="nav-link" 
                :class="{ active: activeTab === 'page' }"
                @click="activeTab = 'page'"
              >
                Full Page
              </button>
            </li>
            <li class="nav-item">
              <button 
                class="nav-link" 
                :class="{ active: activeTab === 'acf' }"
                @click="activeTab = 'acf'"
              >
                ACF Only
              </button>
            </li>
            <li class="nav-item">
              <button 
                class="nav-link" 
                :class="{ active: activeTab === 'report' }"
                @click="activeTab = 'report'"
              >
                Debug Report
              </button>
            </li>
          </ul>
          <div class="tab-content p-3">
            <div v-show="activeTab === 'page'">
              <pre class="bg-light p-3" style="max-height: 500px; overflow: auto;"><code>{{ JSON.stringify(pageData, null, 2) }}</code></pre>
            </div>
            <div v-show="activeTab === 'acf'">
              <pre class="bg-light p-3" style="max-height: 500px; overflow: auto;"><code>{{ JSON.stringify(pageData?.acf, null, 2) }}</code></pre>
            </div>
            <div v-show="activeTab === 'report'">
              <pre class="bg-light p-3" style="max-height: 500px; overflow: auto; white-space: pre-wrap;"><code>{{ debugReport }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  ssr: false
})

import { ref, computed, onMounted } from 'vue'
import { usePagesStore, type Page } from '~/stores/pages'
import { useAcfDebug, type AcfDebugInfo } from '~/composables/useAcfDebug'

const pagesStore = usePagesStore()
const { analyzeAcf, generateReport } = useAcfDebug()

const pageTypes = [
  { value: 'home', label: 'Home', section: 'homePageSections' },
  { value: 'about', label: 'About', section: 'aboutPageSections' },
  { value: 'contact', label: 'Contact', section: 'contactPageSections' },
  { value: 'services', label: 'Services', section: 'servicesPageSections' }
  // Nota: 'menu' no es una página de WordPress, es solo el nombre del menú de navegación
  // Si necesitas una página "menu" en WordPress, créala con el slug "menu"
]

const selectedPage = ref<string>('home')
const pageData = ref<Page | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const activeTab = ref('page')

const expectedSections = computed(() => {
  const pageType = pageTypes.find(p => p.value === selectedPage.value)
  return pageType ? [pageType.section] : []
})

const debugInfo = computed<AcfDebugInfo | null>(() => {
  if (!pageData.value) return null
  return analyzeAcf(pageData.value, expectedSections.value)
})

const debugReport = computed(() => {
  if (!pageData.value || !debugInfo.value) return ''
  return generateReport(
    pageData.value, 
    selectedPage.value as 'home' | 'about' | 'contact' | 'services'
  )
})

const loadPage = async (pageType: string) => {
  selectedPage.value = pageType
  loading.value = true
  error.value = null
  pageData.value = null

  try {
    const page = await pagesStore.fetchPageBySlug(pageType)
    pageData.value = page

    // Log en consola
    if (process.client) {
      const { logAcfData } = useAcfDebug()
      logAcfData(page, pageType as any)
    }
  } catch (err: any) {
    if (err.status === 404) {
      error.value = `Página "${pageType}" no encontrada en WordPress`
    } else {
      error.value = err.message || 'Error al cargar la página'
    }
        // Solo loggear en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading page:', err)
        }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPage('home')
})
</script>

<style scoped>
pre {
  font-size: 12px;
  line-height: 1.4;
}

.badge {
  margin-left: 10px;
}

.card {
  margin-bottom: 1rem;
}
</style>

