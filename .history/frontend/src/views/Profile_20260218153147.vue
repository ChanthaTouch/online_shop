<template>
  <div class="min-h-screen bg-[#faf9f6] text-[#2c1810] pb-32">
    <!-- Hero Header -->
    <div class="bg-[#1a120b] py-24 px-4 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div class="container mx-auto text-center relative z-10">
        <span class="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em] block mb-4">
          Account Management
        </span>
        <h1 class="font-serif text-6xl md:text-7xl text-white mb-6">My Profile</h1>
        <div class="w-24 h-[1px] bg-amber-500/50 mx-auto"></div>
      </div>
    </div>

    <div class="container mx-auto px-6 -mt-16 relative z-20 max-w-6xl">
      <!-- Main Profile Card -->
      <div v-if="user" class="bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/50 p-12 mb-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
          <!-- Profile Avatar -->
          <div class="flex justify-center md:justify-start">
            <div class="relative">
              <div class="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white text-5xl font-serif font-bold shadow-lg">
                {{ user.name?.charAt(0) || 'U' }}
              </div>
              <div class="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full border-4 border-white"></div>
            </div>
          </div>

          <!-- User Info -->
          <div class="md:col-span-3">
            <h2 class="font-serif text-4xl text-stone-900 mb-2">{{ user.name }}</h2>
            <p class="text-stone-600 text-lg mb-4">{{ user.email }}</p>
            <div class="flex gap-4 flex-wrap">
              <span class="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider">
                {{ user.role?.toUpperCase() || 'Member' }}
              </span>
              <span class="px-4 py-2 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase tracking-wider">
                ✓ Active Account
              </span>
            </div>
          </div>
        </div>

        <!-- Edit Profile Button -->
        <div class="mt-8 pt-8 border-t border-stone-200">
          <button @click="editMode = true" class="px-8 py-3 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-500 transition-all shadow-lg uppercase text-xs tracking-wider">
            Edit Profile
          </button>
        </div>
      </div>

      <!-- Loyalty Points Section -->
      <div v-if="user && !loading" class="mb-12">
        <div class="mb-8">
          <h2 class="font-serif text-4xl text-stone-900 mb-2">Loyalty Points</h2>
          <p class="text-stone-600">Earn points on every purchase and redeem for exclusive rewards</p>
        </div>

        <!-- Points Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <!-- Current Balance -->
          <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2rem] p-8 border border-amber-200 shadow-lg hover:shadow-xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <span class="text-stone-700 font-bold text-sm uppercase tracking-widest">Points Balance</span>
              <svg class="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <p class="font-serif text-5xl font-bold text-amber-700">{{ stats.current_balance }}</p>
            <p class="text-stone-600 text-xs mt-3">Available to redeem</p>
          </div>

          <!-- Lifetime Earned -->
          <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-[2rem] p-8 border border-green-200 shadow-lg hover:shadow-xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <span class="text-stone-700 font-bold text-sm uppercase tracking-widest">Earned</span>
              <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <p class="font-serif text-5xl font-bold text-green-700">{{ stats.lifetime_earned }}</p>
            <p class="text-stone-600 text-xs mt-3">Total lifetime points</p>
          </div>

          <!-- Redeemed -->
          <div class="bg-gradient-to-br from-red-50 to-pink-50 rounded-[2rem] p-8 border border-red-200 shadow-lg hover:shadow-xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <span class="text-stone-700 font-bold text-sm uppercase tracking-widest">Redeemed</span>
              <svg class="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13H5v-2h14v2z"/>
              </svg>
            </div>
            <p class="font-serif text-5xl font-bold text-red-700">{{ stats.lifetime_redeemed }}</p>
            <p class="text-stone-600 text-xs mt-3">Redeemed to date</p>
          </div>

          <!-- Monthly Earned -->
          <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[2rem] p-8 border border-blue-200 shadow-lg hover:shadow-xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <span class="text-stone-700 font-bold text-sm uppercase tracking-widest">This Month</span>
              <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
              </svg>
            </div>
            <p class="font-serif text-5xl font-bold text-blue-700">+{{ stats.monthly_earned }}</p>
            <p class="text-stone-600 text-xs mt-3">Earned this month</p>
          </div>

          <!-- Next Tier -->
          <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-[2rem] p-8 border border-purple-200 shadow-lg hover:shadow-xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <span class="text-stone-700 font-bold text-sm uppercase tracking-widest">Points to Reward</span>
              <svg class="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
              </svg>
            </div>
            <p class="font-serif text-5xl font-bold text-purple-700">500</p>
            <p class="text-stone-600 text-xs mt-3">to unlock reward</p>
          </div>
        </div>

        <!-- Points History Section -->
        <div class="bg-white/70 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/50 p-10">
          <h3 class="font-serif text-3xl text-stone-900 mb-8">Recent Activity</h3>

          <div v-if="loadingHistory" class="flex justify-center py-20">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>

          <div v-else-if="transactions.length === 0" class="text-center py-20">
            <p class="text-stone-600 text-lg">No transaction history yet</p>
            <router-link to="/products" class="inline-block mt-6 px-8 py-3 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-500 transition-all shadow-lg uppercase text-xs tracking-wider">
              Start Earning Points
            </router-link>
          </div>

          <div v-else class="space-y-4">
            <div v-for="transaction in transactions.slice(0, 10)" :key="transaction.id" class="flex items-center justify-between p-5 bg-gradient-to-r hover:from-stone-50 hover:to-amber-50 rounded-2xl border border-stone-100 transition-all">
              <div class="flex items-center gap-4">
                <div v-if="transaction.type === 'earned'" class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div v-else class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <p class="font-bold text-stone-900">{{ transaction.description }}</p>
                  <p class="text-xs text-stone-500">{{ new Date(transaction.created_at).toLocaleDateString() }}</p>
                </div>
              </div>
              <div class="text-right">
                <p :class="['font-serif text-2xl font-bold', transaction.type === 'earned' ? 'text-green-600' : 'text-red-600']">
                  {{ transaction.type === 'earned' ? '+' : '-' }}{{ transaction.points }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="transactions.length > 10" class="mt-8 text-center">
            <router-link to="/orders" class="inline-block px-8 py-3 text-amber-600 font-bold hover:text-amber-500 transition-all uppercase text-xs tracking-wider">
              View All History →
            </router-link>
          </div>
        </div>
      </div>

      <!-- Account Settings Section -->
      <div class="bg-white/70 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/50 p-10 mt-12">
        <h3 class="font-serif text-3xl text-stone-900 mb-8">Account Settings</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Preferences -->
          <div class="p-8 bg-gradient-to-br from-stone-50 to-amber-50 rounded-2xl border border-stone-200">
            <h4 class="font-serif text-xl text-stone-900 mb-4">Preferences</h4>
            <div class="space-y-4">
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" class="w-5 h-5 accent-amber-600 rounded" checked>
                <span class="text-stone-700">Email notifications</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" class="w-5 h-5 accent-amber-600 rounded" checked>
                <span class="text-stone-700">Order updates</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" class="w-5 h-5 accent-amber-600 rounded" checked>
                <span class="text-stone-700">Promotional offers</span>
              </label>
            </div>
          </div>

          <!-- Security -->
          <div class="p-8 bg-gradient-to-br from-stone-50 to-amber-50 rounded-2xl border border-stone-200">
            <h4 class="font-serif text-xl text-stone-900 mb-4">Security</h4>
            <button class="w-full px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-500 transition-all mb-3 uppercase text-xs tracking-wider">
              Change Password
            </button>
            <button class="w-full px-6 py-3 border-2 border-amber-600 text-amber-600 rounded-xl font-bold hover:bg-amber-50 transition-all uppercase text-xs tracking-wider">
              Manage Sessions
            </button>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="bg-gradient-to-r from-red-50 to-pink-50 rounded-[2rem] shadow-2xl border border-red-200 p-10 mt-12">
        <h3 class="font-serif text-2xl text-red-900 mb-6">Danger Zone</h3>
        <p class="text-stone-700 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
        <button @click="logout" class="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg uppercase text-xs tracking-wider">
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth'
import { pointsService } from '@/services/points'
import 

const router = useRouter()
const user = ref<any>(null)
const loading = ref(false)
const loadingHistory = ref(false)
const editMode = ref(false)
const stats = ref({
  current_balance: 0,
  lifetime_earned: 0,
  lifetime_redeemed: 0,
  monthly_earned: 0,
  monthly_redeemed: 0,
})
const transactions = ref<any[]>([])

const logout = () => {
  if (confirm('Are you sure you want to logout?')) {
    authService.logout()
    router.push({ name: 'Home' })
  }
}

onMounted(async () => {
  if (!authService.isAuthenticated()) {
    router.push({ name: 'Login' })
    return
  }

  loading.value = true
  try {
    // Load user profile
    const response = await authService.getMe()
    user.value = response.user || response

    // Load points stats
    try {
      stats.value = await pointsService.getStats()
    } catch (error) {
      console.error('Error loading points stats:', error)
    }

    // Load points history
    loadingHistory.value = true
    try {
      const historyData = await pointsService.getHistory(50)
      transactions.value = historyData.transactions
    } catch (error) {
      console.error('Error loading points history:', error)
    } finally {
      loadingHistory.value = false
    }
  } catch (error) {
    console.error('Error loading profile:', error)
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;700&display=swap');

.font-serif { font-family: 'Playfair Display', serif; }

img { transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1); }
</style>
