<template>
  <div class="max-w-2xl mx-auto py-12">
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-3xl font-bold mb-6">My Orders</h1>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading orders...</p>
      </div>

      <div v-else-if="orders.length > 0" class="space-y-4">
        <div v-for="order in orders" :key="order.id" class="border rounded-lg p-6 hover:shadow-md transition">
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="font-bold text-lg">Order #{{ order.order_number || order.id }}</p>
              <p class="text-gray-600 text-sm">{{ formatDate(order.created_at) }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-lg">${{ Number(order.total).toFixed(2) }}</p>
              <p :class="['text-sm font-semibold capitalize', getStatusColor(order.status)]">
                {{ order.status }}
              </p>
            </div>
          </div>
          
          <div v-if="order.items && order.items.length > 0" class="mt-4 pt-4 border-t">
            <p class="text-sm font-semibold mb-2">Items ({{ order.items.length }}):</p>
            <div class="space-y-2">
              <div v-for="item in order.items" :key="item.id" class="flex justify-between text-sm">
                <span>
                  {{ item.product?.name || `Product #${item.product_id || 'N/A'}` }} 
                  <span class="text-gray-500">x{{ item.quantity }}</span>
                </span>
                <span class="font-semibold">${{ Number(item.line_total || (item.unit_price * item.quantity)).toFixed(2) }}</span>
              </div>
            </div>
          </div>
          <div v-else class="mt-4 pt-4 border-t">
            <p class="text-sm text-gray-500 italic">No items found in this order</p>
          </div>

          <div class="mt-4 pt-4 border-t flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${{ Number(order.subtotal).toFixed(2) }}</span>
          </div>
          <div v-if="order.shipping_fee" class="flex justify-between text-sm">
            <span>Shipping:</span>
            <span>${{ Number(order.shipping_fee).toFixed(2) }}</span>
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
import api from '@/services/api'

const orders = ref<any[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const res = await api.get('/orders')
    orders.value = Array.isArray(res.data) ? res.data : (res.data.data || [])
  } catch (err) {
    console.error('Failed to load orders', err)
    orders.value = []
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString: string) => {
  try { return new Date(dateString).toLocaleDateString() } catch { return '' }
}

const getStatusColor = (status: string) => {
  const map: Record<string,string> = { pending: 'text-yellow-600', preparing: 'text-blue-600', completed: 'text-green-600', delivered: 'text-green-600', cancelled: 'text-red-600' }
  return map[status] || 'text-gray-600'
}
</script>
