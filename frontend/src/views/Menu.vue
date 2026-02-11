<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Menu</h1>
    <div v-if="loading" class="text-gray-500">Loading menu…</div>
    <ul v-else class="space-y-3">
      <li v-for="item in menu" :key="item.id" class="p-3 bg-white rounded shadow flex justify-between items-center">
        <div>
          <div class="font-semibold">{{ item.name }}</div>
          <div class="text-sm text-gray-500">{{ item.description }}</div>
        </div>
        <div class="flex items-center gap-2">
          <div class="text-sm font-medium">${{ item.price }}</div>
          <button @click="add(item)" class="bg-blue-600 text-white px-3 py-1 rounded">Add</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const menu = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  const id = route.params.id
  try {
    const res = await api.get(`/restaurants/${id}/menu`)
    menu.value = res.data
  } catch (err) { console.error(err) }
  finally { loading.value = false }
})

function add(item: any) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  cart.push({ ...item, qty: 1 })
  localStorage.setItem('cart', JSON.stringify(cart))
  alert('Added to cart')
}
</script>

<style scoped>
</style>
