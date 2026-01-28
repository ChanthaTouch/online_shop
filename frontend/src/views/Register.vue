<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-black text-white tracking-wider">NAK NAK</h1>
        <p class="text-pink-100 text-sm font-bold">STORE</p>
      </div>

      <!-- Register Card -->
      <div class="bg-white rounded-lg shadow-2xl p-8">
        <h2 class="text-2xl font-bold mb-6 text-center">Create Account</h2>

        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-2">Full Name</label>
            <input 
              v-model="form.name"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              required
            />
          </div>

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

          <div>
            <label class="block text-sm font-semibold mb-2">Confirm Password</label>
            <input 
              v-model="form.passwordConfirm"
              type="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              required
            />
          </div>

          <div>
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                v-model="form.registerAsAdmin"
                type="checkbox"
                class="w-4 h-4"
              />
              <span class="text-sm text-gray-600">Register as Admin</span>
            </label>
          </div>

          <div v-if="form.registerAsAdmin">
            <label class="block text-sm font-semibold mb-2">Admin Registration Key</label>
            <input 
              v-model="form.adminKey"
              type="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              placeholder="Enter admin key"
              required
            />
          </div>

          <label class="flex items-start gap-2">
            <input 
              v-model="form.agreedToTerms"
              type="checkbox"
              class="mt-1"
              required
            />
            <span class="text-sm text-gray-600">
              I agree to the terms and conditions
            </span>
          </label>

          <button 
            type="submit"
            :disabled="isLoading"
            class="w-full px-4 py-3 bg-pink-500 text-white rounded-lg font-bold hover:bg-pink-600 disabled:bg-gray-400 transition"
          >
            {{ isLoading ? 'Creating account...' : 'Register' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-600">Already have an account?</p>
          <router-link 
            to="/login"
            class="text-pink-500 font-bold hover:underline"
          >
            Login here
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
