<template>
  <div class="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
    <!-- Product Image -->
    <router-link 
      :to="{ name: 'ProductDetail', params: { slug: product.slug } }"
      class="relative block overflow-hidden bg-gray-200 h-72"
    >
      <img 
        :src="product.images?.[0]" 
        :alt="product.name"
        class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
      />
      <!-- Badge -->
      <div v-if="product.discount_price" class="absolute top-3 right-3 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
        SALE
      </div>
    </router-link>

    <!-- Product Info -->
    <div class="p-5 flex flex-col flex-grow">
      <!-- Category -->
      <div v-if="product.category" class="text-xs text-gray-500 mb-2">
        {{ product.category.name }}
      </div>

      <!-- Product Name -->
      <router-link 
        :to="{ name: 'ProductDetail', params: { slug: product.slug } }"
        class="font-bold text-gray-800 hover:text-pink-500 transition line-clamp-2 text-sm md:text-base flex-grow"
      >
        {{ product.name }}
      </router-link>

      <!-- Price -->
      <div class="mt-4 flex items-baseline gap-2">
        <span class="text-pink-600 font-bold text-lg">
          ${{ (product.discount_price || product.price).toFixed(2) }}
        </span>
        <span v-if="product.discount_price" class="text-gray-500 line-through text-sm">
          ${{ product.price.toFixed(2) }}
        </span>
      </div>

      <!-- Stock Status -->
      <div class="mt-3 mb-4">
        <span :class="[
          'text-xs font-semibold',
          product.stock > 5 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
        ]">
          {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
        </span>
      </div>

      <!-- Add to Cart Button -->
      <button 
        @click="handleAddToCart"
        :disabled="product.stock === 0"
        class="w-full px-4 py-2 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-sm"
      >
        <span v-if="product.stock > 0">Add to Cart</span>
        <span v-else>Out of Stock</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const quantity = ref(1)

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])

const handleAddToCart = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push({ name: 'Login' })
    return
  }

  emit('add-to-cart', props.product.id)
}
</script>
