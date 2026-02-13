<template>
  <div class="min-h-screen bg-[#faf9f6] text-[#2c1810] flex items-center justify-center py-16 px-4">
    <div class="w-full max-w-md">
      <!-- Brand Header -->
      <div class="text-center mb-16">
        <h1 class="font-serif text-6xl md:text-7xl text-stone-900 mb-4 tracking-tight">Life & Coffee</h1>
        <p class="text-amber-700 text-sm font-black uppercase tracking-[0.4em]">Join Our Community</p>
        <div class="w-24 h-[1px] bg-amber-500/30 mx-auto mt-6"></div>
      </div>

      <!-- Register Card -->
      <div class="bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl p-10 md:p-12 border border-white/50">
        <h2 class="font-serif text-4xl text-stone-900 mb-10 text-center tracking-wide">Create Account</h2>

        <div v-if="errorMessage" class="mb-8 p-5 bg-rose-50/80 text-rose-700 rounded-3xl text-sm border border-rose-200 backdrop-blur-sm">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-8">
          <div>
            <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-3">Full Name</label>
            <input 
              v-model="form.name"
              type="text"
              required
              class="w-full px-8 py-5 bg-[#f5f4f0]/50 border border-stone-200 rounded-3xl focus:ring-4 focus:ring-amber-500/30 outline-none text-lg font-light placeholder:text-stone-400 transition-all"
              placeholder="Your full name"
            />
          </div>

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

          <div>
            <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-3">Confirm Password</label>
            <input 
              v-model="form.passwordConfirm"
              type="password"
              required
              class="w-full px-8 py-5 bg-[#f5f4f0]/50 border border-stone-200 rounded-3xl focus:ring-4 focus:ring-amber-500/30 outline-none text-lg font-light placeholder:text-stone-400 transition-all"
              placeholder="••••••••"
            />
          </div>

          <!-- Admin Registration Option -->
          <div class="border-t border-stone-200 pt-8">
            <label class="flex items-center gap-4 cursor-pointer">
              <input 
                v-model="form.registerAsAdmin"
                type="checkbox"
                class="h-6 w-6 text-amber-600 rounded focus:ring-amber-500"
              />
              <span class="text-lg font-serif text-stone-800">Register as Administrator</span>
            </label>
          </div>

          <div v-if="form.registerAsAdmin" class="mt-6 p-6 bg-amber-50/70 rounded-3xl border border-amber-200">
            <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-3">Admin Key</label>
            <input 
              v-model="form.adminKey"
              type="password"
              required
              class="w-full px-8 py-5 bg-white border border-stone-200 rounded-3xl focus:ring-4 focus:ring-amber-500/30 outline-none text-lg font-light"
              placeholder="Enter secret admin key"
            />
          </div>

          <!-- Terms -->
          <div class="mt-8">
            <label class="flex items-start gap-4 cursor-pointer">
              <input 
                v-model="form.agreedToTerms"
                type="checkbox"
                class="mt-1 h-6 w-6 text-amber-600 rounded focus:ring-amber-500"
                required
              />
              <span class="text-sm text-stone-600 leading-relaxed">
                I agree to the <span class="text-amber-700 font-medium">Terms of Service</span> and <span class="text-amber-700 font-medium">Privacy Policy</span>
              </span>
            </label>
          </div>

          <button 
            type="submit"
            :disabled="isLoading"
            class="w-full bg-amber-600 text-white py-6 rounded-3xl font-serif text-2xl font-medium hover:bg-amber-700 transition-all disabled:bg-stone-400 flex justify-center items-center gap-4 shadow-xl mt-10"
          >
            <span v-if="isLoading" class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></span>
            {{ isLoading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <div class="mt-10 text-center">
          <p class="text-stone-600 text-sm">Already have an account?</p>
          <router-link 
            to="/login"
            class="text-amber-700 font-serif text-lg hover:text-amber-600 transition"
          >
            Sign In Here
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
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  agreedToTerms: false,
  registerAsAdmin: false,
  adminKey: ''
})

const handleRegister = async () => {
  if (!form.value.name || !form.value.email || !form.value.password) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  if (form.value.password !== form.value.passwordConfirm) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  if (!form.value.agreedToTerms) {
    errorMessage.value = 'Please agree to the terms'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  try {
    const data = await authService.register(
      form.value.name,
      form.value.email,
      form.value.password,
      form.value.registerAsAdmin ? 'admin' : 'customer',
      form.value.adminKey || undefined
    )
    authService.storeAuth(data)
    alert('Account created successfully!')
    router.push({ name: 'Home' })
  } catch (error: any) {
    console.error('Registration error:', error)
    errorMessage.value = error.response?.data?.message || error.response?.data?.error || 'Connection error. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>