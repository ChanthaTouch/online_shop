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

            <div class="space-y-12">
              <div v-if="product.variants?.length > 0">
                <span class="block text-[11px] uppercase tracking-[0.15em] font-bold text-stone-400 mb-5">Select Experience Size</span>
                <div class="flex flex-wrap gap-4">
                  <button
                    v-for="variant in product.variants" :key="variant.size"
                    @click="selectVariant(variant)"
                    :disabled="variant.stock !== undefined && variant.stock <= 0"
                    class="relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all border transition-all duration-300"
                    :class="{
                      'bg-stone-900 text-white border-stone-900 scale-110 shadow-lg': selectedVariant?.size === variant.size,
                      'bg-transparent border-stone-200 text-stone-600 hover:border-stone-400': selectedVariant?.size !== variant.size,
                      'opacity-30 cursor-not-allowed': variant.stock !== undefined && variant.stock <= 0
                    }"
                  >
                    {{ variant.size.charAt(0).toUpperCase() }}
                  </button>
                </div>
              </div>

              <div v-if="product.sugar_level !== null" class="space-y-8">
                <div class="flex justify-between items-center">
                  <span class="text-[11px] uppercase tracking-[0.15em] font-bold text-stone-400">Sweetness Profile</span>
                </div>
                <div class="bg-stone-50/50 p-8 rounded-[2.5rem] border border-stone-100">
                   <div class="flex justify-between items-center mb-6">
                    <span class="font-serif text-2xl italic text-amber-800">{{ customSugarLevel }}%</span>
                  </div>
                  <input 
                    v-model.number="customSugarLevel"
                    type="range" min="0" max="100" step="25"
                    class="w-full h-[2px] bg-stone-200 appearance-none cursor-pointer accent-stone-900"
                  />
                  <div class="flex justify-between mt-4 text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                    <span>Zero</span>
                    <span>Balanced</span>
                    <span>Full Sweet</span>
                  </div>
                </div>
              </div>

              <div v-if="availableStock > 0" class="space-y-6 pt-4">
                <div class="flex items-center gap-4">
                  <div class="flex items-center bg-white border border-stone-200 rounded-2xl p-1 shadow-sm">
                    <button @click="quantity > 1 ? quantity-- : null" class="w-12 h-12 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-colors text-xl">−</button>
                    <input v-model.number="quantity" readonly class="w-10 text-center font-bold text-stone-900 bg-transparent focus:outline-none" />
                    <button @click="quantity < maxQuantity ? quantity++ : null" class="w-12 h-12 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-colors text-xl">+</button>
                  </div>

                  <button 
                    @click="addToCart"
                    :disabled="adding || !canAddToCart"
                    class="flex-1 bg-[#2C1810] hover:bg-[#3F2A21] disabled:bg-stone-200 text-white h-14 rounded-2xl font-bold uppercase text-[10px] tracking-[0.25em] transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <span v-if="!adding">Reserve for Cart</span>
                    <span v-else class="flex items-center gap-2">
                      <div class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </span>
                  </button>
                </div>
                
                <p class="text-center text-[10px] uppercase tracking-[0.2em] font-bold" :class="availableStock < 5 ? 'text-rose-600' : 'text-stone-400'">
                  {{ availableStockMessage }}
                </p>
              </div>

              <div v-else class="p-8 rounded-2xl bg-stone-100 text-stone-400 text-center font-bold uppercase text-[10px] tracking-widest border border-dashed border-stone-200">
                Currently Unavailable
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-32">
        <h3 class="font-serif text-4xl text-stone-900 mb-6">Discovery Unsuccessful</h3>
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
    product.value = await productService.getProductBySlug(slug)
    
    selectedImage.value = product.value.primary_image 
      || (product.value.image_urls?.[0]) 
      || product.value.display_image
      || '/images/placeholder.svg'

    if (product.value.variants?.length > 0) {
      // Logic Update: Try to default to 'M' (Medium) if it exists, otherwise find first available
      const mediumVariant = product.value.variants.find((v: any) => 
        v.size.toLowerCase() === 'm' || v.size.toLowerCase() === 'medium'
      )
      
      if (mediumVariant && (!mediumVariant.stock || mediumVariant.stock > 0)) {
        selectedVariant.value = mediumVariant
      } else {
        const firstAvailable = product.value.variants.find((v: any) => !v.stock || v.stock > 0)
        selectedVariant.value = firstAvailable || product.value.variants[0]
      }
    }
  } catch (error: any) {
    console.error('Error loading product:', error)
    router.push({ name: 'Products' })
  } finally {
    loading.value = false
  }
})

const selectedPrice = computed(() => {
  if (selectedVariant.value?.price != null) return Number(selectedVariant.value.price)
  return Number(product.value?.discount_price ?? product.value?.price ?? 0)
})

const originalPrice = computed(() => {
  return Number(selectedVariant.value?.original_price ?? product.value?.price ?? 0)
})

const discountPercentage = computed(() => {
  if (originalPrice.value <= 0) return 0
  const diff = originalPrice.value - selectedPrice.value
  return diff > 0 ? Math.round((diff / originalPrice.value) * 100) : 0
})

const availableStock = computed(() => {
  if (selectedVariant.value?.stock != null) return selectedVariant.value.stock
  return product.value?.stock ?? 0
})

const maxQuantity = computed(() => Math.max(availableStock.value, 1))

const availableStockMessage = computed(() => {
  if (availableStock.value === 0) return 'Fully Booked'
  if (availableStock.value < 5) return `Only ${availableStock.value} remain`
  return `${availableStock.value} Units Available`
})

const canAddToCart = computed(() => {
  if (product.value?.variants?.length > 0) return !!selectedVariant.value && availableStock.value > 0
  return availableStock.value > 0
})

const selectVariant = (variant: any) => {
  if (variant.stock !== undefined && variant.stock <= 0) return
  selectedVariant.value = variant
  quantity.value = 1
}

const addToCart = async () => {
  if (!product.value || !canAddToCart.value) return
  const token = localStorage.getItem('token')
  if (!token) { router.push({ name: 'Login' }); return }

  adding.value = true
  try {
    const sugar = product.value.sugar_level !== null ? customSugarLevel.value : null
    const variantData = product.value.variants?.length > 0 && selectedVariant.value ? {
      size: selectedVariant.value.size,
      price: selectedVariant.value.price,
      variant_index: product.value.variants.indexOf(selectedVariant.value)
    } : undefined

    await cartService.addItem(product.value.id, quantity.value, sugar, variantData)
    localStorage.setItem('cartUpdated', Date.now().toString())
    quantity.value = 1
  } catch (error: any) {
    alert(error.response?.data?.message || 'Something went wrong')
  } finally {
    adding.value = false
  }
}

const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).src = '/images/placeholder.svg'
}
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
/* Custom Range Styling */
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: #2c1810;
  cursor: pointer;
  border: 3px solid #fff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
</style>