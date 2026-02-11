<template>
  <div class="max-w-2xl mx-auto py-12">
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-3xl font-bold mb-6">My Profile</h1>

      <div v-if="user" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold mb-2">Name</label>
            <p class="text-lg">{{ user.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Email</label>
            <p class="text-lg">{{ user.email }}</p>
          </div>
        </div>

        <router-link 
          to="/"
          class="inline-block px-6 py-3 bg-pink-500 text-white rounded-lg font-bold hover:bg-pink-600 transition"
        >
          Continue Shopping
        </router-link>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-500 mb-4">Please log in to view your profile</p>
        <router-link 
          to="/login"
          class="inline-block px-6 py-3 bg-pink-500 text-white rounded-lg font-bold hover:bg-pink-600 transition"
        >
          Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth'

const router = useRouter()
const user = ref<any>(null)
const loading = ref(false)

onMounted(async () => {
  if (!authService.isAuthenticated()) {
    router.push({ name: 'Login' })
    return
  }

  loading.value = true
  try {
    const response = await authService.getMe()
    // Backend returns { user: {...} }, extract the user object
    user.value = response.user || response
  } catch (error) {
    console.error('Error loading profile:', error)
    // Fallback to localStorage data
    user.value = {
      name: localStorage.getItem('userName') || 'User',
      email: localStorage.getItem('userEmail') || 'Not provided',
      role: authService.getUserRole()
    }
  } finally {
    loading.value = false
  }
})
</script>
