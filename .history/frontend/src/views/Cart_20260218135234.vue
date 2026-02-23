<template>
  <div class="min-h-screen bg-[#FDFCFB] text-[#2C1810] pb-32 selection:bg-amber-100">
    <div class="bg-[#1a120b] pt-24 pb-32 px-6 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" /></filter><rect width="100%" height="100%" filter="url(#noise)" /></svg>
      </div>
      <div class="container mx-auto text-center relative z-10">
        <h1 class="font-serif text-6xl md:text-7xl text-white mb-4 italic">Your Selection</h1>
        <p class="text-amber-500/80 uppercase tracking-[0.4em] text-[10px] font-black">Review your curated experiences</p>
      </div>
    </div>

    <div class="container mx-auto px-6 -mt-16 relative z-20">
      <div v-if="loading" class="flex flex-col justify-center items-center py-40 bg-white rounded-[3rem] shadow-xl border border-stone-100">
        <div class="w-12 h-12 border-2 border-stone-100 border-t-amber-800 rounded-full animate-spin mb-6"></div>
        <p class="text-stone-400 font-serif italic tracking-widest">Preparing your tray...</p>
      </div>

      <div v-else-if="cartItems.length === 0" class="text-center py-32 bg-white rounded-[3rem] shadow-xl border border-stone-100">
        <div class="text-6xl mb-8">☕</div>
        <h2 class="font-serif text-4xl text-stone-800 mb-4">Your tray is empty</h2>
        <p class="text-stone-400 mb-10 text-lg font-light italic">Every great story starts with a first sip.</p>
        <router-link
          to="/products"
          class="inline-block px-12 py-5 bg-[#2C1810] text-white font-bold rounded-2xl hover:bg-[#3F2A21] transition-all shadow-xl uppercase text-[10px] tracking-[0.2em]"
        >
          Explore Collection
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div class="lg:col-span-8 space-y-6">
          <div v-for="item in cartItems" :key="item.id" 
               class="group bg-white rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-50">
            <div class="flex flex-col md:flex-row gap-8">
              <div class="relative w-full md:w-44 aspect-square rounded-[2rem] overflow-hidden bg-stone-50 flex-shrink-0">
                <img
                  :src="item.product?.primary_image || item.product?.images?.[0] || '/images/placeholder.jpg'"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  @error="handleImageError"
                />
                <div v-if="item.product?.discount_percentage" class="absolute top-4 left-4 bg-rose-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter shadow-lg">
                  {{ item.product.discount_percentage }}% Off 😊
                </div>
              </div>

              <div class="flex-1 flex flex-col justify-between py-2">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-serif text-2xl text-stone-900 mb-1 group-hover:text-amber-800 transition-colors">
                      {{ item.product?.name }}
                    </h3>
                    <p class="text-[9px] uppercase tracking-[0.2em] text-stone-400 font-bold mb-4">
                      {{ item.product?.category?.name || 'Limited Edition' }}
                    </p>
                    
                    <div v-if="item.size" class="flex items-center gap-3 mb-4">
                      <span class="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Size</span>
                      <span class="w-8 h-8 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                        {{ item.size.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="text-right">
                    <div class="text-2xl font-light text-stone-900 tracking-tighter">
                      ${{ (getPrice(item) * item.quantity).toFixed(2) }}
                    </div>
                    <div v-if="item.product?.discount_price" class="text-[10px] text-stone-300 line-through">
                      ${{ (item.product.price * item.quantity).toFixed(2) }}
                    </div>
                  </div>
                </div>

                <div v-if="item.sugar_level !== null" class="mb-6 bg-stone-50 p-4 rounded-2xl border border-stone-100 flex items-center justify-between">
                  <span class="text-[9px] uppercase tracking-widest font-black text-stone-400">Sweetness Profile</span>
                  <div class="flex items-center gap-4">
                    <span class="font-serif italic text-amber-800 text-sm">{{ item.sugar_level }}%</span>
                    <div class="w-24 h-[2px] bg-stone-200 rounded-full overflow-hidden">
                      <div class="h-full bg-amber-600 transition-all duration-1000" :style="{ width: item.sugar_level + '%' }"></div>
                    </div>
                  </div>
                </div>

                <div class="flex items-center justify-between mt-auto">
                  <div class="flex items-center bg-stone-50 border border-stone-100 rounded-xl p-1">
                    <button @click="updateQuantity(item.id, item.quantity - 1)" class="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-stone-900 text-xl transition-colors">−</button>
                    <span class="w-10 text-center font-bold text-sm text-stone-800">{{ item.quantity }}</span>
                    <button @click="tryIncreaseQuantity(item)" class="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-stone-900 text-xl transition-colors">+</button>
                  </div>

                  <button @click="removeItem(item.id)" class="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-300 hover:text-rose-600 transition-colors">
                    Remove Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-4">
          <div class="bg-white rounded-[1.5rem] shadow-2xl p-2 sticky top-8 border border-stone-50">
            <h2 class="font-serif text-3xl text-stone-900 mb-8 italic">Order Summary</h2>
            
            <div class="space-y-4 mb-8 p-4">
              <div class="flex justify-between text-[11px] uppercase tracking-[0.1em] font-bold text-stone-400">
                <span>Subtotal</span>
                <span class="text-stone-900">${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-[11px] uppercase tracking-[0.1em] font-bold text-stone-400">
                <span>Experience Delivery</span>
                <span class="text-stone-900">${{ shipping.toFixed(2) }}</span>
              </div>
              <div v-if="discount > 0" class="flex justify-between text-[11px] uppercase tracking-[0.1em] font-black text-rose-600">
                <span>Special Reward</span>
                <span>-${{ discount.toFixed(2) }}</span>
              </div>
              
              <div class="pt-6 border-t border-stone-100">
                <div class="flex justify-between items-baseline">
                  <span class="font-serif text-2xl text-stone-900 italic">Total</span>
                  <span class="text-4xl font-light text-amber-800 tracking-tighter">${{ total.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <router-link
              :to="{ name: 'Checkout' }"
              class="block w-full py-5 bg-[#2C1810] text-white font-bold text-center rounded-[1.25rem] hover:bg-[#3F2A21] transition-all uppercase text-[10px] tracking-[0.3em] shadow-xl hover:-translate-y-1 active:scale-95 mb-4"
            >
              Confirm Selection
            </router-link>
            
            <p class="text-center text-[9px] text-stone-300 uppercase tracking-widest font-bold">
              Secure checkout by Beautifully
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { cartService } from '@/services/cart'

const cartItems = ref([])
const loading = ref(true)
const shipping = ref(5.0)
const discount = ref(0.0)

const getPrice = (item) => {
  return Number(item.variant?.price ?? item.product?.discount_price ?? item.product?.price ?? 0)
}

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + getPrice(item) * item.quantity, 0)
})

const total = computed(() => {
  return subtotal.value + shipping.value - discount.value
})

const loadCart = async () => {
  loading.value = true
  try {
    const response = await cartService.getCart()
    cartItems.value = response.items
  } catch (err) {
    console.error('Failed to load cart:', err)
  } finally {
    loading.value = false
  }
}

const updateQuantity = async (itemId, newQty) => {
  if (newQty < 1) return
  try {
    const response = await cartService.updateItem(itemId, newQty)
    cartItems.value = response.items
  } catch (err) {
    alert('Failed to update quantity')
  }
}

const tryIncreaseQuantity = (item) => {
  const max = item.product?.stock ?? 99
  if (item.quantity >= max) return
  updateQuantity(item.id, item.quantity + 1)
}

const removeItem = async (itemId) => {
  try {
    const response = await cartService.removeItem(itemId)
    cartItems.value = response.items
  } catch (err) {
    alert('Failed to remove item')
  }
}

const handleImageError = (e) => {
  e.target.src = '/images/placeholder.jpg'
}

onMounted(() => {
  if (localStorage.getItem('token')) loadCart()
  else loading.value = false
})
</script>