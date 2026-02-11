<!-- src/views/ProductDetail.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>

      <div v-else-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <div class="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <img 
              :src="selectedImage" 
              :alt="product.name"
              class="w-full h-96 object-cover rounded-lg"
              @error="handleImageError"
            />
          </div>
          
          <div v-if="product.image_urls && product.image_urls.length > 1" class="grid grid-cols-4 gap-2">
            <div 
              v-for="(img, idx) in product.image_urls" 
              :key="idx"
              @click="selectedImage = img"
              class="cursor-pointer bg-white rounded-lg p-2 border-2 transition-all"
              :class="selectedImage === img ? 'border-pink-500 shadow-sm' : 'border-gray-200 hover:border-pink-300'"
            >
              <img :src="img" :alt="`${product.name} thumbnail ${idx + 1}`" class="w-full h-20 object-cover rounded" @error="handleImageError" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-8 shadow-sm">
          <div class="mb-6">
            <span v-if="product.category" class="text-pink-500 font-semibold uppercase tracking-wider text-sm">
              {{ product.category.name }}
            </span>
            <h1 class="text-4xl font-bold mt-2">{{ product.name }}</h1>
          </div>

          <p class="text-gray-700 mb-8">{{ product.description || 'No description available.' }}</p>

          <div class="mb-8">
            <div class="flex items-end gap-4">
              <span v-if="product.discount_price" class="text-2xl line-through text-gray-500">
                ${{ product.price.toFixed(2) }}
              </span>
              <span class="text-4xl font-bold text-pink-600">
                ${{ discountPrice }}
              </span>
              <span v-if="discountPercentage > 0" class="ml-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                -{{ discountPercentage }}%
              </span>
            </div>
          </div>

          <div class="mb-8">
            <span class="text-lg font-medium">Availability:</span>
            <span class="ml-3 text-lg" :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'">
              {{ product.stock > 0 ? `${product.stock} Units in Stock` : 'Out of Stock' }}
            </span>
          </div>

          <div class="mt-8">
            <!-- Quantity input - only show when in stock -->
            <div v-if="product.stock > 0" class="flex items-center gap-4 mb-6">
              <label class="font-medium text-lg">Quantity:</label>
              <input 
                v-model.number="quantity"
                type="number" 
                min="1" 
                :max="product.stock"
                class="w-28 border border-gray-300 rounded-lg px-4 py-3 text-center text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <!-- Add to Cart Button or Out of Stock Message -->
            <button 
              v-if="product.stock > 0"
              @click="addToCart"
              :disabled="adding || quantity < 1 || quantity > product.stock"
              class="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold text-xl transition flex items-center justify-center gap-3"
            >
              <span v-if="adding">Adding...</span>
              <span v-else>Add to Cart</span>
            </button>

            <div v-else class="w-full bg-gray-300 text-gray-700 py-4 rounded-lg font-bold text-xl text-center">
              Out of Stock
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <h3 class="text-2xl font-bold text-gray-400">Product not found</h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productService } from '@/services/products'
import { cartService } from '@/services/cart'

const route = useRoute()
const router = useRouter()

const product = ref<any>(null)
const selectedImage = ref<string>('')
const loading = ref(true)
const adding = ref(false)
const quantity = ref(1)

onMounted(async () => {
  loading.value = true
  try {
    const slug = route.params.slug as string
    product.value = await productService.getProductBySlug(slug)
    
    if (product.value.primary_image) {
      selectedImage.value = product.value.primary_image
    } else if (product.value.image_urls && product.value.image_urls.length > 0) {
      selectedImage.value = product.value.image_urls[0]
    } else {
      selectedImage.value = '/images/placeholder.jpg'
    }
  } catch (error: any) {
    console.error('Error loading product:', error)
    alert(error.response?.data?.message || 'Product not found')
    router.push({ name: 'Products' })
  } finally {
    loading.value = false
  }
})

const discountPrice = computed(() => {
  if (!product.value) return '0.00'
  return (product.value.discount_price || product.value.price).toFixed(2)
})

const discountPercentage = computed(() => {
  if (!product.value || !product.value.discount_price) return 0
  const discount = ((product.value.price - product.value.discount_price) / product.value.price) * 100
  return Math.round(discount)
})

const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).src = '/images/placeholder.jpg'
}

const addToCart = async () => {
  if (!product.value) return

  const token = localStorage.getItem('token')
  if (!token) {
    alert('Please login first!')
    router.push({ name: 'Login' })
    return
  }

  if (quantity.value > product.value.stock) {
    alert(`Only ${product.value.stock} items available`)
    quantity.value = product.value.stock
    return
  }

  adding.value = true
  try {
    await cartService.addItem(product.value.id, quantity.value)
    alert(`Added ${quantity.value} × ${product.value.name} to cart successfully!`)
    quantity.value = 1
  } catch (error: any) {
    let msg = 'Ohh so sorry, This product has been no stock now🙏❤️'
    if (error.response?.data?.message) {
      msg = error.response.data.message  // This will show "Only X more can be added..." etc.
    } else if (error.response?.data?.errors) {
      msg = Object.values(error.response.data.errors).flat().join(', ')
    }
    alert(msg)
  } finally {
    adding.value = false
  }
}
</script>