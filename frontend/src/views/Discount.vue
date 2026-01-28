<template>
  <div class="min-h-screen py-12">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl font-bold mb-12 text-center">🎉 Special Discounts</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="discount in discounts" :key="discount.id" class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
          <div class="bg-pink-500 text-white p-6 text-center">
            <p class="text-5xl font-bold">{{ discount.percentage }}%</p>
            <p class="text-lg mt-2">OFF</p>
          </div>
          <div class="p-6">
            <h3 class="font-bold text-lg mb-2">{{ discount.title }}</h3>
            <p class="text-gray-600 mb-4">{{ discount.description }}</p>
            <router-link 
              :to="discount.link"
              class="block text-center px-4 py-2 bg-pink-500 text-white rounded-lg font-bold hover:bg-pink-600 transition"
            >
              Shop Now
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const discounts = ref([
  {
    id: 1,
    percentage: 50,
    title: 'Summer Collection',
    description: 'Get up to 50% off on our summer dresses',
    link: '/products?category=dresses'
  },
  {
    id: 2,
    percentage: 30,
    title: 'Shoes Sale',
    description: 'Save 30% on selected shoes',
    link: '/products?category=shoes'
  },
  {
    id: 3,
    percentage: 25,
    title: 'Accessories',
    description: 'Enjoy 25% discount on all accessories',
    link: '/products?category=accessories'
  }
])
</script>
