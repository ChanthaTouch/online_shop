<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Products</h1>
      <router-link to="/admin/products/create" class="bg-blue-600 text-white px-4 py-2 rounded">New Product</router-link>
    </div>

    <div v-if="loading" class="text-gray-500">Loading…</div>

    <table v-else class="w-full bg-white rounded shadow">
      <thead class="bg-gray-100 text-left">
        <tr>
          <th class="p-3">ID</th>
          <th class="p-3">Name</th>
          <th class="p-3">Price</th>
          <th class="p-3">Stock</th>
          <th class="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in products" :key="p.id" class="border-t">
          <td class="p-3">{{ p.id }}</td>
          <td class="p-3">{{ p.name }}</td>
          <td class="p-3">${{ Number(p.price).toFixed(2) }}</td>
          <td class="p-3">{{ p.stock ?? 0 }}</td>
          <td class="p-3">
            <router-link :to="{ name: 'AdminProductEdit', params: { id: p.id } }" class="mr-3 text-blue-600">Edit</router-link>
            <button @click="remove(p.id)" class="text-red-600">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

const products = ref<any[]>([])
const loading = ref(false)
const router = useRouter()

const load = async () => {
  loading.value = true
  try {
    const res = await api.get('/products', { params: { per_page: 50 } })
    products.value = Array.isArray(res.data.data) ? res.data.data : (res.data || [])
  } catch (err) { console.error(err); products.value = [] }
  finally { loading.value = false }
}

const remove = async (id: number) => {
  if (!confirm('Delete product?')) return
  try {
    await api.delete(`/products/${id}`)
    await load()
  } catch (err) { alert('Delete failed') }
}

onMounted(load)
</script>

<style scoped></style>
