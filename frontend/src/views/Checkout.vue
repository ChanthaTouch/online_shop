<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Checkout</h1>

    <div v-if="!orderPlaced">
      <div class="bg-white p-4 rounded shadow mb-6">
        <h2 class="font-semibold mb-2">Order Summary</h2>
        <div v-if="items.length === 0" class="text-gray-500">Your cart is empty.</div>
        <ul v-else class="space-y-2">
          <li v-for="it in items" :key="it.id" class="flex justify-between">
            <div>{{ it.name }} x{{ it.qty }}</div>
            <div>${{ (it.price * it.qty).toFixed(2) }}</div>
          </li>
        </ul>
        <div v-if="items.length" class="mt-4 flex justify-between font-bold">
          <div>Total</div>
          <div>${{ total.toFixed(2) }}</div>
        </div>
      </div>

      <form @submit.prevent="placeOrder" class="bg-white p-4 rounded shadow">
        <div class="space-y-3">
          <input v-model="form.name" placeholder="Full name" class="w-full px-3 py-2 border rounded" required />
          <input v-model="form.phone" placeholder="Phone" class="w-full px-3 py-2 border rounded" required />
          <input v-model="form.address" placeholder="Delivery address" class="w-full px-3 py-2 border rounded" required />
        </div>

        <div class="mt-4 text-right">
          <button type="submit" :disabled="placing || items.length===0" class="bg-blue-600 text-white px-4 py-2 rounded">
            {{ placing ? 'Placing…' : 'Place Order' }}
          </button>
        </div>
      </form>
    </div>

    <div v-else class="text-center">
      <h2 class="text-2xl font-bold text-green-600 mb-4">Order placed</h2>
      <p class="mb-4">Order ID: <span class="font-semibold">{{ order.id }}</span></p>
      <p class="mb-6">Total: ${{ order.total.toFixed(2) }}</p>
      <router-link :to="{ name: 'OrderTrack', params: { orderId: order.id } }" class="bg-blue-600 text-white px-4 py-2 rounded">Track Order</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import api from '@/services/api'

const items = ref<any[]>(JSON.parse(localStorage.getItem('cart') || '[]'))
const placing = ref(false)
const orderPlaced = ref(false)
const order = ref<any | null>(null)

const total = computed(() => items.value.reduce((s,i) => s + (i.price||0) * (i.qty||1), 0))

const form = ref({ name: '', phone: '', address: '' })

async function placeOrder() {
  if (items.value.length === 0) { alert('Cart is empty'); return }
  placing.value = true
  try {
    const payload = { items: items.value.map(i => ({ id: i.id, qty: i.qty })), total: total.value, customer: form.value }
    const res = await api.post('/orders', payload)
    order.value = res.data
    orderPlaced.value = true
    localStorage.removeItem('cart')
  } catch (err) {
    console.error(err)
    alert('Failed to place order')
  } finally { placing.value = false }
}
</script>