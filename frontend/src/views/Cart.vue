<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Your Cart</h1>

    <div v-if="items.length === 0" class="text-gray-500">Your cart is empty.</div>

    <ul v-else class="space-y-3">
      <li v-for="(it, idx) in items" :key="idx" class="p-3 bg-white rounded shadow flex justify-between items-center">
        <div>
          <div class="font-semibold">{{ it.name }}</div>
          <div class="text-sm text-gray-500">{{ it.description }}</div>
        </div>
        <div class="flex items-center gap-3">
          <input type="number" min="1" v-model.number="it.qty" class="w-20 p-1 border rounded" @change="save" />
          <div class="font-medium">${{ (it.price * (it.qty||1)).toFixed(2) }}</div>
          <button @click="remove(idx)" class="text-red-600">Remove</button>
        </div>
      </li>
    </ul>

    <div v-if="items.length" class="mt-4 p-3 bg-white rounded shadow flex justify-between items-center">
      <div class="font-semibold">Total</div>
      <div class="font-bold">${{ total.toFixed(2) }}</div>
    </div>

    <div class="mt-4 text-right">
      <router-link to="/checkout" class="bg-blue-600 text-white px-4 py-2 rounded">Checkout</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const items = ref<any[]>(JSON.parse(localStorage.getItem('cart') || '[]'))

const total = computed(() => items.value.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0))

function save() {
  localStorage.setItem('cart', JSON.stringify(items.value))
}

function remove(idx: number) {
  items.value.splice(idx, 1)
  save()
}
</script>

<style scoped></style>