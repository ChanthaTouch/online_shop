<!-- src/components/PointsBadge.vue -->
<template>
  <div class="flex items-center gap-3">
    <!-- Points Badge -->
    <div v-if="!loading" class="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-lg border border-amber-300 shadow-sm">
      <svg class="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
      <div class="flex flex-col leading-tight">
        <span class="text-xs font-semibold text-amber-600">POINTS</span>
        <span class="text-xl font-bold text-amber-700">{{ pointsBalance?.total_points || 0 }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="px-4 py-2 rounded-lg bg-gray-200 animate-pulse"></div>

    <!-- View Details Button -->
    <router-link
      to="/profile"
      class="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition text-sm"
    >
      View Details
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { pointsService } from '@/services/points'

const pointsBalance = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    pointsBalance.value = await pointsService.getBalance()
  } catch (error) {
    console.error('Error loading points:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
</style>
