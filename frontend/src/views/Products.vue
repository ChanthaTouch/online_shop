<!-- src/views/Products.vue -->
<template>
  <div class="min-h-screen bg-[#FDFCFB] text-[#2C1810] pb-32 selection:bg-amber-100">
    <!-- Hero Header -->
    <div class="relative py-28 px-6 overflow-hidden bg-[#1a120b]">
      <div class="absolute inset-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      <div class="container mx-auto text-center relative z-10">
        <span class="text-amber-500 text-[10px] font-black uppercase tracking-[0.6em] block mb-6 animate-pulse">
          {{ activeDiscount ? 'Special Reward' : 'The Beautifully Collection' }}
        </span>
        <h1 class="font-serif text-6xl md:text-[7rem] text-white mb-8 leading-tight tracking-tighter">
          <span v-if="activeDiscount" class="italic">{{ activeDiscount }}% Off 😊</span>
          <span v-else>Curated Selection</span>
        </h1>
        <div class="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto"></div>
      </div>
    </div>

    <!-- Filter & Search Bar -->
    <div class="container mx-auto px-6 -mt-10 relative z-30">
      <div class="bg-white/80 backdrop-blur-3xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 p-2 max-w-5xl mx-auto">
        <div class="flex flex-col md:flex-row items-center">
          <div class="relative flex-1 w-full group">
            <span class="absolute left-8 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-700 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Find your flavor..."
              class="w-full pl-16 pr-6 py-6 bg-transparent border-none focus:ring-0 text-stone-800 placeholder:text-stone-300 font-light text-lg"
              @keyup.enter="loadProducts"
            />
          </div>

          <div class="h-8 w-[1px] bg-stone-100 hidden md:block"></div>

          <div class="relative min-w-[200px] w-full md:w-auto mt-4 md:mt-0">
            <select
              v-model="selectedCategory"
              class="w-full md:w-48 px-6 py-6 bg-transparent border-none text-stone-800 font-light text-lg appearance-none focus:outline-none cursor-pointer"
            >
              <option value="">All Origins</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.slug">
                {{ cat.name }}
              </option>
            </select>
            <span class="absolute right-6 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
              ▼
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Grid -->
    <div class="container mx-auto px-6 py-16">
      <div v-if="loading" class="flex justify-center items-center min-h-[60vh]">
        <div class="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="products.length === 0" class="text-center py-32">
        <p class="text-2xl text-stone-500 italic font-light">
          No products found matching your search...
        </p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div
          v-for="product in products"
          :key="product.id"
          class="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-stone-100 hover:border-amber-200"
        >
          <!-- Clickable overlay for entire card -->
          <router-link
            v-if="product.slug"
            :to="{ name: 'ProductDetail', params: { slug: product.slug } }"
            class="absolute inset-0 z-10"
            aria-label="View Product Details"
          ></router-link>

          <div class="relative aspect-square overflow-hidden">
            <img
              :src="product.display_image"
              :alt="product.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              @error="handleImageError"
            />
            <div
              v-if="product.is_on_sale"
              class="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md"
            >
              {{ product.discount_percentage || 'Sale' }}%
            </div>
            
            <!-- Hover overlay with "View Details" text -->
            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center pointer-events-none">
              <span class="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl">
                View Details
              </span>
            </div>
          </div>

          <div class="p-6">
            <h3 class="font-serif text-xl text-stone-900 mb-2 line-clamp-2">
              {{ product.name }}
            </h3>

            <div class="flex items-baseline gap-3 mb-4">
              <span class="text-2xl font-bold text-amber-800">
                ${{ displayPrice(product).toFixed(2) }}
              </span>
              <span
                v-if="product.discount_price && product.discount_price < product.price"
                class="text-lg text-stone-400 line-through"
              >
                ${{ Number(product.price).toFixed(2) }}
              </span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-stone-500 text-sm">
                {{ product.category?.name || 'Specialty' }}
              </span>

              <button
                @click.stop="addToCart(product)"
                class="relative z-20 bg-amber-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-amber-700 transition-colors shadow-sm"
                :disabled="product.stock === 0"
              >
                {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center items-center gap-3 mt-16">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-6 py-3 rounded-full bg-stone-100 text-stone-600 disabled:opacity-40 hover:bg-stone-200 transition-colors"
        >
          Previous
        </button>

        <button
          v-for="page in visiblePages"
          :key="page"
          @click="currentPage = typeof page === 'number' ? page : currentPage"
          :class="[
            'px-5 py-3 rounded-full transition-colors',
            typeof page === 'number'
              ? currentPage === page
                ? 'bg-amber-600 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-amber-100'
              : 'text-stone-400 cursor-default'
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-6 py-3 rounded-full bg-stone-100 text-stone-600 disabled:opacity-40 hover:bg-stone-200 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import productService from '@/services/products'
import categoryService from '@/services/categorie'
import { cartService } from '@/services/cart' // assuming you have this

const route = useRoute()
const router = useRouter()

const products = ref<any[]>([])
const categories = ref<any[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const activeDiscount = ref<number | null>(null)
const isMounted = ref(false)
const isInitialLoad = ref(true)

const activeDiscountFromQuery = computed(() => {
  const discountQuery = route.query.discount
  return discountQuery ? parseInt(discountQuery as string, 10) : null
})

const displayPrice = (product: any): number => {
  if (!product) return 0
  if (product.has_variants && product.lowest_price != null) {
    return Number(product.lowest_price)
  }
  if (product.final_price != null) {
    return Number(product.final_price)
  }
  return Number(product.price ?? 0)
}

const visiblePages = computed(() => {
  const delta = 2
  const range: (number | string)[] = []
  const start = Math.max(2, currentPage.value - delta)
  const end = Math.min(totalPages.value - 1, currentPage.value + delta)

  range.push(1)
  for (let i = start; i <= end; i++) range.push(i)
  if (end < totalPages.value - 1) range.push('...')
  if (totalPages.value > 1) range.push(totalPages.value)

  return range.filter((page, index, self) => self.indexOf(page) === index)
})

const handleImageError = (e: Event) => {
  ;(e.target as HTMLImageElement).src = '/images/placeholder.svg'
}

const loadProducts = async () => {
  if (!isMounted.value) return

  loading.value = true
  
  // Debug logging
  console.log('🔍 Loading products with filters:', {
    page: currentPage.value,
    category: selectedCategory.value,
    search: searchQuery.value,
    discount: activeDiscount.value,
    routeQuery: route.query
  })
  
  try {
    const response = await productService.getProducts(
      currentPage.value,
      selectedCategory.value || undefined,
      searchQuery.value.trim() || undefined,
      activeDiscount.value || undefined
    )

    console.log('✅ Products loaded:', response.data?.length, 'products')
    console.log('📦 First product category:', response.data?.[0]?.category)
    
    products.value = response.data || []
    totalPages.value = response.last_page || 1
  } catch (err: any) {
    console.error('❌ Failed to load products:', err)
    products.value = []
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

const addToCart = async (product: any) => {
  if (!product.id || product.stock === 0) return

  try {
    await cartService.addItem(product.id, 1)
    alert('Added to cart!') // replace with toast/notification in real app
  } catch (err) {
    console.error('Add to cart failed:', err)
    alert('Failed to add to cart')
  }
}

// Watch filters and reset to page 1 when they change
watch(
  [activeDiscount, searchQuery, selectedCategory],
  () => {
    // Skip if this is the initial load (onMounted will handle it)
    if (isInitialLoad.value) {
      return
    }
    
    console.log('🔄 Filter changed, reloading products')
    currentPage.value = 1
    loadProducts()
  }
)

// Watch page changes separately (don't reset page)
watch(currentPage, () => {
  // Skip if this is the initial load
  if (isInitialLoad.value) {
    return
  }
  
  loadProducts()
})

// Watch for route query changes (e.g., when navigating from category links)
watch(
  () => route.query.category,
  (newCategory) => {
    console.log('🔄 Route query changed, new category:', newCategory)
    if (newCategory !== selectedCategory.value) {
      selectedCategory.value = (newCategory as string) || ''
      // Don't call loadProducts here - the selectedCategory watcher will handle it
    }
  }
)

onMounted(async () => {
  isMounted.value = true
  
  // Load categories first
  try {
    categories.value = await categoryService.getCategories()
    console.log('✅ Categories loaded:', categories.value.length, 'categories')
    console.log('📋 Categories:', categories.value.map(c => ({ id: c.id, name: c.name, slug: c.slug })))
  } catch (err) {
    console.warn('❌ Categories load failed:', err)
    categories.value = []
  }

  // Initialize filters from URL query parameters
  activeDiscount.value = activeDiscountFromQuery.value
  
  if (route.query.category) {
    selectedCategory.value = route.query.category as string
    console.log('🎯 Initialized category from URL:', selectedCategory.value)
  }
  
  if (route.query.search) {
    searchQuery.value = route.query.search as string
    console.log('🔍 Initialized search from URL:', searchQuery.value)
  }

  // Load products with initialized filters
  await loadProducts()
  
  // Enable watchers after initial load
  isInitialLoad.value = false
})

onUnmounted(() => {
  isMounted.value = false
  isInitialLoad.value = true
})
</script>

<style scoped>
/* Optional: Add any additional scoped styles here if needed */
</style>