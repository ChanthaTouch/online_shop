<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-black text-white tracking-wider">NAK NAK</h1>
        <p class="text-pink-100 text-sm font-bold">STORE</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-lg shadow-2xl p-8">
        <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>

        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-2">Email</label>
            <input 
              v-model="form.email"
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2">Password</label>
            <input 
              v-model="form.password"
              type="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              required
            />
          </div>

          <button 
            type="submit"
            :disabled="isLoading"
            class="w-full px-4 py-3 bg-pink-500 text-white rounded-lg font-bold hover:bg-pink-600 disabled:bg-gray-400 transition"
          >
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-600">Don't have an account?</p>
          <router-link 
            to="/register"
            class="text-pink-500 font-bold hover:underline"
          >
            Register here
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
