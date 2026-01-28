
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-pink-500 via-pink-500 to-pink-600 py-20">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-center">
          <div class="text-center text-white">
            <h1 class="text-5xl md:text-6xl font-bold mb-4">Welcome to</h1>
            <h2 class="text-6xl md:text-7xl font-black tracking-wider uppercase">NAK NAK<br />STORE</h2>
            <p class="mt-6 text-lg md:text-xl opacity-90">
              ⭐⭐⭐⭐⭐ The world's highest rated free ecommerce platform
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-12 text-center text-gray-800">Shop by Category</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <router-link
            v-for="category in categories"
            :key="category.id"
            :to="{ name: 'Products', query: { category: category.slug } }"
            class="group cursor-pointer"
          >
            <div class="bg-gray-200 rounded-2xl h-64 mb-4 overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300">
              <img
                v-if="category.image"
                :src="category.image"
                :alt="category.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-pink-300 to-pink-500 flex items-center justify-center"
              >
                <span class="text-white font-bold text-2xl">{{ category.name }}</span>
              </div>
            </div>
            <h3 class="text-xl font-bold text-center text-gray-800 group-hover:text-pink-600 transition-colors">
              {{ category.name }}
            </h3>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="py-16 bg-white w-full">
      <div class="w-full px-4">
        <div class="max-w-7xl mx-auto">
          <div class="flex justify-between items-end mb-12">
            <div>
              <h2 class="text-3xl font-bold text-gray-800">Featured Products</h2>
              <p class="text-gray-500 mt-2">Our top picks for you this week</p>
            </div>
            <router-link
              to="/products"
              class="text-pink-600 font-semibold hover:text-pink-700 hover:underline transition-colors"
            >
              View All →
            </router-link>
          </div>
        </div>

        <!-- Full screen grid layout for cards -->
        <div class="w-full px-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
              @add-to-cart="handleAddToCart"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { mockCategories, mockProducts } from '@/services/mockData'
import { cartService } from '@/services/cart'
import ProductCard from '@/components/ProductCard.vue'

const router = useRouter()

// Reactive state
const categories = ref<any[]>([])
const products = ref<any[]>([])

onMounted(() => {
  // First 3 categories only
  categories.value = mockCategories.slice(0, 3)
  // Show ALL mock products (to display multiple rows like in your screenshot)
  products.value = mockProducts
})

const handleAddToCart = async (productId: number) => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push({ name: 'Login' })
    return
  }

  try {
    await cartService.addItem(productId, 1)
    alert('✅ Added to cart successfully!')
  } catch (error: any) {
    console.error('Error adding to cart:', error)
    alert(error.response?.data?.error || 'Failed to add to cart')
  }
}
</script>

<style scoped>
/* Remove the max-width constraint to allow full width */
</style>
