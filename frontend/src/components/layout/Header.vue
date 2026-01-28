<!-- src/components/layout/Header.vue -->
<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <!-- Top Bar -->
    <div class="bg-pink-500 text-white text-center py-2 text-sm">
      ⭐⭐⭐⭐⭐ The world's highest rated free ecommerce platform
    </div>

    <!-- Main Navigation -->
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2">
          <div class="text-2xl font-black text-pink-500">NAK NAK</div>
          <div class="text-sm font-bold text-gray-700">STORE</div>
        </router-link>

        <!-- Nav Links - Desktop (visible on md and up) -->
        <nav class="hidden md:flex items-center gap-8">
          <router-link
            to="/products"
            class="font-semibold text-gray-700 hover:text-pink-500 transition"
            active-class="text-pink-500"
          >
            Product
          </router-link>
          <router-link
            to="/discount"
            class="font-semibold text-gray-700 hover:text-pink-500 transition"
            active-class="text-pink-500"
          >
            Discount
          </router-link>
          <router-link
            v-if="isAdmin"
            to="/admin"
            class="font-semibold text-gray-700 hover:text-pink-500 transition"
            active-class="text-pink-500"
          >
            Admin
          </router-link>
        </nav>

        <!-- Right Section -->
        <div class="flex items-center gap-6">
          <!-- Cart Icon -->
          <router-link to="/cart" class="relative group">
            <svg
              class="w-6 h-6 text-gray-700 group-hover:text-pink-500 transition"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span
              v-if="cartCount > 0"
              class="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ cartCount }}
            </span>
          </router-link>

          <!-- User Menu (when logged in) -->
          <div v-if="isAuthenticated" class="relative group">
            <button class="flex items-center gap-2 focus:outline-none">
              <svg
                class="w-6 h-6 text-gray-700 group-hover:text-pink-500 transition"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
            </button>

            <!-- Dropdown -->
            <div
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500"
              >
                My Profile
              </router-link>
              <router-link
                to="/orders"
                class="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500"
              >
                My Orders
              </router-link>
              <hr class="my-2" />
              <button
                @click="logout"
                class="w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500"
              >
                Logout
              </button>
            </div>
          </div>

          <!-- Login / Register (when not logged in) -->
          <div v-else class="flex items-center gap-3">
            <router-link
              to="/register"
              class="px-4 py-2 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition"
            >
              Register
            </router-link>
            <router-link
              to="/login"
              class="px-4 py-2 text-gray-700 border-2 border-gray-300 rounded-lg font-semibold hover:border-pink-500 hover:text-pink-500 transition"
            >
              Login
            </router-link>
          </div>

          <!-- Mobile Menu Button -->
          <button class="md:hidden focus:outline-none" @click="mobileMenuOpen = !mobileMenuOpen">
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden pb-4 border-t">
        <router-link
          to="/products"
          class="block px-4 py-3 font-semibold text-gray-700 hover:text-pink-500"
          @click="mobileMenuOpen = false"
        >
          Product
        </router-link>
        <router-link
          to="/discount"
          class="block px-4 py-3 font-semibold text-gray-700 hover:text-pink-500"
          @click="mobileMenuOpen = false"
        >
          Discount
        </router-link>
        <router-link
          v-if="isAdmin"
          to="/admin"
          class="block px-4 py-3 font-semibold text-gray-700 hover:text-pink-500"
          @click="mobileMenuOpen = false"
        >
          Admin
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { cartService } from '@/services/cart'

const router = useRouter()
const route = useRoute()
const mobileMenuOpen = ref(false)
const cartCount = ref(0)

// Fetch cart count on mount and when cart route is left
const updateCartCount = () => {
  cartCount.value = cartService.getCartItemCount()
}

onMounted(() => {
  updateCartCount()
})

// Watch for route changes to update cart count
watch(() => route.path, () => {
  if (route.name === 'Cart') {
    updateCartCount()
  }
})

const isAuthenticated = computed(() => !!localStorage.getItem('token'))
const isAdmin = computed(() => localStorage.getItem('userRole') === 'admin')

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  localStorage.removeItem('userId')
  localStorage.removeItem('userName')
  cartCount.value = 0
  router.push({ name: 'Login' })
  mobileMenuOpen.value = false
}
</script>