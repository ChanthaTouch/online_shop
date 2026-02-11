<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Order Tracking</h1>
    <div v-if="loading" class="text-gray-500">Loading…</div>
    <div v-else-if="!order">Order not found</div>
    <div v-else>
      <div class="p-4 bg-white rounded shadow">
        <div class="font-semibold">Order #{{ order.id }}</div>
        <div class="text-sm text-gray-600">Status: {{ order.status }}</div>
        <div class="mt-3">
          <ul class="space-y-2">
            <li v-for="it in order.items" :key="it.id" class="flex justify-between">
              <div>{{ it.name }} x{{ it.qty }}</div>
              <div>${{ it.price }}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'

const order = ref<any | null>(null)
const loading = ref(true)
const route = useRoute()

onMounted(async () => {
  const orderId = route.params.orderId
  try {
    const res = await api.get(`/orders/${orderId}`)
    order.value = res.data
  } catch (err) { console.error(err) }
  finally { loading.value = false }
})
</script>

<style scoped></style>
