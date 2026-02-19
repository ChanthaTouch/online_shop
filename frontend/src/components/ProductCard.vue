<!-- src/components/ProductCard.vue -->
<template>
  <div class="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-b from-white to-amber-50 border border-amber-100 hover:border-rose-300">
    <div class="relative overflow-hidden h-56">
      <img 
        :src="product.image || '/images/placeholder.svg'" 
        :alt="product.name"
        class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 bg-gradient-to-br from-amber-100 to-orange-100"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    
    <div class="p-5">
      <h3 class="font-semibold text-lg text-amber-900 group-hover:text-rose-600 transition-colors duration-300">{{ product.name }}</h3>
      <p v-if="product.description" class="text-amber-700 text-sm line-clamp-2 mt-2 opacity-80">
        {{ product.description }}
      </p>

      <!-- Sugar Level Indicator -->
      <div v-if="product.sugar_level !== null && product.sugar_level !== undefined" class="mt-4 flex items-center gap-2">
        <div class="flex-1">
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs font-semibold text-amber-800">Sugar Level</span>
            <span class="text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-rose-600 px-2.5 py-1 rounded-full">
              {{ product.sugar_level }}%
            </span>
          </div>
          <div class="w-full bg-amber-100 rounded-full h-2 overflow-hidden border border-amber-200">
            <div
              class="h-full rounded-full transition-all duration-300 shadow-md"
              :class="getSugarLevelColor(product.sugar_level)"
              :style="{ width: product.sugar_level + '%' }"
            />
          </div>
          <span class="text-xs text-amber-600 mt-1.5 block font-medium">
            {{ getSugarLevelLabel(product.sugar_level) }}
          </span>
        </div>
      </div>

      <div class="flex justify-between items-end mt-6 pt-4 border-t border-amber-100">
        <div>
          <div class="text-xs font-medium text-amber-700 mb-1">Price</div>
          <span class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-rose-600">
            {{ formatPrice(product.price) }}$
          </span>
          <div v-if="product.stock !== null && product.stock !== undefined" class="text-xs mt-2">
            <span v-if="product.stock > 10" class="inline-block px-3 py-1 bg-green-100 text-green-700 font-semibold rounded-full">In Stock</span>
            <span v-else-if="product.stock > 0" class="inline-block px-3 py-1 bg-orange-100 text-orange-700 font-semibold rounded-full">
              Only {{ product.stock }} left!
            </span>
            <span v-else class="inline-block px-3 py-1 bg-red-100 text-red-700 font-semibold rounded-full">Out of Stock</span>
          </div>
        </div>

        <div v-if="(product.stock ?? 0) > 0" class="flex flex-col items-end gap-3">
          <div class="w-32">
            <label class="text-xs font-semibold text-amber-700 block mb-1">Quantity:</label>
            <input 
              v-model.number="quantity"
              type="number" 
              min="1"
              :max="product.stock ?? 10"
              class="w-full border border-amber-300 rounded-lg px-3 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition bg-amber-50 font-medium"
            />
          </div>
          
          <!-- Sugar Level Picker -->
          <div v-if="product.sugar_level !== null && product.sugar_level !== undefined" class="w-full">
            <label class="text-xs font-semibold text-amber-700 block mb-1">Sweetness:</label>
            <input 
              v-model.number="customSugarLevel"
              type="range" 
              min="0"
              max="100"
              class="w-full cursor-pointer accent-rose-500"
            />
            <div class="text-xs text-center text-amber-600 font-medium mt-1">{{ customSugarLevel }}%</div>
          </div>
          
          <button 
            @click="addToCart"
            :disabled="adding || quantity < 1 || quantity > (product.stock ?? 0)"
            class="w-full bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg font-semibold transition text-sm shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
          >
            <span v-if="adding" class="inline-flex items-center gap-2">Adding...</span>
            <span v-else class="inline-flex items-center gap-2">Add to Cart</span>
          </button>
        </div>

        <div v-else class="text-red-600 font-semibold py-2 text-sm">
          Out of Stock
        </div>
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
    sugar_level?: number | null
    image: string
  }
}>()

const quantity = ref(1)
const adding = ref(false)
const customSugarLevel = ref(50) // Default to 50%

const formatPrice = (price: number) => price.toFixed(2)

const getSugarLevelColor = (level: number): string => {
  if (level < 30) return 'bg-green-500'
  if (level < 60) return 'bg-yellow-500'
  if (level < 85) return 'bg-orange-500'
  return 'bg-red-500'
}

const getSugarLevelLabel = (level: number): string => {
  if (level < 30) return 'Low'
  if (level < 60) return 'Medium'
  if (level < 85) return 'High'
  return 'Very High'
}

const addToCart = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Please login first')
    router.push({ name: 'Login' })
    return
  }

  const stock = props.product.stock ?? 0
  if (quantity.value > stock) {
    alert(`Only ${stock} items available`)
    quantity.value = stock
    return
  }

  adding.value = true
  try {
    const sugarLevel = props.product.sugar_level !== null && props.product.sugar_level !== undefined ? customSugarLevel.value : null
    await cartService.addItem(props.product.id, quantity.value, sugarLevel)
    alert(`Added ${quantity.value} × ${props.product.name} to cart!`)
    // Notify Header component to update cart count
    localStorage.setItem('cartUpdated', Date.now().toString())
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
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>