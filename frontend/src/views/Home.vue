<!-- src/views/Home.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-pink-500 via-pink-500 to-pink-600 py-20">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-center">
          <div class="text-center text-white">
            <h1 class="text-5xl md:text-6xl font-bold mb-4">Welcome to</h1>
            <h2 class="text-6xl md:text-7xl font-black tracking-wider uppercase">
              NAK NAK<br />STORE
            </h2>
            <p class="mt-6 text-lg md:text-xl opacity-90">
              ⭐⭐⭐⭐⭐ High Quality Products, Best Prices
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-12 text-center text-gray-800">
          Shop by Category
        </h2>

        <div v-if="loadingCategories" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>

        <div v-else-if="categoriesError" class="text-center py-12 text-gray-500">
          {{ categoriesError }}
        </div>

        <div v-else-if="categories.length === 0" class="text-center py-12 text-gray-500">
          No categories available
        </div>

        <div v-else class="flex justify-center">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-6xl">
            <div
              v-for="cat in categories"
              :key="cat.id"
              class="group relative overflow-hidden rounded-2xl aspect-[4/3] shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gray-200"
            >
              <!-- Public clickable link to products by category -->
              <router-link
                :to="{ name: 'Products', query: { category: cat.slug } }"
                class="absolute inset-0 z-10"
                :aria-label="'Shop ' + cat.name"
              />

              <!-- Category Image -->
              <img
                v-if="cat.image"
                :src="cat.image"
                @error="handleImageError($event)"
                class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                :alt="`Image for ${cat.name}`"
                loading="lazy"
              />

              <!-- Overlay with category name -->
              <div
                v-if="cat.image"
                class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end z-20"
              >
                <h3 class="text-white text-2xl font-bold px-6 pb-6">
                  {{ cat.name }}
                </h3>
              </div>

              <!-- Fallback if no image -->
              <div
                v-else
                class="absolute inset-0 flex items-center justify-center bg-gray-300 z-20"
              >
                <span class="text-gray-600 text-xl font-medium">{{ cat.name }}</span>
              </div>

              <!-- Admin Edit Button (floating top-right) -->
              <div v-if="isAdmin" class="absolute top-2 right-2 z-30">
                <button
                  @click.prevent="goToCategoryEdit(cat.slug || cat.id)"
                  class="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition flex items-center justify-center"
                  title="Edit Category"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H11v-.828l9.586-9.586z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-12 text-center text-gray-800">
          Featured Products
        </h2>

        <div v-if="loadingProducts" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>

        <div v-else-if="productsError" class="text-center py-12 text-gray-500">
          {{ productsError }}
        </div>

        <div v-else-if="featuredProducts.length === 0" class="text-center py-12 text-gray-500">
          No products available
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div v-for="product in featuredProducts" :key="product.id" class="relative">
            <!-- Always show the product card -->
            <ProductCard
              :product="{
                ...product,
                image: product.display_image || '/images/placeholder.jpg'
              }"
            />

            <!-- Clickable overlay only if slug exists -->
            <router-link
              v-if="product.slug"
              :to="{ name: 'ProductDetail', params: { slug: product.slug } }"
              class="absolute inset-0 z-10"
              :aria-label="'View details for ' + product.name"
            />

            <!-- Error overlay if slug is missing -->
            <div
              v-else
              class="absolute inset-0 bg-red-900/80 flex items-center justify-center rounded-lg text-center z-20"
            >
              <div class="text-white">
                <p class="font-bold text-lg">Missing Slug</p>
                <p class="text-sm">ID: {{ product.id }}</p>
                <p class="text-sm opacity-90">{{ product.name }}</p>
                <p class="text-xs mt-2">Cannot view details</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { productService } from '@/services/products'
import { categoryService } from '@/services/categorie'
import { authService } from '@/services/auth' // ← Added for admin check
import ProductCard from '@/components/ProductCard.vue'
import type { Category } from '@/services/categorie'

const router = useRouter()

const categories = ref<Category[]>([])
const categoriesError = ref('')
const allProducts = ref<any[]>([])
const productsError = ref('')
const loadingCategories = ref(true)
const loadingProducts = ref(false)

const isMounted = ref(true)

// Admin check
const isAdmin = computed(() => authService.isAuthenticated() && authService.isAdmin())

const featuredProducts = computed(() => allProducts.value.slice(0, 18))

onMounted(async () => {
  await Promise.allSettled([
    loadCategories(),
    loadFeaturedProducts()
  ])
})

onUnmounted(() => {
  isMounted.value = false
})

// Safe navigation to category edit page
const goToCategoryEdit = (slugOrId: string | number) => {
  router.push({ name: 'CategoryEdit', params: { slug: String(slugOrId) } }).catch((err) => {
    if (err.name !== 'NavigationDuplicated') {
      console.warn('Category edit route not available:', err)
      alert('Category edit page is not set up yet.')
    }
  })
}

const loadCategories = async () => {
  if (!isMounted.value) return
  loadingCategories.value = true
  try {
    const res = await categoryService.getCategories()
    if (isMounted.value) categories.value = res
  } catch (err: any) {
    console.error('Failed to load categories:', err)
    if (isMounted.value) {
      categories.value = []
      categoriesError.value = err?.response?.status === 401
        ? 'Categories are temporarily unavailable — you can still browse the store as a guest.'
        : 'Failed to load categories.'
    }
  } finally {
    if (isMounted.value) loadingCategories.value = false
  }
}

const loadFeaturedProducts = async () => {
  if (!isMounted.value) return
  loadingProducts.value = true
  try {
    const res = await productService.getProducts(1)
    if (isMounted.value) allProducts.value = res.data || []
  } catch (err: any) {
    console.error('Failed to load featured products:', err)
    if (isMounted.value) {
      allProducts.value = []
      productsError.value = err?.response?.status === 401
        ? 'Products are temporarily unavailable — please continue browsing as a guest.'
        : 'Failed to load featured products.'
    }
  } finally {
    if (isMounted.value) loadingProducts.value = false
  }
}

const handleImageError = (e: Event) => {
  ;(e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image'
}
</script>