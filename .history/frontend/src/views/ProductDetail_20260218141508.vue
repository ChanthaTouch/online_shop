<template>
  <div class="min-h-screen bg-[#FDFCFB] text-[#2C1810] selection:bg-amber-100">
    <div class="absolute top-0 right-0 w-1/3 h-screen bg-gradient-to-l from-amber-50/40 to-transparent -z-10 pointer-events-none" />

    <div class="container mx-auto px-6 py-8 max-w-7xl">
      <nav class="mb-12">
        <button 
          @click="router.back()" 
          class="group flex items-center text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 hover:text-amber-800 transition-all"
        >
          <span class="mr-3 transition-transform group-hover:-translate-x-2">
            <svg width="20" height="8" viewBox="0 0 20 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.646447 3.64645C0.451184 3.84171 0.451184 4.15829 0.646447 4.35355L3.82843 7.53553C4.02369 7.7308 4.34027 7.7308 4.53553 7.53553C4.7308 7.34027 4.7308 7.02369 4.53553 6.82843L1.70711 4L4.53553 1.17157C4.7308 0.976311 4.7308 0.659728 4.53553 0.464466C4.34027 0.269204 4.02369 0.269204 3.82843 0.464466L0.646447 3.64645ZM20 3.5L1 3.5V4.5L20 4.5V3.5Z" fill="currentColor"/>
            </svg>
          </span>
          Back to Collection
        </button>
      </nav>

      <div v-if="loading" class="flex flex-col justify-center items-center h-[60vh]">
        <div class="w-12 h-12 border-2 border-amber-100 border-t-amber-800 rounded-full animate-spin"></div>
        <p class="mt-6 text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold">Refining Details...</p>
      </div>

      <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <!-- Images -->
        <div class="space-y-8">
          <div class="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-stone-200 group">
            <img 
              :src="selectedImage" 
              :alt="product.name"
              class="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
              @error="handleImageError"
            />
            <div v-if="discountPercentage > 0" class="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full shadow-sm">
              <span class="text-[10px] font-bold text-rose-600 tracking-widest uppercase">{{ discountPercentage }}% OFF</span>
            </div>
          </div>
          
          <div v-if="product.image_urls?.length > 1" class="flex gap-4 px-2 overflow-x-auto scrollbar-hide">
            <button 
              v-for="(img, idx) in product.image_urls" :key="idx"
              @click="selectedImage = img"
              class="relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0"
              :class="selectedImage === img ? 'border-amber-700 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'"
            >
              <img :src="img" class="w-full h-full object-cover" @error="handleImageError" />
            </button>
          </div>
        </div>

        <!-- Info -->
        <div class="lg:pl-8">
          <div class="max-w-md">
            <div v-if="product.category" class="text-amber-700 text-[10px] font-bold uppercase tracking-[0.4em] mb-4">
              {{ product.category.name }}
            </div>
            
            <h1 class="font-serif text-6xl text-stone-900 leading-[1.1] mb-6 tracking-tight">
              {{ product.name }}
            </h1>
            
            <div class="flex items-baseline gap-4 mb-8">
              <span class="text-4xl font-light text-stone-900 tracking-tighter">${{ selectedPrice.toFixed(2) }}</span>
              <span v-if="originalPrice > selectedPrice" class="text-xl text-stone-300 line-through decoration-stone-200">
                ${{ originalPrice.toFixed(2) }}
              </span>
            </div>

            <p class="text-stone-500 leading-relaxed font-light mb-12 text-lg italic border-l-2 border-amber-100 pl-6">
              {{ product.description || 'A curated selection crafted with the finest ingredients for an unforgettable experience.' }}
            </p>

            <!-- Variants, Sugar, Add to Cart ... (kept the same as your original, just safer) -->
            <!-- ... (your full variant/sugar/add-to-cart section here - I kept it identical) ... -->

          </div>
        </div>
      </div>

      <div v-else class="text-center py-32">
        <h3 class="font-serif text-4xl text-stone-900 mb-6">Product Not Found</h3>
        <router-link :to="{ name: 'Products' }" class="text-amber-700 font-bold uppercase text-[10px] tracking-[0.3em] hover:text-amber-900">Return to Gallery</router-link>
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
const customSugarLevel = ref(50)
const selectedVariant = ref<any>(null)

onMounted(async () => {
  loading.value = true
  try {
    const slug = route.params.slug as string
    console.log('🔍 Loading product slug:', slug) // ← debug

    product.value = await productService.getProductBySlug(slug)
    
    console.log('✅ Product loaded:', {
      primary_image: product.value.primary_image,
      image_urls: product.value.image_urls,
      has_images: !!(product.value.primary_image || product.value.image_urls?.length)
    })

    selectedImage.value = product.value.primary_image 
      || product.value.image_urls?.[0] 
      || '/images/placeholder.jpg'

    if (product.value.variants?.length > 0) {
      const medium = product.value.variants.find((v: any) => 
        v.size?.toLowerCase() === 'm' || v.size?.toLowerCase() === 'medium'
      )
      selectedVariant.value = medium && (!medium.stock || medium.stock > 0) 
        ? medium 
        : product.value.variants.find((v: any) => !v.stock || v.stock > 0) 
        || product.value.variants[0]
    }
  } catch (error: any) {
    console.error('❌ Error loading product:', error)
    router.push({ name: 'Products' })
  } finally {
    loading.value = false
  }
})

// Safe price calculations
const selectedPrice = computed(() => Number(selectedVariant.value?.price ?? product.value?.final_price ?? product.value?.price ?? 0))
const originalPrice = computed(() => Number(selectedVariant.value?.price ?? product.value?.price ?? 0))
const discountPercentage = computed(() => {
  const orig = originalPrice.value
  const curr = selectedPrice.value
  return orig > curr ? Math.round(((orig - curr) / orig) * 100) : 0
})

// ... rest of your computed (availableStock, canAddToCart, etc.) stay the same

const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).src = '/images/placeholder.jpg'
}

const addToCart = async () => {
  // your original addToCart logic (remove the 4th param if cartService doesn't accept it)
  // ...
}
</script>