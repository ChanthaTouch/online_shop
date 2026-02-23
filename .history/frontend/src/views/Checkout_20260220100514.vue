<!-- src/views/Checkout.vue -->
<template>
  <div class="min-h-screen bg-[#faf9f6] text-[#2c1810] pb-32">
    <div class="container mx-auto px-6 max-w-4xl">

      <!-- Checkout Form (before placing order) -->
      <div v-if="!orderSuccess">
        <div class="bg-[#1a120b] py-12 px-6 rounded-b-3xl mb-12">
          <div class="text-center">
            <span class="text-amber-500 text-xs font-bold uppercase tracking-[0.4em] block mb-4">Secure Checkout</span>
            <h1 class="font-serif text-5xl md:text-6xl text-white">Complete Your Order</h1>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Order Summary -->
          <div class="lg:col-span-2">
            <div class="bg-white/60 backdrop-blur-md rounded-3xl shadow-xl p-8 mb-8 border border-white/40">
              <h2 class="font-serif text-3xl text-stone-900 mb-8">Order Review</h2>

              <div v-if="loadingCart" class="flex justify-center py-12">
                <div class="w-10 h-10 border-4 border-stone-200 border-t-amber-600 rounded-full animate-spin"></div>
              </div>

              <div v-else-if="cart.items.length === 0" class="text-center py-12 text-stone-500">
                <p class="text-lg">Your cart is empty</p>
              </div>

              <div v-else class="space-y-4">
                <div v-for="item in cart.items" :key="item.id" class="flex gap-4 pb-4 border-b border-stone-200 last:border-b-0">
                  <img
                    :src="item.product.primary_image || item.product?.images?.[0] || '/images/placeholder.svg'"
                    :alt="item.product.name"
                    class="w-20 h-20 object-cover rounded-2xl shadow-md"
                  />
                  <div class="flex-1">
                    <h3 class="font-serif font-bold text-stone-900">{{ item.product.name }}</h3>
                    <p class="text-stone-500 text-sm">Qty: {{ item.quantity }}</p>
                    <p class="font-bold text-amber-700 font-serif text-lg">
                      ${{ (item.quantity * (item.product.discount_price || item.product.price)).toFixed(2) }}
                    </p>
                  </div>
                </div>

                <div class="pt-6 border-t-2 border-amber-200">
                  <div class="flex justify-between text-2xl font-bold">
                    <span class="text-stone-900">Total</span>
                    <span class="text-amber-700 font-serif">${{ Number(cart.total).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Shipping Form -->
          <div class="lg:col-span-1">
            <form @submit.prevent="handleCheckout" class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-xl p-8 space-y-6 border border-amber-200 sticky top-6">
              <h2 class="font-serif text-2xl text-stone-900 mb-6">Delivery Info</h2>

              <div class="space-y-4">
                <input v-model="form.name" type="text" placeholder="Full Name" class="w-full px-4 py-3 border border-stone-300 rounded-xl focus:border-amber-600 focus:outline-none bg-white/80" required />
                <input v-model="form.phone" type="tel" placeholder="Phone Number" class="w-full px-4 py-3 border border-stone-300 rounded-xl focus:border-amber-600 focus:outline-none bg-white/80" required />
                <input v-model="form.street" type="text" placeholder="Street Address" class="w-full px-4 py-3 border border-stone-300 rounded-xl focus:border-amber-600 focus:outline-none bg-white/80" required />
                <input v-model="form.city" type="text" placeholder="City" class="w-full px-4 py-3 border border-stone-300 rounded-xl focus:border-amber-600 focus:outline-none bg-white/80" required />
                <input v-model="form.province" type="text" placeholder="Province" class="w-full px-4 py-3 border border-stone-300 rounded-xl focus:border-amber-600 focus:outline-none bg-white/80" required />
                <input v-model="form.zip" type="text" placeholder="ZIP Code (optional)" class="w-full px-4 py-3 border border-stone-300 rounded-xl focus:border-amber-600 focus:outline-none bg-white/80" />
              </div>

              <div class="bg-white border-2 border-amber-300 rounded-2xl p-4 text-center">
                <p class="font-bold text-amber-900 mb-1">Payment: Cash on Delivery</p>
                <p class="text-xs text-stone-600">Have exact amount ready for delivery</p>
              </div>

              <button
                type="submit"
                :disabled="submitting || cart.items.length === 0"
                class="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-stone-300 text-white py-4 rounded-full font-bold uppercase text-xs tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span v-if="submitting">Processing...</span>
                <span v-else>Place Order</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Success Screen -->
      <div v-else class="text-center py-24">
        <div class="mb-8 text-6xl">✓</div>
        <h1 class="font-serif text-5xl font-bold mb-6 text-emerald-700">Order Confirmed!</h1>
        
        <p class="text-lg mb-2 text-stone-700">
          Order: <span class="font-serif font-bold text-amber-700">{{ order?.order_number || order?.id }}</span>
        </p>
        
        <p class="text-2xl mb-8 text-stone-700">
          Total: <span class="font-serif font-bold text-amber-700">${{ Number(orderTotal).toFixed(2) }}</span>
        </p>

        <!-- Points Earned Section -->
        <div v-if="pointsEarned" class="bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-400 rounded-3xl p-8 mb-12 inline-block shadow-lg">
          <div class="flex items-center gap-4 justify-center">
            <svg class="w-10 h-10 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <div class="text-left">
              <p class="text-xs text-amber-700 font-bold uppercase tracking-widest">Points Earned</p>
              <p class="text-3xl font-serif font-bold text-amber-800">+{{ pointsEarned }}</p>
              <p class="text-xs text-amber-700 mt-1">Balance: <span class="font-bold">{{ totalPoints }}</span></p>
            </div>
          </div>
        </div>

        <div class="bg-white/70 backdrop-blur-md border-2 border-amber-300 rounded-3xl p-8 mb-12 max-w-2xl mx-auto shadow-lg">
          <p class="text-lg mb-4 font-serif font-bold text-stone-900">Next Steps</p>
          <div class="space-y-3 text-stone-700">
            <p class="flex items-center gap-2"><span class="font-bold text-amber-600">1.</span> SMS sent to your phone with payment details</p>
            <p class="flex items-center gap-2"><span class="font-bold text-amber-600">2.</span> Payment: Cash on Delivery when driver arrives</p>
            <p class="flex items-center gap-2"><span class="font-bold text-amber-600">3.</span> We'll contact you to confirm delivery details</p>
          </div>
        </div>

        <div class="mt-12">
          <p class="text-stone-600 mb-6">Your order will be prepared and shipped soon</p>
          <router-link
            to="/orders"
            class="inline-block bg-amber-600 hover:bg-amber-500 text-white px-10 py-4 rounded-full font-bold uppercase text-xs tracking-wider transition-all shadow-lg"
          >
            View My Orders
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { cartService } from '@/services/cart'
import { orderService } from "@/services/orders";
const cart = ref<any>({ items: [], total: 0 })
const loadingCart = ref(true)
const submitting = ref(false)
const orderSuccess = ref(false)
const orderTotal = ref<number>(0)
const order = ref<any>(null)
const pointsEarned = ref(0)
const totalPoints = ref(0)

const form = ref({
  name: '',
  phone: '',
  street: '',
  city: '',
  province: '',
  zip: '',
})

onMounted(async () => {
  try {
    const response = await cartService.getCart()
    cart.value = response
    // Ensure total is number (in case backend sends string)
    orderTotal.value = Number(response.total) || 0
  } catch (err) {
    console.error('Failed to load cart:', err)
    alert('Failed to load cart. Please try again.')
  } finally {
    loadingCart.value = false
  }
})

const handleCheckout = async () => {
  if (cart.value.items.length === 0) {
    alert('Your cart is empty')
    return
  }

  submitting.value = true
  try {
    const shipping_address = {
      name: form.value.name.trim(),
      phone: form.value.phone.trim(),
      street: form.value.street.trim(),
      city: form.value.city.trim(),
      province: form.value.province.trim(),
      zip: form.value.zip.trim() || null,
    }

    const response = await orderService.checkout(shipping_address, 'aba_pay') as any

    order.value = response.order
    // Critical fix: Laravel casts decimal:2 → string in JSON, so convert to number
    orderTotal.value = Number(response.order.total) || 0
    
    // Extract points earned from response
    pointsEarned.value = response.points_earned || 0
    totalPoints.value = response.total_points || 0

    orderSuccess.value = true
  } catch (error: any) {
    const msg = error.response?.data?.message || error.response?.data?.errors || 'Failed to place order. Please try again.'
    alert(msg)
    console.error('Checkout error:', error.response?.data)
  } finally {
    submitting.value = false
  }
}
</script>