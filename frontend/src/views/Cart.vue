<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl font-bold mb-12">Shopping Cart</h1>

      <div v-if="cartItems.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg p-6">
            <div v-for="item in cartItems" :key="item.id" class="border-b last:border-b-0 pb-6 last:pb-0">
              <!-- Item Row -->
              <div class="grid grid-cols-4 gap-4 items-center">
                <!-- Product Image -->
                <router-link 
                  :to="{ name: 'ProductDetail', params: { slug: item.product.slug } }"
                  class="col-span-1"
                >
                  <img 
                    :src="item.product.images?.[0]" 
                    :alt="item.product.name"
                    class="w-full h-24 object-cover rounded-lg hover:opacity-80 transition"
                  />
                </router-link>

                <!-- Product Details -->
                <div class="col-span-2">
                  <router-link 
                    :to="{ name: 'ProductDetail', params: { slug: item.product.slug } }"
                    class="font-bold text-lg hover:text-pink-500 transition"
                  >
                    {{ item.product.name }}
                  </router-link>
                  <p class="text-gray-600 text-sm mt-1">${{ item.price.toFixed(2) }}</p>
                  <div v-if="item.attributes" class="text-xs text-gray-500 mt-2">
                    <span v-for="(val, key) in item.attributes" :key="key">
                      {{ key }}: {{ val }} |
                    </span>
                  </div>
                </div>

                <!-- Quantity -->
                <div class="col-span-1 flex flex-col items-end gap-3">
                  <div class="flex items-center gap-2 border border-gray-300 rounded-lg">
                    <button 
                      @click="updateQuantity(item.id, item.quantity - 1)"
                      class="px-2 py-1 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span class="px-3 py-1">{{ item.quantity }}</span>
                    <button 
                      @click="updateQuantity(item.id, item.quantity + 1)"
                      class="px-2 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <p class="font-bold text-pink-600">${{ (item.price * item.quantity).toFixed(2) }}</p>
                  <button 
                    @click="removeItem(item.id)"
                    class="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div>
          <div class="bg-white rounded-lg p-6 sticky top-6">
            <h2 class="text-2xl font-bold mb-6 pb-4 border-b">Order Summary</h2>

            <!-- Subtotal -->
            <div class="flex justify-between mb-3">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-semibold">${{ subtotal.toFixed(2) }}</span>
            </div>

            <!-- Discount -->
            <div v-if="discount > 0" class="flex justify-between mb-3 text-green-600">
              <span>Discount</span>
              <span class="font-semibold">-${{ discount.toFixed(2) }}</span>
            </div>

            <!-- Shipping -->
            <div class="flex justify-between mb-6 pb-6 border-b">
              <span class="text-gray-600">Shipping</span>
              <span class="font-semibold">${{ shipping.toFixed(2) }}</span>
            </div>

            <!-- Total -->
            <div class="flex justify-between mb-6 text-xl">
              <span class="font-bold">Total</span>
              <span class="font-bold text-pink-600">${{ total.toFixed(2) }}</span>
            </div>

            <!-- Checkout Button -->
            <router-link 
              :to="{ name: 'Checkout' }"
              class="block w-full px-6 py-3 bg-pink-500 text-white rounded-lg font-bold text-center hover:bg-pink-600 transition"
            >
              Proceed to Checkout
            </router-link>

            <!-- Continue Shopping -->
            <router-link 
              :to="{ name: 'Products' }"
              class="block w-full px-6 py-3 border-2 border-pink-500 text-pink-500 rounded-lg font-bold text-center hover:bg-pink-50 transition mt-3"
            >
              Continue Shopping
            </router-link>
          </div>
        </div>
      </div>

      <!-- Empty Cart -->
      <div v-else class="text-center py-16 bg-white rounded-lg">
        <p class="text-2xl text-gray-500 mb-6">Your cart is empty</p>
        <router-link 
          :to="{ name: 'Products' }"
          class="inline-block px-8 py-3 bg-pink-500 text-white rounded-lg font-bold hover:bg-pink-600 transition"
        >
          Start Shopping
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { cartService } from '@/services/cart'

const cartItems = ref<any[]>([])
const shipping = ref(5.00)
const discount = ref(0)
const loading = ref(false)

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    const price = item.product?.discount_price || item.product?.price || 0
    return sum + (price * item.quantity)
  }, 0)
})

const total = computed(() => {
  return subtotal.value - discount.value + shipping.value
})

onMounted(async () => {
  await loadCart()
})

const loadCart = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      cartItems.value = []
      return
    }

    const cart = await cartService.getCart()
    cartItems.value = cart.items || []
  } catch (error) {
    console.error('Error loading cart:', error)
    cartItems.value = []
  } finally {
    loading.value = false
  }
}

const updateQuantity = async (itemId: number, newQuantity: number) => {
  if (newQuantity < 1) return

  try {
    const result = await cartService.updateItem(itemId, newQuantity)
    if (result.cart) {
      cartItems.value = result.cart.items || []
    }
  } catch (error: any) {
    console.error('Error updating quantity:', error)
    alert(error.response?.data?.error || 'Failed to update quantity')
  }
}

const removeItem = async (itemId: number) => {
  try {
    const result = await cartService.removeItem(itemId)
    if (result.cart) {
      cartItems.value = result.cart.items || []
    }
  } catch (error: any) {
    console.error('Error removing item:', error)
    alert('Failed to remove item')
  }
}
</script>
