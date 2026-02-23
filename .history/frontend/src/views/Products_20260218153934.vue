<!-- src/views/Products.vue  (FULL CORRECTED FILE - ONLY THIS FILE NEEDS CHANGE) -->

<template>
  <div class="min-h-screen bg-[#FDFCFB] text-[#2C1810] pb-32 selection:bg-amber-100">
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
            />
          </div>

          <div class="h-8 w-[1px] bg-stone-100 hidden md:block"></div>

          <div class="relative min-w-[200px] w-full md:w-auto">
            <select
              v-model="selectedCategory"
              class="w-full appearance-none px-10 py-6 bg-transparent border-none focus:ring-0 text-stone-500 cursor-pointer font-bold uppercase tracking-[0.2em] text-[10px]"
            >
              <option value="">All Experiences</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.slug">{{ cat.name }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-6 mt-24">
      <!-- Loading -->
      <div v-if="loading" class="flex flex-col justify-center items-center py-40">
        <div class="w-12 h-12 border-2 border-stone-100 border-t-amber-800 rounded-full animate-spin mb-6"></div>
        <p class="text-stone-400 font-serif italic tracking-[0.2em] text-sm">Curating the gallery...</p>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        <div
          v-for="(product, index) in products"
          :key="product.id"
          class="group relative"
          :style="{ transitionDelay: `${index * 50}ms` }"
        >
          <router-link
            v-if="product.slug"
            :to="{ name: 'ProductDetail', params: { slug: product.slug } }"
            class="absolute inset-0 z-20"
          ></router-link>

          <div class="relative aspect-[3/4] mb-6 overflow-hidden rounded-[2.5rem] bg-stone-100 transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(44,24,16,0.15)] group-hover:-translate-y-2">
            <img
              :src="product.display_image || '/images/placeholder.jpg'"
              class="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
              @error="handleImageError"
            />

            <div class="absolute inset-0 bg-gradient-to-t from-[#2C1810]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div v-if="product.is_on_sale" class="absolute top-6 left-6 z-10">
              <div class="bg-rose-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 transform group-hover:scale-110 transition-transform duration-500 animate-pulse-slow">
                <span class="text-[11px] font-black uppercase tracking-[0.2em]">{{ product.discount_percentage }}% OFF</span>
                <span class="text-sm">😊</span>
              </div>
            </div>

            <div class="absolute bottom-8 left-0 right-0 flex justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <span class="px-8 py-3 bg-white text-[#2C1810] text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-2xl">
                Explore Detail
              </span>
            </div>

            <button
              v-if="isAdmin && product.slug"
              @click.prevent="goToEdit(product.slug)"
              class="absolute top-6 right-6 z-30 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-stone-800 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-amber-800 hover:text-white"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>

          <div class="px-2">
            <div class="flex flex-col gap-1">
              <div class="flex justify-between items-baseline">
                <h3 class="font-serif text-2xl text-stone-900 group-hover:text-amber-800 transition-colors duration-300">
                  {{ product.name }}
                </h3>
                <div class="text-right">
                  <p class="font-light text-xl text-stone-900 tracking-tighter">
                    ${{ displayPrice(product).toFixed(2) }}
                  </p>
                  <p v-if="product.is_on_sale" class="text-[10px] text-stone-300 line-through">
                    ${{ (product.price || 0).toFixed(2) }}
                  </p>
                </div>
              </div>
              <div class="flex justify-between items-center mt-1">
                <p class="text-[9px] text-stone-400 font-bold uppercase tracking-[0.3em]">
                  {{ product.category?.name || 'Limited Edition' }}
                </p>
                <span v-if="product.has_variants" class="text-[9px] text-amber-700/50 font-bold uppercase tracking-widest">
                  Multiple Sizes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-32 flex justify-center items-center gap-12">
        <button
          @click="currentPage--"
          :disabled="currentPage <= 1"
          class="group flex items-center text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 transition-all"
        >
          <span class="mr-4 group-hover:-translate-x-2 transition-transform">← Previous</span>
        </button>

        <div class="flex items-center gap-4">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="page !== '...' ? currentPage = Number(page) : null"
            class="w-10 h-10 rounded-full text-[11px] font-bold transition-all"
            :class="currentPage === page ? 'bg-[#2C1810] text-white shadow-xl scale-110' : 'text-stone-400 hover:text-stone-900'"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="currentPage++"
          :disabled="currentPage >= totalPages"
          class="group flex items-center text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 transition-all"
        >
          <span class="ml-4 group-hover:translate-x-2 transition-transform text-amber-800">Next Page →</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productService } from '@/services/products'
import { categoryService } from '@/services/categorie'   // ← CORRECTED IMPORT (matches your exact filename "categorie.ts")
import { authService } from '@/services/auth'

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

const isAdmin = computed(() => authService.isAuthenticated() && authService.isAdmin())

const activeDiscount = computed(() => {
  const discountQuery = route.query.discount
  return discountQuery ? parseInt(discountQuery as string) : null
})

// ✅ FULLY SAFE displayPrice
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

const goToEdit = (slug: string) => {
  router.push({ name: 'ProductEdit', params: { slug } })
}

const loadProducts = async () => {
  if (!isMounted.value) return

  loading.value = true
  try {
    const response = await productService.getProducts(
      currentPage.value,
      selectedCategory.value || undefined,
      searchQuery.value || undefined,
      activeDiscount.value || undefined
    )

    products.value = response.data || []
    totalPages.value = response.last_page || 1
  } catch (err: any) {
    console.error('Failed to load products:', err)
    products.value = []
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).src = '/images/placeholder.jpg'
}

watch([activeDiscount, searchQuery, selectedCategory, currentPage], loadProducts)

onMounted(async () => {
  try {
    // ← FIXED: Now correctly calls your categorie.ts service
    categories.value = await categoryService.getCategories()
    console.log('✅ Categories loaded successfully:', categories.value) // debug helper
  } catch (err) {
    console.warn('Categories failed to load (optional)', err)
    categories.value = []
  }
  await loadProducts()
})

onUnmounted(() => {
  isMounted.value = false
})
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.03); }
}
.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>