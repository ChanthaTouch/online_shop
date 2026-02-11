<!-- src/components/ProductCard.vue -->
<template>
  <div class="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white">
    <img 
      :src="product.image || '/images/placeholder.jpg'" 
      :alt="product.name"
      class="w-full h-48 object-cover rounded bg-gray-100"
      loading="lazy"
    />
    <h3 class="font-semibold mt-3 text-lg">{{ product.name }}</h3>
    <p v-if="product.description" class="text-gray-600 text-sm line-clamp-2 mt-1">
      {{ product.description }}
    </p>

    <div class="flex justify-between items-end mt-4">
      <div>
        <span class="text-lg font-bold text-pink-600">
          {{ formatPrice(product.price) }}$
        </span>
        <div v-if="product.stock !== null && product.stock !== undefined" class="text-xs mt-1">
          <span v-if="product.stock > 10" class="text-green-600">In Stock</span>
          <span v-else-if="product.stock > 0" class="text-orange-600 font-medium">
            Only {{ product.stock }} left!
          </span>
          <span v-else class="text-red-600 font-medium">Out of Stock</span>
        </div>
      </div>

      <div v-if="(product.stock ?? 0) > 0" class="flex flex-col items-end gap-2">
        <input 
          v-model.number="quantity"
          type="number" 
          min="1"
          :max="product.stock ?? 9999"
          class="w-20 border border-gray-300 rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button 
          @click="addToCart"
          :disabled="adding || quantity < 1 || quantity > (product.stock ?? 0)"
          class="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-5 py-2 rounded font-medium transition flex items-center gap-2"
        >
          <span v-if="adding">Adding...</span>
          <span v-else>Add to Cart</span>
        </button>
      </div>

      <div v-else class="text-red-600 font-medium py-2">
        Out of Stock
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { cartService } from '@/services/cart'

const router = useRouter()

const props = defineProps<{
  product: {
    id: number
    name: string
    description?: string
    price: number
    stock?: number
    image: string
  }
}>()

const quantity = ref(1)
const adding = ref(false)

const formatPrice = (price: number) => price.toFixed(2)

const addToCart = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Please login first')
    router.push({ name: 'Login' })
    return
  }

  const maxStock = props.product.stock ?? 0
  if (quantity.value > maxStock) {
    alert(`Only ${maxStock} items available`)
    quantity.value = maxStock
    return
  }

  adding.value = true
  try {
    await cartService.addItem(props.product.id, quantity.value)
    alert(`Added ${quantity.value} × ${props.product.name} to cart!`)
    quantity.value = 1
  } catch (error: any) {
    alert(error.response?.data?.message || 'Ohh so sorry, This product has been no stock now🙏❤️')
  } finally {
    adding.value = false
  }
}
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>