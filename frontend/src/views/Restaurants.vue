<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Nearby Restaurants</h1>
    <div v-if="loading" class="text-gray-500">Loading…</div>
    <ul v-else class="space-y-3">
      <li v-for="r in restaurants" :key="r.id" class="p-3 bg-white rounded shadow">
        <router-link :to="{ name: 'Menu', params: { id: r.id } }" class="flex items-center justify-between">
          <div>
            <div class="font-semibold">{{ r.name }}</div>
            <div class="text-sm text-gray-500">{{ r.cuisine }}</div>
          </div>
          <div class="text-sm text-gray-400">▶</div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const restaurants = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/restaurants')
    restaurants.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
</style>
