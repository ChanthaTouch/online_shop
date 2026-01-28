<template>
  <div class="max-w-2xl mx-auto py-12">
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-3xl font-bold mb-6">My Orders</h1>

      <div v-if="orders.length > 0" class="space-y-4">
        <div v-for="order in orders" :key="order.id" class="border rounded-lg p-4 hover:shadow-md transition">
          <div class="flex justify-between items-center">
            <div>
              <p class="font-bold">Order #{{ order.id }}</p>
              <p class="text-gray-600">{{ order.date }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold">${{ order.total.toFixed(2) }}</p>
              <p :class="[
                'text-sm font-semibold',
                order.status === 'delivered' ? 'text-green-600' : 'text-yellow-600'
              ]">
                {{ order.status }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-500 mb-4">No orders yet</p>
        <router-link 
          to="/products"
          class="inline-block px-6 py-3 bg-pink-500 text-white rounded-lg font-bold hover:bg-pink-600 transition"
        >
          Start Shopping
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth'

const router = useRouter()
const orders = ref<any[]>([])
const loading = ref(false)

// Mock orders data
const mockOrders = [
  { id: 1001, date: '2026-01-20', total: 149.99, status: 'delivered' },
  { id: 1002, date: '2026-01-15', total: 89.99, status: 'processing' },
  { id: 1003, date: '2026-01-10', total: 199.99, status: 'delivered' }
]

onMounted(() => {
  if (!authService.isAuthenticated()) {
    router.push({ name: 'Login' })
    return
  }

  // Load mock orders for now (would come from API in real app)
  orders.value = mockOrders
  loading.value = false
})
</script>
