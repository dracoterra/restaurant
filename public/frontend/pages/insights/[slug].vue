<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div v-if="insightsStore.loading" class="text-center py-8">
      <p>Cargando...</p>
    </div>

    <div v-else-if="insightsStore.error" class="text-red-500 py-8">
      <p>Error: {{ insightsStore.error }}</p>
    </div>

    <article v-else-if="insight" class="bg-white rounded-lg shadow-md overflow-hidden">
      <NuxtImg
        v-if="insight.featuredImage"
        :src="insight.featuredImage.url"
        :alt="insight.featuredImage.alt"
        class="w-full h-64 md:h-96 object-cover"
      />
      
      <div class="p-8">
        <h1 class="text-4xl font-bold mb-4">{{ insight.title }}</h1>
        
        <div class="flex items-center gap-4 mb-6 text-gray-600">
          <span>{{ formatDate(insight.date) }}</span>
          <span>•</span>
          <span>{{ insight.author.name }}</span>
        </div>

        <div class="flex gap-2 mb-6">
          <span
            v-for="category in insight.categories"
            :key="category.slug"
            class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            {{ category.name }}
          </span>
        </div>

        <div class="prose max-w-none" v-html="insight.content"></div>

        <div v-if="insight.tags.length > 0" class="mt-8 pt-6 border-t">
          <h3 class="text-lg font-semibold mb-2">Tags:</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in insight.tags"
              :key="tag.slug"
              class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
            >
              {{ tag.name }}
            </span>
          </div>
        </div>
      </div>
    </article>

    <div v-else class="text-center py-8">
      <p>Insight no encontrado</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInsightsStore } from '~/stores/insights'

const route = useRoute()
const insightsStore = useInsightsStore()
const dayjs = useDayjs()

const slug = route.params.slug as string
const insight = computed(() => insightsStore.currentInsight)

const formatDate = (date: string) => {
  return dayjs(date).format('DD [de] MMMM YYYY, HH:mm')
}

onMounted(async () => {
  await insightsStore.fetchInsightBySlug(slug)
})

useHead({
  title: insight.value ? `${insight.value.title} - Restaurant` : 'Restaurant'
})
</script>

