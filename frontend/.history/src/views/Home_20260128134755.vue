<template>
  <div
    class="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
  >
    <!-- Image wrapper -->
    <div class="relative aspect-square overflow-hidden bg-gray-50">
      <img
        :src="product.image || 'https://via.placeholder.com/400?text=Product'"
        :alt="product.name"
        class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        loading="lazy"
      />

      <!-- Discount badge -->
      <div
        v-if="hasDiscount"
        class="absolute top-3 left-3 z-10 px-2.5 py-1 text-xs font-bold text-white bg-pink-600 rounded-full shadow-sm"
      >
        -{{ discountPercentage }}%
      </div>

      <!-- Stock indicator -->
      <div
        v-if="product.stock != null"
        class="absolute top-3 right-3 z-10 px-2.5 py-1 text-xs font-medium rounded-full shadow-sm backdrop-blur-sm"
        :class="stockClasses"
      >
        {{ stockText }}
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col flex-grow">
      <!-- Name -->
      <h3
        class="text-base sm:text-lg font-semibold text-gray-800 mb-1.5 line-clamp-2 min-h-[2.5rem] group-hover:text-pink-700 transition-colors"
      >
        {{ product.name }}
      </h3>

      <!-- Price area -->
      <div class="mt-auto mb-4">
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-bold text-gray-900">
            ${{ formattedCurrentPrice }}
          </span>

          <span
            v-if="hasDiscount"
            class="text-sm text-gray-500 line-through"
          >
            ${{ product.price.toFixed(2) }}
          </span>
        </div>
      </div>

      <!-- Action button -->
      <button
        @click="emitAddToCart"
        :disabled="isOutOfStock"
        class="w-full py-3.5 px-5 font-medium rounded-xl text-white transition-colors flex items-center justify-center gap-2 text-base"
        :class="buttonClasses"
      >
        <svg
          v-if="isOutOfStock"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>

        {{ isOutOfStock ? 'Sold Out' : 'Add to Cart' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  product: {
    id: number
    name: string
    price: number
    discountPrice?: number
    image?: string
    stock?: number
    [key: string]: any
  }
}>()

const emit = defineEmits<{
  (e: 'add-to-cart', productId: number): void
}>()

const hasDiscount = computed(() => props.product.discountPrice != null && props.product.discountPrice < props.product.price)

const discountPercentage = computed(() => {
  if (!hasDiscount.value) return 0
  return Math.round((1 - props.product.discountPrice! / props.product.price) * 100)
})

const currentPrice = computed(() => props.product.discountPrice ?? props.product.price)
const formattedCurrentPrice = computed(() => currentPrice.value.toFixed(2))

const isOutOfStock = computed(() => (props.product.stock ?? 999) <= 0)

const stockText = computed(() => {
  const stock = props.product.stock ?? 999
  if (stock <= 0) return 'Out of stock'
  if (stock <= 5) return `Only ${stock} left!`
  return `${stock} in stock`
})

const stockClasses = computed(() => {
  const stock = props.product.stock ?? 999
  if (stock <= 0) return 'text-red-700 bg-red-50 border border-red-200'
  if (stock <= 5) return 'text-amber-700 bg-amber-50 border border-amber-200'
  return 'text-green-700 bg-green-50 border border-green-200'
})

const buttonClasses = computed(() => {
  if (isOutOfStock.value) {
    return 'bg-gray-300 hover:bg-gray-400 cursor-not-allowed'
  }
  return 'bg-pink-600 hover:bg-pink-700 active:bg-pink-800'
})

const emitAddToCart = () => {
  if (!isOutOfStock.value) {
    emit('add-to-cart', props.product.id)
  }
}
</script>