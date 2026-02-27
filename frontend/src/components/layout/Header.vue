<template>
  <header class="sticky top-0 z-50 transition-all duration-300">
    <div class="bg-[#1a120b] text-amber-100/80 text-center py-2 text-[10px] tracking-[0.3em] uppercase border-b border-white/5">
      Complimentary Shipping on Curated Roasts Over $50
    </div>

    <nav class="bg-white/80 backdrop-blur-md border-b border-stone-100 shadow-sm">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <router-link to="/" class="group flex items-center gap-2 outline-none">
            <span class="font-serif text-3xl font-bold text-[#2c1810] tracking-tighter transition-colors group-hover:text-amber-800">
              Life<span class="text-amber-600 font-light italic">&</span>Coffee
            </span>
          </router-link>

          <div class="hidden lg:flex items-center gap-10">
            <router-link 
              v-for="link in [
                { name: 'Collections', path: '/products' },
                { name: 'Special Offers', path: '/discount' }
              ]" 
              :key="link.path"
              :to="link.path"
              class="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors relative group py-2"
              active-class="text-amber-800"
            >
              {{ link.name }}
              <span class="absolute bottom-0 left-0 h-[1.5px] bg-amber-600 transition-all duration-300" 
                    :class="$route.path === link.path ? 'w-full' : 'w-0 group-hover:w-full'"></span>
            </router-link>
            
            <router-link v-if="isAdmin" to="/admin" class="text-[11px] px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold uppercase tracking-wider">
              Admin
            </router-link>
          </div>

          <div class="flex items-center gap-4 md:gap-7">
            <div class="hidden md:block relative group">
              <input
                type="text"
                placeholder="Search roasts..."
                class="w-48 lg:w-64 pl-4 pr-10 py-2 bg-stone-50 border border-stone-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/10 focus:border-amber-600/30 transition-all"
              />
              <svg class="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 group-focus-within:text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <router-link to="/cart" class="relative p-2.5 bg-[#2c1810] text-white rounded-full hover:bg-amber-700 transition-all duration-300 shadow-lg shadow-stone-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span v-if="cartCount > 0" class="absolute -top-1 -right-1 bg-amber-500 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
                {{ cartCount }}
              </span>
            </router-link>

            <div class="relative" ref="dropdownMenuRef">
              <button @click="dropdownOpen = !dropdownOpen" class="flex items-center gap-3 group">
                <div class="w-10 h-10 rounded-full border-2 border-stone-100 overflow-hidden transition group-hover:border-amber-200 flex items-center justify-center bg-stone-50 text-amber-900 font-serif font-bold">
                  {{ isAuthenticated ? userInitial : '?' }}
                </div>
                <div class="hidden xl:flex flex-col items-start leading-tight">
                  <span class="text-xs font-semibold text-stone-800">{{ isAuthenticated ? userName : 'Account' }}</span>
                  <span class="text-[10px] text-stone-400 uppercase tracking-tighter">{{ isAuthenticated ? 'Profile' : 'Sign In' }}</span>
                </div>
              </button>
              
              <transition name="dropdown">
                <div v-if="dropdownOpen" class="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl border border-stone-100 py-4 z-50 overflow-hidden">
                   <div v-if="isAuthenticated" class="px-6 py-3 border-b border-stone-50 mb-2 bg-stone-50/50">
                     <p class="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Member Account</p>
                     <p class="font-serif text-lg text-[#2c1810] truncate">{{ userName }}</p>
                   </div>
                   <div class="flex flex-col">
                     <template v-if="isAuthenticated">
                       <router-link to="/profile" class="px-6 py-2.5 text-stone-600 hover:bg-stone-50 hover:text-amber-700 transition text-sm flex items-center gap-3">
                         Profile Settings
                       </router-link>
                       <router-link to="/orders" class="px-6 py-2.5 text-stone-600 hover:bg-stone-50 hover:text-amber-700 transition text-sm">
                         My Orders
                       </router-link>
                       <button @click="handleLogout" class="w-full text-left px-6 py-3 text-rose-600 hover:bg-rose-50 transition text-sm font-medium mt-2 border-t border-stone-50">
                         Sign Out
                       </button>
                     </template>
                     <template v-else>
                        <div class="p-4 space-y-3">
                          <router-link to="/login" class="block w-full text-center py-2.5 bg-[#2c1810] text-white rounded-xl text-sm font-bold hover:bg-amber-800 transition">Sign In</router-link>
                          <router-link to="/register" class="block w-full text-center py-2.5 border border-stone-200 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 transition">Register</router-link>
                        </div>
                     </template>
                   </div>
                </div>
              </transition>
            </div>

            <button @click="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden p-2 text-stone-800 hover:text-amber-700 transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" /></svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <transition name="mobile-fade">
      <div v-if="mobileMenuOpen" class="fixed inset-0 z-[60] bg-[#1a120b] text-white p-8">
        <div class="flex justify-between items-center mb-16">
          <span class="font-serif text-2xl font-bold">Life<span class="text-amber-500 italic">&</span>Coffee</span>
          <button @click="mobileMenuOpen = false" class="p-2 border border-white/10 rounded-full">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <nav class="flex flex-col gap-8">
          <router-link v-for="item in ['Home', 'Collections', 'Special Offers']" :key="item" :to="getNavPath(item)" @click="mobileMenuOpen = false" class="font-serif text-4xl hover:text-amber-400 transition transform hover:translate-x-2">
            {{ item }}
          </router-link>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
/* Kept original script logic */
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import { cartService } from '@/services/cart'
import { authService } from '@/services/auth'

const mobileMenuOpen = ref(false)
const dropdownOpen   = ref(false)
const cartCount      = ref(0)
const dropdownMenuRef = ref<HTMLElement | null>(null)

const isAuthenticated = computed(() => authService.isAuthenticated())
const isAdmin = computed(() => localStorage.getItem('userRole') === 'admin')
const userName = computed(() => localStorage.getItem('userName') || 'Guest')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

const loadCartCount = async () => {
  if (!isAuthenticated.value) {
    cartCount.value = 0
    return
  }
  
  try { 
    cartCount.value = await cartService.getItemCount() || 0 
  } catch (error: any) {
    // Only log if it's not an auth error
    if (error?.response?.status !== 401 && error?.response?.status !== 403) {
      console.error('Failed to load cart count:', error)
    }
    cartCount.value = 0
  }
}

const handleLogout = async () => {
  try { await authService.logout() } finally { localStorage.clear() }
  cartCount.value = 0
  dropdownOpen.value = false
  mobileMenuOpen.value = false
  router.push({ name: 'Login' })
}

const getNavPath = (item: string) => {
  const paths: Record<string, string> = {
    'Home': '/',
    'Collections': '/products',
    'Special Offers': '/discount'
  }
  return paths[item] || '/'
}

const router = useRouter()
const route = useRoute()

onMounted(() => {
  loadCartCount()
  window.addEventListener('storage', (e) => {
    if (e.key && ['token', 'userRole', 'userName', 'cartUpdated'].includes(e.key)) loadCartCount()
  })
  onClickOutside(dropdownMenuRef, () => dropdownOpen.value = false)
})

watch(() => route.path, () => {
  dropdownOpen.value = false
  mobileMenuOpen.value = false
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Inter:wght@400;500;600&display=swap');

.font-serif { font-family: 'Playfair Display', serif; }

.dropdown-enter-active, .dropdown-leave-active { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.dropdown-enter-from { opacity: 0; transform: translateY(10px) scale(0.95); }

.mobile-fade-enter-active, .mobile-fade-leave-active { transition: all 0.4s ease-in-out; }
.mobile-fade-enter-from { opacity: 0; clip-path: circle(0% at 100% 0%); }
.mobile-fade-enter-to { opacity: 1; clip-path: circle(150% at 100% 0%); }
</style>