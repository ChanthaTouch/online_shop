<template>
  <div class="min-h-screen bg-[#faf9f6] text-[#2c1810] pb-32">
    <div class="bg-[#1a120b] py-12 px-6 mb-12 rounded-b-3xl">
      <div class="container mx-auto">
        <h1 class="font-serif text-5xl md:text-6xl text-white mb-2">Special Offers</h1>
        <p class="text-stone-300 text-sm uppercase tracking-widest font-bold">Exclusive Member Deals</p>
      </div>
    </div>

    <div class="container mx-auto px-6" style="margin-top: -2rem">
      <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          <p class="mt-4 text-stone-600">Loading special offers...</p>
        </div>
      </div>
      <div v-else-if="discounts.length === 0" class="text-center py-12">
        <p class="text-stone-600 text-lg">No special offers available at the moment.</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="discount in discounts" :key="discount.id" class="group bg-white/60 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-white/40 hover:-translate-y-2">
          <div class="bg-gradient-to-br from-amber-600 to-orange-600 p-8 text-center text-white relative overflow-hidden">
            <div class="absolute inset-0 opacity-10">
              <svg width="100" height="100" class="opacity-20"><circle cx="50" cy="50" r="45" stroke="white" stroke-width="2" fill="none"/></svg>
            </div>
            <p class="font-serif text-6xl font-bold relative z-10">{{ discount.value }}<span class="text-3xl">%</span></p>
            <p class="text-amber-100 text-sm uppercase tracking-widest font-bold mt-2 relative z-10">OFF</p>
          </div>
          <div class="p-8">
            <h3 class="font-serif text-2xl text-stone-900 mb-3">{{ discount.title || discount.code }}</h3>
            <p class="text-stone-600 mb-6 text-sm leading-relaxed">{{ discount.description || `Save ${discount.value}% on your purchase` }}</p>
            <router-link 
              :to="{ name: 'Products', query: { discount: discount.value } }"
              class="block w-full text-center px-6 py-3 bg-amber-600 text-white rounded-full font-bold hover:bg-amber-500 transition-all uppercase text-xs tracking-wider shadow-lg"
            >
              Explore Now
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { discountService, type Discount } from '@/services/discount'

const discounts = ref<Discount[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

/* Fetch discounts from backend */
const fetchDiscounts = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await discountService.getActiveOffers()
    discounts.value = response
  } catch (err: any) {
    console.error('Error fetching discounts:', err)
    error.value = err?.message || 'Failed to load special offers'
    // Fallback to default offers if API fails
    discounts.value = [
      {
        id: 1,
        code: 'SUMMER50',
        value: 50,
        type: 'percentage',
        title: 'Summer Collection',
        description: 'Get up to 50% off on our summer collection',
        link: '/products',
        active: true,
      },
      {
        id: 2,
        code: 'SAVE30',
        value: 30,
        type: 'percentage',
        title: 'Special 30% Off',
        description: 'Save 30% on selected items',
        link: '/products',
        active: true,
      },
      {
        id: 3,
        code: 'EXTRA25',
        value: 25,
        type: 'percentage',
        title: 'Extra 25% Discount',
        description: 'Enjoy 25% discount on our entire catalog',
        link: '/products',
        active: true,
      }
    ]
  } finally {
    loading.value = false
  }
}

/* Load discounts on component mount */
onMounted(() => {
  fetchDiscounts()
})
</script>
