<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8">Restaurant - Insights</h1>
    
    <div v-if="insightsStore.loading" class="text-center py-8">
      <p>Cargando...</p>
    </div>

    <div v-else-if="insightsStore.error" class="text-red-500 py-8">
      <p>Error: {{ insightsStore.error }}</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="insight in insightsStore.insights"
          :key="insight.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <NuxtImg
            v-if="insight.featuredImage"
            :src="insight.featuredImage.url"
            :alt="insight.featuredImage.alt"
            class="w-full h-48 object-cover"
          />
          <div class="p-6">
            <h2 class="text-xl font-semibold mb-2">
              <NuxtLink :to="`/insights/${insight.slug}`" class="hover:text-blue-600">
                {{ insight.title }}
              </NuxtLink>
            </h2>
            <p class="text-gray-600 mb-4" v-html="insight.excerpt"></p>
            <div class="flex items-center justify-between text-sm text-gray-500">
              <span>{{ formatDate(insight.date) }}</span>
              <span>{{ insight.author.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="insightsStore.insights.length === 0" class="text-center py-8">
        <p>No hay insights disponibles</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInsightsStore } from '~/stores/insights'

const insightsStore = useInsightsStore()
const dayjs = useDayjs()

const formatDate = (date: string) => {
  return dayjs(date).format('DD MMMM YYYY')
}

onMounted(() => {
  insightsStore.fetchInsights()
})

useHead({
  title: 'Restaurant - Insights'
})
</script>

