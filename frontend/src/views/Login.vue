<template>
  <div class="min-h-screen bg-[#faf9f6] text-[#2c1810] flex items-center justify-center py-16 px-4">
    <div class="w-full max-w-md">
      <!-- Brand Header -->
      <div class="text-center mb-16">
        <h1 class="font-serif text-6xl md:text-7xl text-stone-900 mb-4 tracking-tight">Life & Coffee</h1>
        <p class="text-amber-700 text-sm font-black uppercase tracking-[0.4em]">Welcome Back</p>
        <div class="w-24 h-[1px] bg-amber-500/30 mx-auto mt-6"></div>
      </div>

      <!-- Login Card -->
      <div class="bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl p-10 md:p-12 border border-white/50">
        <h2 class="font-serif text-4xl text-stone-900 mb-10 text-center tracking-wide">Sign In</h2>

        <div v-if="errorMessage" class="mb-8 p-5 bg-rose-50/80 text-rose-700 rounded-3xl text-sm border border-rose-200 backdrop-blur-sm">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-8">
          <div>
            <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-3">Email Address</label>
            <input 
              v-model="form.email"
              type="email"
              required
              class="w-full px-8 py-5 bg-[#f5f4f0]/50 border border-stone-200 rounded-3xl focus:ring-4 focus:ring-amber-500/30 outline-none text-lg font-light placeholder:text-stone-400 transition-all"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-3">Password</label>
            <input 
              v-model="form.password"
              type="password"
              required
              class="w-full px-8 py-5 bg-[#f5f4f0]/50 border border-stone-200 rounded-3xl focus:ring-4 focus:ring-amber-500/30 outline-none text-lg font-light placeholder:text-stone-400 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            :disabled="isLoading"
            class="w-full bg-amber-600 text-white py-6 rounded-3xl font-serif text-2xl font-medium hover:bg-amber-700 transition-all disabled:bg-stone-400 flex justify-center items-center gap-4 shadow-xl mt-10"
          >
            <span v-if="isLoading" class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></span>
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-10 text-center">
          <p class="text-stone-600 text-sm">Don't have an account yet?</p>
          <router-link 
            to="/register"
            class="text-amber-700 font-serif text-lg hover:text-amber-600 transition"
          >
            Create Account
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Script unchanged – only visual enhancements
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth'

const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref('')
const form = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  if (!form.value.email || !form.value.password) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  try {
    const data = await authService.login(form.value.email, form.value.password)
    authService.storeAuth(data)
    alert('Login successful!')
    router.push({ name: 'Home' })
  } catch (error: any) {
    console.error('Login error:', error)
    errorMessage.value = error.response?.data?.error || 'Connection error. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>