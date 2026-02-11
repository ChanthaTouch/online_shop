<!-- src/components/layout/Header.vue -->
<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
    <!-- Announcement Bar -->
    <div class="bg-pink-600 text-white text-center py-2 text-sm font-medium tracking-wide">
      ⭐ Free shipping on orders over $50 | ⭐⭐⭐⭐⭐ Highest rated store
    </div>

    <!-- Main Header Content -->
    <div class="container mx-auto px-4 lg:px-6">
      <div class="flex items-center justify-between h-16 md:h-20">
        <!-- Logo -->
        <router-link
          to="/"
          class="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-lg"
        >
          <div class="text-3xl md:text-4xl font-black text-pink-600 tracking-tight">NAK NAK</div>
          <div class="text-xs md:text-sm font-bold text-gray-600 mt-1">STORE</div>
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center gap-10 xl:gap-12">
          <router-link
            to="/products"
            class="font-medium text-gray-700 hover:text-pink-600 transition-colors duration-200"
            active-class="text-pink-600 font-semibold underline underline-offset-4"
          >
            Shop
          </router-link>
          <router-link
            to="/discount"
            class="font-medium text-gray-700 hover:text-pink-600 transition-colors duration-200"
            active-class="text-pink-600 font-semibold underline underline-offset-4"
          >
            Discounts
          </router-link>
          <router-link
            v-if="isAdmin"
            to="/admin"
            class="font-medium text-gray-700 hover:text-pink-600 transition-colors duration-200"
            active-class="text-pink-600 font-semibold underline underline-offset-4"
          >
            Admin
          </router-link>
        </nav>

        <!-- Right Side: Search + Cart + User -->
        <div class="flex items-center gap-5 md:gap-7">
          <!-- Search (desktop only) -->
          <div class="hidden md:block relative w-64 lg:w-80">
            <input
              type="text"
              placeholder="Search products..."
              class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-400 transition"
            />
            <svg
              class="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Cart -->
          <router-link
            to="/cart"
            class="relative group"
            aria-label="View shopping cart"
          >
            <svg
              class="w-7 h-7 md:w-8 md:h-8 text-gray-700 group-hover:text-pink-600 transition-colors"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span
              v-if="cartCount > 0"
              class="absolute -top-1.5 -right-1.5 bg-pink-600 text-white text-xs font-bold rounded-full min-w-[18px] h-5 flex items-center justify-center px-1.5 shadow-sm"
            >
              {{ cartCount }}
            </span>
          </router-link>

          <!-- Auth Buttons (desktop) -->
          <div v-if="!isAuthenticated" class="hidden md:flex items-center gap-3">
            <router-link
              to="/login"
              class="text-sm font-medium text-gray-700 hover:text-pink-600 transition"
            >
              Sign In
            </router-link>
            <router-link
              to="/register"
              class="text-sm font-semibold text-pink-600 border border-pink-600 px-3 py-1 rounded-lg hover:bg-pink-50 transition"
            >
              Register
            </router-link>
          </div>

          <!-- User / Auth Area -->
          <div class="relative">
            <button
              @click="dropdownOpen = !dropdownOpen"
              class="flex items-center gap-3 focus:outline-none group"
            >
              <div
                class="w-10 h-10 md:w-11 md:h-11 rounded-full bg-pink-100 flex items-center justify-center border-2 border-pink-200 transition group-hover:border-pink-400"
              >
                <svg
                  v-if="!isAuthenticated"
                  class="w-6 h-6 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span
                  v-else
                  class="text-pink-700 font-semibold text-lg"
                >
                  {{ userInitial }}
                </span>
              </div>
              <div class="hidden md:flex flex-col items-start">
                <span class="text-sm font-medium text-gray-700 group-hover:text-pink-600 transition">
                  {{ isAuthenticated ? userName : 'Account' }}
                </span>
                <span class="text-xs text-gray-500" v-if="isAuthenticated">My Account</span>
              </div>
              <svg
                class="w-4 h-4 text-gray-500 transition-transform md:block hidden"
                :class="{ 'rotate-180': dropdownOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="dropdownOpen"
              v-click-outside="() => dropdownOpen = false"
              class="absolute right-0 mt-3 w-72 md:w-80 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 overflow-hidden z-50"
            >
              <template v-if="isAuthenticated">
                <div class="px-5 py-3 border-b border-gray-100">
                  <p class="font-medium text-gray-800">{{ userName }}</p>
                  <p class="text-sm text-gray-500">{{ userEmail || 'Logged in' }}</p>
                </div>
                <router-link
                  to="/profile"
                  class="block px-5 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-700 transition"
                  @click="dropdownOpen = false"
                >
                  Profile
                </router-link>
                <router-link
                  to="/orders"
                  class="block px-5 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-700 transition"
                  @click="dropdownOpen = false"
                >
                  My Orders
                </router-link>
                <router-link
                  v-if="isAdmin"
                  to="/admin"
                  class="block px-5 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-700 transition"
                  @click="dropdownOpen = false"
                >
                  Admin Dashboard
                </router-link>
                <hr class="my-2 border-gray-100" />
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 transition font-medium"
                >
                  Sign Out
                </button>
              </template>

              <template v-else>
                <div class="px-5 py-4">
                  <router-link
                    to="/login"
                    class="block w-full text-center bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-lg transition mb-3 shadow-sm"
                    @click="dropdownOpen = false"
                  >
                    Sign In
                  </router-link>
                  <router-link
                    to="/register"
                    class="block w-full text-center border border-pink-600 text-pink-600 hover:bg-pink-50 font-semibold py-3 rounded-lg transition"
                    @click="dropdownOpen = false"
                  >
                    Create Account
                  </router-link>
                </div>
              </template>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="lg:hidden text-gray-700 hover:text-pink-600 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Slide-in Menu -->
    <transition name="slide">
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 z-40 lg:hidden"
      >
        <div class="absolute inset-0 bg-black/50" @click="mobileMenuOpen = false"></div>
        <div class="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl flex flex-col">
          <div class="p-5 border-b flex justify-between items-center">
            <div class="text-2xl font-black text-pink-600">NAK NAK</div>
            <button @click="mobileMenuOpen = false">
              <svg class="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav class="flex-1 py-6 px-4 flex flex-col gap-2">
            <router-link
              to="/"
              class="block px-5 py-4 text-lg font-medium hover:bg-pink-50 rounded-lg transition"
              @click="mobileMenuOpen = false"
            >
              Home
            </router-link>
            <router-link
              to="/products"
              class="block px-5 py-4 text-lg font-medium hover:bg-pink-50 rounded-lg transition"
              @click="mobileMenuOpen = false"
            >
              Shop
            </router-link>
            <router-link
              to="/discount"
              class="block px-5 py-4 text-lg font-medium hover:bg-pink-50 rounded-lg transition"
              @click="mobileMenuOpen = false"
            >
              Discounts
            </router-link>
            <router-link
              v-if="isAdmin"
              to="/admin"
              class="block px-5 py-4 text-lg font-medium hover:bg-pink-50 rounded-lg transition"
              @click="mobileMenuOpen = false"
            >
              Admin Panel
            </router-link>
          </nav>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { cartService } from '@/services/cart'
import { authService } from '@/services/auth'

// ── State ────────────────────────────────────────
const mobileMenuOpen = ref(false)
const dropdownOpen   = ref(false)
const cartCount      = ref(0)

// ── Computed ─────────────────────────────────────
const isAuthenticated = computed(() => authService.isAuthenticated())

const isAdmin = computed(() => {
  return localStorage.getItem('userRole') === 'admin'
})

const userName = computed(() => {
  return localStorage.getItem('userName') || 'My Account'
})

const userEmail = computed(() => {
  // Optional: if you store email too
  return localStorage.getItem('userEmail') || ''
})

const userInitial = computed(() => {
  return userName.value.charAt(0).toUpperCase() || 'U'
})

// ── Methods ──────────────────────────────────────
const loadCartCount = async () => {
  if (!isAuthenticated.value) {
    cartCount.value = 0
    return
  }
  try {
    cartCount.value = await cartService.getItemCount() || 0
  } catch (err) {
    console.error('Cart count fetch failed:', err)
    cartCount.value = 0
  }
}

const handleLogout = async () => {
  try {
    await authService.logout()
  } catch {
    localStorage.clear()
  }
  cartCount.value = 0
  dropdownOpen.value = false
  mobileMenuOpen.value = false
  router.push({ name: 'Login' })
}

// ── Lifecycle & Watchers ─────────────────────────
const router = useRouter()
const route = useRoute()

onMounted(() => {
  loadCartCount()
  window.addEventListener('storage', handleStorageChange)
})

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
})

watch(isAuthenticated, () => {
  loadCartCount()
})

watch(() => route.path, () => {
  dropdownOpen.value = false
  mobileMenuOpen.value = false
})

const handleStorageChange = (e: StorageEvent) => {
  if (e.key && ['token', 'userRole', 'userName'].includes(e.key)) {
    loadCartCount()
  }
}

// Close dropdown and mobile menu when route changes
watch(() => route.name, () => {
  dropdownOpen.value = false
  mobileMenuOpen.value = false
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>