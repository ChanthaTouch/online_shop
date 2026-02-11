<!-- src/views/Products.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">

      <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div class="flex flex-col md:flex-row gap-4 items-center">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="flex-1 px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          />

          <select
            v-model="selectedCategory"
            class="px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition min-w-[180px]"
          >
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.slug">
              {{ cat.name }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>

      <div v-else-if="products.length === 0" class="text-center py-20">
        <h3 class="text-2xl font-bold text-gray-400">No products found</h3>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div v-for="product in products" :key="product.id" class="relative">
          <!-- Always show the product card -->
          <ProductCard
            :product="{
              ...product,
              image: product.display_image || '/images/placeholder.jpg'
            }"
          />

          <!-- Clickable overlay only if slug exists (for public users) -->
          <router-link
            v-if="product.slug"
            :to="{ name: 'ProductDetail', params: { slug: product.slug } }"
            class="absolute inset-0 z-10"
            :aria-label="'View details for ' + product.name"
          />

          <!-- Admin Edit Button (only if slug exists – required for loading) -->
          <div v-if="isAdmin && product.slug" class="absolute top-2 right-2 z-30">
            <button
              @click.prevent="goToEdit(product.slug)"
              class="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition flex items-center justify-center"
              title="Edit Product"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H11v-.828l9.586-9.586z" />
              </svg>
            </button>
          </div>

          <!-- Error overlay if slug is missing -->
          <div
            v-if="!product.slug"
            class="absolute inset-0 bg-red-900/80 flex items-center justify-center rounded-lg text-center z-20"
          >
            <div class="text-white">
              <p class="font-bold text-lg">Missing Slug</p>
              <p class="text-sm">ID: {{ product.id }}</p>
              <p class="text-sm opacity-90">{{ product.name }}</p>
              <p class="text-xs mt-2">Cannot view details or edit</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-12 flex justify-center items-center gap-3">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-5 py-2 rounded-lg font-bold transition bg-white text-gray-600 hover:bg-pink-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <button
          v-for="page in visiblePages"
          :key="page"
          @click="currentPage = page"
          class="px-4 py-2 rounded-lg font-bold transition min-w-[40px]"
          :class="currentPage === page ? 'bg-pink-500 text-white' : 'bg-white text-gray-600 hover:bg-pink-100'"
          :disabled="page === '...'"
        >
          {{ page }}
        </button>

        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-5 py-2 rounded-lg font-bold transition bg-white text-gray-600 hover:bg-pink-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productService } from '@/services/products'
import { authService } from '@/services/auth'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const router = useRouter()

const products = ref<any[]>([])
const categories = ref<any[]>([])
const loading = ref(true)

const searchQuery = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const totalPages = ref(1)

const isMounted = ref(true)
let searchTimeout: ReturnType<typeof setTimeout> | null = null

const isAdmin = computed(() => authService.isAuthenticated() && authService.isAdmin())

// Safe navigation to edit page using SLUG (existing public API works)
const goToEdit = (slug: string) => {
  router.push({ name: 'ProductEdit', params: { slug } }).catch((err) => {
    if (err.name !== 'NavigationDuplicated') {
      console.warn('Navigation error:', err)
    }
  })
}

// ... (rest of the script is unchanged – updateUrlAndLoad, fetchCategories, loadProducts, watches, visiblePages, onMounted, onUnmounted)
const updateUrlAndLoad = () => {
  if (!isMounted.value) return

  router.replace({
    query: {
      search: searchQuery.value || undefined,
      category: selectedCategory.value || undefined,
      page: currentPage.value > 1 ? String(currentPage.value) : undefined,
    },
  }).catch(() => {})

  loadProducts()
}

const fetchCategories = async () => {
  try {
    categories.value = await productService.getCategories()
  } catch (err) {
    console.error('Error fetching categories:', err)
  }
}

const loadProducts = async () => {
  if (!isMounted.value) return

  loading.value = true
  try {
    const response = await productService.getProducts(
      currentPage.value,
      selectedCategory.value || undefined,
      searchQuery.value || undefined
    )

    if (isMounted.value) {
      products.value = response.data
      totalPages.value = response.last_page || 1
    }
  } catch (err) {
    console.error('Error loading products:', err)
    if (isMounted.value) {
      products.value = []
      totalPages.value = 1
    }
  } finally {
    if (isMounted.value) {
      loading.value = false
    }
  }
}

watch(searchQuery, () => {
  currentPage.value = 1
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (isMounted.value) updateUrlAndLoad()
  }, 500)
})

watch(selectedCategory, () => {
  currentPage.value = 1
  if (isMounted.value) updateUrlAndLoad()
})

watch(currentPage, () => {
  if (isMounted.value) updateUrlAndLoad()
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const delta = 2

  if (totalPages.value <= 1) return pages

  pages.push(1)

  if (currentPage.value - delta > 2) {
    pages.push('...')
  }

  for (let i = Math.max(2, currentPage.value - delta); i <= Math.min(totalPages.value - 1, currentPage.value + delta); i++) {
    if (!pages.includes(i)) pages.push(i)
  }

  if (currentPage.value + delta < totalPages.value - 1) {
    pages.push('...')
  }

  if (totalPages.value > 1 && !pages.includes(totalPages.value)) {
    pages.push(totalPages.value)
  }

  return pages
})

onMounted(async () => {
  await fetchCategories()

  if (route.query.category) selectedCategory.value = route.query.category as string
  if (route.query.search) searchQuery.value = route.query.search as string
  if (route.query.page) currentPage.value = Number(route.query.page) || 1

  loadProducts()
})

onUnmounted(() => {
  isMounted.value = false
  if (searchTimeout) {
    clearTimeout(searchTimeout)
    searchTimeout = null
  }
})
</script>