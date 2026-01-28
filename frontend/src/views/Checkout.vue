<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Checkout Form -->
        <div class="lg:col-span-2">
          <form @submit.prevent="submitOrder" class="space-y-6">
            <!-- Shipping Address -->
            <div class="bg-white rounded-lg p-6">
              <h2 class="text-2xl font-bold mb-6">Shipping Address</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  v-model="form.shippingAddress.first_name"
                  type="text"
                  placeholder="First Name"
                  class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  required
                />
                <input 
                  v-model="form.shippingAddress.last_name"
                  type="text"
                  placeholder="Last Name"
                  class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <input 
                v-model="form.shippingAddress.email"
                type="email"
                placeholder="Email"
                class="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                required
              />

              <input 
                v-model="form.shippingAddress.phone"
                type="tel"
                placeholder="Phone Number"
                class="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                required
              />

              <input 
                v-model="form.shippingAddress.street"
                type="text"
                placeholder="Street Address"
                class="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                required
              />

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <input 
                  v-model="form.shippingAddress.city"
                  type="text"
                  placeholder="City"
                  class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  required
                />
                <input 
                  v-model="form.shippingAddress.state"
                  type="text"
                  placeholder="State"
                  class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                />
                <input 
                  v-model="form.shippingAddress.zip"
                  type="text"
                  placeholder="ZIP Code"
                  class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  required
                />
              </div>
            </div>

            <!-- Payment Method -->
            <div class="bg-white rounded-lg p-6">
              <h2 class="text-2xl font-bold mb-6">Payment Method</h2>

              <div class="space-y-3">
                <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer" :class="form.paymentMethod === 'card' ? 'border-pink-500 bg-pink-50' : 'border-gray-300'">
                  <input 
                    v-model="form.paymentMethod"
                    type="radio"
                    value="card"
                    name="payment"
                    class="mr-3"
                  />
                  <span class="font-semibold">Credit/Debit Card</span>
                </label>

                <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer" :class="form.paymentMethod === 'bank_transfer' ? 'border-pink-500 bg-pink-50' : 'border-gray-300'">
                  <input 
                    v-model="form.paymentMethod"
                    type="radio"
                    value="bank_transfer"
                    name="payment"
                    class="mr-3"
                  />
                  <span class="font-semibold">Bank Transfer</span>
                </label>

                <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer" :class="form.paymentMethod === 'cash' ? 'border-pink-500 bg-pink-50' : 'border-gray-300'">
                  <input 
                    v-model="form.paymentMethod"
                    type="radio"
                    value="cash"
                    name="payment"
                    class="mr-3"
                  />
                  <span class="font-semibold">Cash on Delivery</span>
                </label>
              </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="bg-white rounded-lg p-6">
              <label class="flex items-start gap-3 cursor-pointer">
                <input 
                  v-model="form.agreedToTerms"
                  type="checkbox"
                  class="mt-1"
                  required
                />
                <span class="text-sm text-gray-600">
                  I agree to the <a href="#" class="text-pink-500 hover:underline">terms and conditions</a> and 
                  <a href="#" class="text-pink-500 hover:underline">privacy policy</a>
                </span>
              </label>
            </div>

            <!-- Place Order Button -->
            <button 
              type="submit"
              :disabled="isSubmitting"
              class="w-full px-6 py-4 bg-pink-500 text-white rounded-lg font-bold text-lg hover:bg-pink-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              <span v-if="!isSubmitting">Place Order - ${{ orderTotal.toFixed(2) }}</span>
              <span v-else>Processing...</span>
            </button>
          </form>
        </div>

        <!-- Order Summary -->
        <div>
          <div class="bg-white rounded-lg p-6 sticky top-6">
            <h2 class="text-2xl font-bold mb-6 pb-4 border-b">Order Summary</h2>

            <!-- Items List -->
            <div class="space-y-3 mb-6 max-h-64 overflow-y-auto">
              <div v-for="item in cartItems" :key="item.id" class="flex justify-between text-sm pb-3 border-b">
                <div>
                  <p class="font-semibold">{{ item.product.name }}</p>
                  <p class="text-gray-600">x{{ item.quantity }}</p>
                </div>
                <span class="font-semibold">${{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>

            <!-- Totals -->
            <div class="space-y-2 mb-6 pb-6 border-b">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Shipping</span>
                <span>${{ shipping.toFixed(2) }}</span>
              </div>
              <div v-if="discount > 0" class="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-${{ discount.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Grand Total -->
            <div class="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span class="text-pink-600">${{ orderTotal.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { cartService } from '@/services/cart'
import { authService } from '@/services/auth'

const router = useRouter()
const cartItems = ref<any[]>([])
const isSubmitting = ref(false)
const loading = ref(false)
const shipping = ref(5.00)
const discount = ref(0)

const form = ref({
  shippingAddress: {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: ''
  },
  paymentMethod: 'card',
  agreedToTerms: false
})

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    const price = item.product?.discount_price || item.product?.price || 0
    return sum + (price * item.quantity)
  }, 0)
})

const orderTotal = computed(() => {
  return subtotal.value - discount.value + shipping.value
})

onMounted(async () => {
  if (!authService.isAuthenticated()) {
    router.push({ name: 'Login' })
    return
  }

  await loadCart()
})

const loadCart = async () => {
  loading.value = true
  try {
    const cart = await cartService.getCart()
    cartItems.value = cart.items || []
    
    if (cartItems.value.length === 0) {
      alert('Your cart is empty!')
      router.push({ name: 'Cart' })
    }
  } catch (error) {
    console.error('Error loading cart:', error)
    cartItems.value = []
  } finally {
    loading.value = false
  }
}

const submitOrder = async () => {
  if (!form.value.agreedToTerms) {
    alert('Please agree to terms and conditions')
    return
  }

  if (!form.value.shippingAddress.first_name || !form.value.shippingAddress.email) {
    alert('Please fill in all required fields')
    return
  }

  isSubmitting.value = true
  try {
    // In a real app, this would save to backend
    const orderId = '#' + Math.random().toString(36).substr(2, 9).toUpperCase()
    
    // Clear cart
    await cartService.clearCart()
    
    alert(`✅ Order placed successfully! Order ID: ${orderId}`)
    router.push({ name: 'Orders' })
  } catch (error) {
    console.error('Error placing order:', error)
    alert('Failed to place order. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
