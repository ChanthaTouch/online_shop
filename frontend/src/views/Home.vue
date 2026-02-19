
<template>
  <div class="min-h-screen bg-[#faf9f6] text-[#2c1810] pb-32">
    <!-- Hero Section -->
    <section class="relative h-[90vh] flex items-center justify-center overflow-hidden bg-[#0f0a06]">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(180,83,9,0.15)_0%,transparent_70%)]"></div>

      <div class="container mx-auto px-6 relative z-10 text-center">
        <div class="inline-flex items-center gap-3 py-2.5 px-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-10">
          <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span class="text-white/80 text-xs font-bold uppercase tracking-[0.3em]">Specialty Roastery • Est. 2024</span>
        </div>
        
        <h1 class="font-serif text-6xl md:text-8xl lg:text-9xl text-white mb-8 leading-tight tracking-tight">
          Life <span class="text-amber-500 italic font-light">&</span> Coffee
        </h1>
        
        <p class="max-w-2xl mx-auto text-stone-300 text-base md:text-lg font-light leading-relaxed mb-12 italic">
          "A curated experience for the modern palate, sourced from high-altitude estates."
        </p>

        <button @click="scrollToProducts" class="px-12 py-5 bg-amber-600 text-white rounded-full font-bold tracking-wider uppercase text-xs hover:bg-amber-500 transition-all duration-300 shadow-lg">
          Shop Collection
        </button>
      </div>
    </section>

    <!-- Categories / Origins Section -->
    <section class="py-24 md:py-32 px-6">
      <div class="container mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 border-b border-stone-200 pb-12">
          <div class="space-y-3">
            <span class="text-amber-600 font-bold text-xs tracking-[0.4em] uppercase">Browse Origins</span>
            <h2 class="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-900">The Roastery</h2>
          </div>
          <div class="flex gap-4">
            <button @click="scrollLeft" class="w-14 h-14 rounded-full border border-stone-300 hover:bg-stone-800 hover:text-white transition-all flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke-width="2"/></svg>
            </button>
            <button @click="scrollRight" class="w-14 h-14 rounded-full border border-stone-300 hover:bg-stone-800 hover:text-white transition-all flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="2"/></svg>
            </button>
          </div>
        </div>

        <div ref="scrollContainer" class="flex gap-10 overflow-x-auto pb-8 scrollbar-hide snap-x">
          <div v-for="cat in categories" :key="cat.id" 
            class="group relative flex-shrink-0 w-[360px] md:w-[400px] h-[520px] rounded-3xl overflow-hidden snap-center shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl">
            <router-link :to="{ name: 'Products', query: { category: cat.slug } }" class="absolute inset-0 z-30" />
            <img v-if="cat.image" :src="cat.image" :alt="cat.name" class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" @error="$event.target.src = '/images/placeholder.svg'" />
            <div v-else class="absolute inset-0 bg-gradient-to-br from-amber-100 to-stone-200 flex items-center justify-center">
              <span class="text-6xl opacity-40">☕</span>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
            <div class="absolute bottom-0 left-0 p-10 z-20">
              <h3 class="text-white text-4xl font-serif mb-4">{{ cat.name }}</h3>
              <div class="w-12 h-0.5 bg-amber-500 group-hover:w-24 transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section id="featured-products" class="py-24 md:py-32 bg-white">
      <div class="container mx-auto px-6">
        <div class="text-center mb-20 space-y-4">
          <span class="text-amber-600 font-bold text-xs tracking-[0.4em] uppercase">Signature Selection</span>
          <h2 class="font-serif text-5xl md:text-6xl lg:text-7xl">Curated Roasts</h2>
          <div class="w-20 h-px bg-amber-200 mx-auto"></div>
        </div>

        <div v-if="loadingProducts" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div v-for="i in 8" :key="i" class="h-96 bg-stone-100 animate-pulse rounded-3xl"></div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
          <div v-for="product in featuredProducts" :key="product.id" class="group relative">
            
            <router-link 
              v-if="product.slug" 
              :to="{ name: 'ProductDetail', params: { slug: product.slug } }"
              class="absolute inset-0 z-10"
              aria-label="View Product Details"
            ></router-link>

            <div class="relative aspect-[3/4] mb-8 overflow-hidden rounded-[2.5rem] bg-[#f5f4f0] transition-all duration-700 group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] group-hover:-translate-y-3">
              <ProductCard
                :product="{ ...product, image: product.display_image || '/images/placeholder.svg' }"
                class="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
              />

              <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center pointer-events-none">
                <span class="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl">
                  View Details
                </span>
              </div>

              <!-- Discount Badge -->
              <div v-if="product.discount_percentage" class="absolute top-5 left-5 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                {{ product.discount_percentage }}% OFF
              </div>

              <div v-if="isAdmin && product.slug" class="absolute top-5 right-5 z-20">
                <button @click.prevent="goToEdit(product.slug)" class="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-stone-800 shadow-xl hover:bg-amber-600 hover:text-white transition-all">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
              </div>
            </div>

            <div class="px-4 space-y-3">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-serif text-2xl text-stone-900 leading-none mb-2 group-hover:text-amber-700 transition-colors">{{ product.name }}</h3>
                  <p class="text-[10px] text-stone-400 font-bold uppercase tracking-[0.3em]">{{ product.category?.name || 'Specialty' }}</p>
                </div>
                <p class="font-serif text-2xl text-amber-800 font-medium">${{ product.price }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Subscription / Club Section -->
    <section class="py-32 px-6">
      <div class="container mx-auto">
        <div class="relative bg-[#1a120b] rounded-3xl p-16 md:p-24 text-center shadow-2xl">
          <div class="max-w-3xl mx-auto">
            <span class="text-amber-500 text-xs font-bold uppercase tracking-[0.5em] block mb-8">The Connoisseur Circle</span>
            <h2 class="font-serif text-5xl md:text-7xl text-white mb-8 leading-tight">
              Join <span class="italic text-amber-500">the</span> Club
            </h2>
            <p class="text-stone-300 text-base md:text-lg font-light mb-12 max-w-xl mx-auto">
              Unlock seasonal micro-lots and private invitations to tasting events.
            </p>
            
            <form @submit.prevent="handleSubscribe" class="max-w-md mx-auto relative">
              <input 
                type="email" 
                placeholder="email@roastery.com" 
                class="w-full bg-white/5 border border-white/10 rounded-full py-5 px-8 text-white placeholder:text-stone-500 focus:border-amber-500/50 focus:outline-none transition-all"
                required
              >
              <button class="absolute right-2 top-2 bottom-2 bg-amber-600 text-white px-10 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-amber-500 transition-all">
                Join
              </button>
            </form>

            <div class="flex justify-center gap-16 mt-16 text-stone-500 text-xs uppercase tracking-wider">
              <span>Free Shipping</span>
              <span>Early Access</span>
              <span>Member Only</span>
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
import { authService } from '@/services/auth'
import ProductCard from '@/components/ProductCard.vue'
import type { Category } from '@/services/categorie'

const categories = ref<Category[]>([])
const allProducts = ref<any[]>([])
const loadingProducts = ref(false)
const isMounted = ref(true)
const scrollContainer = ref<HTMLElement | null>(null)
const router = useRouter()

const isAdmin = computed(() => authService.isAuthenticated() && authService.isAdmin())
const featuredProducts = computed(() => allProducts.value.slice(0, 8))

const handleSubscribe = () => {
  alert('Welcome to the Circle! Check your inbox soon.')
}

const goToEdit = (slug: string) => {
  router.push({ name: 'ProductEdit', params: { slug } })
}

onMounted(async () => {
  await Promise.allSettled([loadCategories(), loadFeaturedProducts()])
})

onUnmounted(() => { isMounted.value = false })

const scrollToProducts = () => {
  document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' })
}

const scrollLeft = () => scrollContainer.value?.scrollBy({ left: -420, behavior: 'smooth' })
const scrollRight = () => scrollContainer.value?.scrollBy({ left: 420, behavior: 'smooth' })

const loadCategories = async () => {
  try {
    const res = await categoryService.getCategories()
    if (isMounted.value) categories.value = res
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

const loadFeaturedProducts = async () => {
  loadingProducts.value = true
  try {
    const res = await productService.getProducts(1)
    if (isMounted.value) allProducts.value = res.data || []
  } catch (error) {
    console.error('Failed to load products:', error)
  } finally {
    loadingProducts.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;700&display=swap');

.font-serif { font-family: 'Playfair Display', serif; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

img { transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1); }
</style>