<template>
  <div class="min-h-screen bg-[#faf9f6] text-[#2c1810] pb-32">
    <div class="bg-[#1a120b] py-12 px-6 mb-12 rounded-b-3xl">
      <div class="container mx-auto max-w-2xl">
        <h1 class="font-serif text-5xl md:text-6xl text-white mb-2">My Orders</h1>
        <p class="text-stone-300 text-sm uppercase tracking-widest font-bold">Track your purchases</p>
      </div>
    </div>

    <div class="container mx-auto max-w-2xl px-6" style="margin-top: -2rem\">
      <div v-if="loading" class="flex justify-center py-32">
        <div class="w-12 h-12 border-4 border-stone-200 border-t-amber-600 rounded-full animate-spin"></div>
      </div>

      <div v-else-if="orders.length > 0" class="space-y-6">
        <div v-for="order in orders" :key="order.id" class="bg-white/60 backdrop-blur-md rounded-3xl shadow-lg p-8 border border-white/40 hover:shadow-xl transition-all">
          <div class="flex justify-between items-start mb-6">
            <div>
              <p class="font-serif text-2xl font-bold text-stone-900">Order {{ order.order_number || order.id }}</p>
              <p class="text-stone-500 text-sm font-bold uppercase tracking-wider">{{ formatDate(order.created_at) }}</p>
            </div>
            <div class="text-right">
              <p class="font-serif font-bold text-amber-700 text-2xl">${{ Number(order.total).toFixed(2) }}</p>
              <p :class="['text-xs font-bold uppercase tracking-wider', getStatusColor(order.status)]">
                {{ order.status }}
              </p>
            </div>
          </div>
          
          <div v-if="order.items && order.items.length > 0" class="mt-6 pt-6 border-t-2 border-stone-200">
            <p class="text-xs font-bold uppercase tracking-widest text-stone-600 mb-4">Items ({{ order.items.length }})</p>
            <div class="space-y-3">
              <div v-for="item in order.items" :key="item.id" class="flex justify-between text-sm text-stone-700">
                <span class="font-medium">
                  {{ item.product?.name || `Product #${item.product_id}` }} 
                  <span class="text-stone-500">×{{ item.quantity }}</span>
                </span>
                <span class="font-bold text-stone-900">${{ Number(item.line_total || (item.unit_price * item.quantity)).toFixed(2) }}</span>
              </div>
            </div>
          </div>
          <div v-else class="mt-6 pt-6 border-t-2 border-stone-200">
            <p class="text-sm text-stone-500 italic">No items found in this order</p>
          </div>

          <div class="mt-6 pt-6 border-t-2 border-stone-200">
            <div class="flex justify-between text-sm text-stone-600 mb-2">
              <span>Subtotal:</span>
              <span class="font-bold text-stone-900">${{ Number(order.subtotal).toFixed(2) }}</span>
            </div>
            <div v-if="order.shipping_fee" class="flex justify-between text-sm text-stone-600">
              <span>Shipping:</span>
              <span class="font-bold text-stone-900">${{ Number(order.shipping_fee).toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-32 bg-white/50 backdrop-blur-md rounded-3xl">
        <div class="text-5xl mb-4">📦</div>
        <p class="font-serif text-2xl text-stone-800 mb-8">No orders yet</p>
        <router-link 
          to="/products"
          class="inline-block px-10 py-4 bg-amber-600 text-white rounded-full font-bold hover:bg-amber-500 transition-all shadow-lg uppercase text-xs tracking-wider"
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
import { orderService } from '@/services/orders'

const router = useRouter()
const orders = ref<any[]>([])
const loading = ref(false)

onMounted(async () => {
  if (!authService.isAuthenticated()) {
    router.push({ name: 'Login' })
    return
  }

  loading.value = true
  try {
    const response = await orderService.getOrders()
    // Handle paginated response - Laravel pagination returns { data: [...], current_page, etc }
    if (response && response.data && Array.isArray(response.data)) {
      orders.value = response.data
    } else if (Array.isArray(response)) {
      orders.value = response
    } else {
      orders.value = []
    }
  } catch (error: any) {
    console.error('Error loading orders:', error)
    console.error('Error details:', error.response?.data)
    orders.value = []
    if (error.response?.status === 401) {
      router.push({ name: 'Login' })
    }
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const getStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending': 'text-yellow-600',
    'processing': 'text-blue-600',
    'completed': 'text-green-600',
    'delivered': 'text-green-600',
    'cancelled': 'text-red-600',
  }
  return statusMap[status] || 'text-gray-600'
}
</script>
