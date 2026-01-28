<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <!-- Search and Filters -->
      <div class="bg-white rounded-lg p-6 mb-8">
        <div class="flex flex-col md:flex-row gap-4 items-center">
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
          />
          <select 
            v-model="selectedCategory"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
          >
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.slug">
              {{ cat.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Product Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard 
          v-for="product in products" 
          :key="product.id"
          :product="product"
          @add-to-cart="handleAddToCart"
        />
      </div>

      <!-- Empty State -->
      <div v-if="products.length === 0 && !loading" class="text-center py-12">
        <p class="text-gray-500 text-lg">No products found</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500">Loading products...</p>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.last_page > 1" class="flex justify-center gap-2 mt-12">
        <button 
          v-for="page in pagination.last_page" 
          :key="page"
          @click="currentPage = page"
          :class="[
            'px-4 py-2 rounded-lg border',
            page === currentPage 
              ? 'bg-pink-500 text-white border-pink-500'
              : 'bg-white text-gray-700 border-gray-300 hover:border-pink-500'
          ]"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productService } from '@/services/products'
import { cartService } from '@/services/cart'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const router = useRouter()

const products = ref<any[]>([])
const categories = ref<any[]>([])
const searchQuery = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const loading = ref(false)
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0
})

// Fetch categories
const fetchCategories = async () => {
  try {
    categories.value = await productService.getCategories()
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

// Load products
const loadProducts = async () => {
  loading.value = true
  try {
    const response = await productService.getProducts(
      currentPage.value,
      selectedCategory.value || undefined,
      searchQuery.value || undefined
    )
    products.value = response.data || []
    pagination.value = {
      current_page: response.current_page || 1,
      last_page: response.last_page || 1,
      total: response.total || 0,
    }
  } catch (error) {
    console.error('Error loading products:', error)
    products.value = []
    pagination.value = { current_page: 1, last_page: 1, total: 0 }
  } finally {
    loading.value = false
  }
}

// Debounced search
let searchTimeout: any = null
watch(searchQuery, () => {
  currentPage.value = 1
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadProducts()
  }, 500)
})

// Category change
watch(selectedCategory, () => {
  currentPage.value = 1
  loadProducts()
})

// Page change
watch(currentPage, () => {
  loadProducts()
})

// Add to cart handler
const handleAddToCart = async (productId: number) => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push({ name: 'Login' })
    return
  }

  try {
    await cartService.addItem(productId, 1)
    alert('Added to cart successfully!')
  } catch (error: any) {
    console.error('Error adding to cart:', error)
    alert(error.response?.data?.error || 'Failed to add to cart. Please try again.')
  }
}

onMounted(async () => {
  await fetchCategories()

  // Support query params on initial load
  if (route.query.category) {
    selectedCategory.value = route.query.category as string
  }
  if (route.query.search) {
    searchQuery.value = route.query.search as string
  }
  if (route.query.page && !isNaN(parseInt(route.query.page as string))) {
    currentPage.value = parseInt(route.query.page as string)
  }

  await loadProducts()
})
</script>