<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div v-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <!-- Product Images -->
        <div>
          <div class="bg-white rounded-lg p-4 mb-4">
            <img 
              :src="selectedImage"
              :alt="product.name"
              class="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div v-if="product.images" class="grid grid-cols-4 gap-2">
            <div 
              v-for="(img, idx) in product.images"
              :key="idx"
              @click="selectedImage = img"
              class="cursor-pointer bg-white rounded-lg p-2 border-2"
              :class="selectedImage === img ? 'border-pink-500' : 'border-gray-200'"
            >
              <img :src="img" :alt="`${product.name} ${idx}`" class="w-full h-20 object-cover rounded" />
            </div>
          </div>
        </div>

        <!-- Product Details -->
        <div class="bg-white rounded-lg p-8">
          <h1 class="text-4xl font-bold mb-4">{{ product.name }}</h1>
          
          <!-- Category -->
          <div class="mb-4">
            <router-link 
              v-if="product.category"
              :to="{ name: 'Products', query: { category: product.category.slug } }"
              class="text-pink-500 hover:underline"
            >
              {{ product.category.name }}
            </router-link>
          </div>

          <!-- Price -->
          <div class="mb-6">
            <div class="flex items-baseline gap-3">
              <span class="text-3xl font-bold text-pink-600">${{ discountPrice }}</span>
              <span v-if="product.discount_price" class="text-xl text-gray-500 line-through">
                ${{ product.price }}
              </span>
            </div>
            <p v-if="product.discount_price" class="text-green-600 mt-2">
              Save {{ discountPercentage }}%
            </p>
          </div>

          <!-- Description -->
          <div class="mb-6">
            <p class="text-gray-600 text-lg">{{ product.description }}</p>
          </div>

          <!-- Stock Status -->
          <div class="mb-6">
            <p :class="[
              'text-lg font-semibold',
              product.stock > 0 ? 'text-green-600' : 'text-red-600'
            ]">
              {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
            </p>
          </div>

          <!-- Size/Attributes Selection -->
          <div v-if="availableAttributes.length > 0" class="mb-6">
            <h3 class="font-bold mb-3">Select Options:</h3>
            <div v-for="attr in availableAttributes" :key="attr" class="mb-4">
              <label class="block text-sm font-semibold mb-2 capitalize">{{ attr }}</label>
              <div class="flex flex-wrap gap-2">
                <button 
                  v-for="val in getAttributeValues(attr)"
                  :key="val"
                  @click="selectedAttributes[attr] = val"
                  :class="[
                    'px-4 py-2 border rounded-lg font-semibold transition',
                    selectedAttributes[attr] === val
                      ? 'bg-pink-500 text-white border-pink-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-pink-500'
                  ]"
                >
                  {{ val }}
                </button>
              </div>
            </div>
          </div>

          <!-- Quantity and Add to Cart -->
          <div class="mb-8">
            <label class="block text-sm font-semibold mb-2">Quantity</label>
            <div class="flex items-center gap-4">
              <button 
                @click="quantity = Math.max(1, quantity - 1)"
                :disabled="quantity <= 1"
                class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                −
              </button>
              <input 
                v-model.number="quantity"
                type="number"
                min="1"
                :max="product.stock"
                class="w-20 px-4 py-2 border border-gray-300 rounded-lg text-center"
              />
              <button 
                @click="quantity = Math.min(product.stock, quantity + 1)"
                :disabled="quantity >= product.stock"
                class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          <!-- Add to Cart Button -->
          <button 
            @click="addToCart"
            :disabled="product.stock === 0"
            class="w-full px-6 py-4 bg-pink-500 text-white rounded-lg font-bold text-lg hover:bg-pink-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            <span v-if="product.stock > 0">🛒 Add to Cart</span>
            <span v-else>Out of Stock</span>
          </button>

          <!-- Share -->
          <div class="mt-8 pt-8 border-t">
            <p class="text-sm text-gray-600 mb-4">Share this product:</p>
            <div class="flex gap-4">
              <button class="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">f</button>
              <button class="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500">𝕏</button>
              <button class="p-2 bg-green-600 text-white rounded-full hover:bg-green-700">💬</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="text-center py-12">
        <p class="text-gray-500">Loading product details...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productService } from '@/services/products'
import { cartService } from '@/services/cart'
import { mockCategories } from '@/services/mockData'

const route = useRoute()
const router = useRouter()
const product = ref<any>(null)
const selectedImage = ref('')
const quantity = ref(1)
const selectedAttributes = ref({})
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const slug = route.params.slug as string
    product.value = await productService.getProductBySlug(slug)
    
    // Add category info
    const category = mockCategories.find(c => c.id === product.value.category_id)
    if (category) {
      product.value.category = category
    }
    
    if (product.value.images && product.value.images.length > 0) {
      selectedImage.value = product.value.images[0]
    }
  } catch (error: any) {
    console.error('Error loading product:', error)
    alert(error.response?.data?.error || 'Product not found')
    router.push({ name: 'Products' })
  } finally {
    loading.value = false
  }
})

const discountPrice = computed(() => {
  if (!product.value) return 0
  return (product.value.discount_price || product.value.price).toFixed(2)
})

const discountPercentage = computed(() => {
  if (!product.value || !product.value.discount_price) return 0
  const discount = ((product.value.price - product.value.discount_price) / product.value.price) * 100
  return Math.round(discount)
})

const availableAttributes = computed(() => {
  return [] // No attributes for now
})

const getAttributeValues = (attr: string) => {
  return []
}

const addToCart = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push({ name: 'Login' })
      return
    }

    await cartService.addItem(product.value.id, quantity.value)
    alert('✅ Added to cart successfully!')
    quantity.value = 1
    selectedAttributes.value = {}
  } catch (error: any) {
    console.error('Error adding to cart:', error)
    alert(error.response?.data?.error || 'Failed to add to cart')
  }
}
</script>
