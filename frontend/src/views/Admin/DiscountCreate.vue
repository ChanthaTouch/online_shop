<template>
  <div class="min-h-screen bg-[#faf9f6] text-[#2c1810] pb-20">
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
          Admin Dashboard
        </span>
        <h1 class="font-serif text-6xl md:text-8xl text-white mb-6">Manage Special Offers</h1>
        <div class="w-24 h-[1px] bg-amber-500/50 mx-auto"></div>
        <p class="mt-8 text-white/80 text-lg font-light">Create and manage discount codes for your customers</p>
      </div>
    </div>

    <div class="container mx-auto px-6 -mt-20 relative z-20 max-w-7xl">
      <!-- Two Column Layout: Form + List -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Create Discount Form -->
        <div class="lg:col-span-1">
          <div class="bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/50 p-10 sticky top-24">
            <h2 class="font-serif text-3xl text-stone-900 mb-6">{{ editingId ? 'Edit Offer' : 'Create Offer' }}</h2>
            
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Discount Code -->
              <div>
                <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-3">Discount Code</label>
                <input
                  v-model="form.code"
                  type="text"
                  placeholder="e.g., SUMMER50"
                  required
                  :disabled="!!editingId"
                  class="w-full px-6 py-4 bg-[#f5f4f0]/50 border border-stone-200 rounded-2xl focus:ring-4 focus:ring-amber-500/30 outline-none font-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <!-- Discount Type -->
              <div>
                <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-3">Type</label>
                <select
                  v-model="form.type"
                  required
                  class="w-full px-6 py-4 bg-[#f5f4f0]/50 border border-stone-200 rounded-2xl focus:ring-4 focus:ring-amber-500/30 outline-none font-light transition-all"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>

              <!-- Discount Value -->
              <div>
                <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-3">
                  Discount Value {{ form.type === 'percentage' ? '(%)' : '($)' }}
                </label>
                <input
                  v-model.number="form.value"
                  type="number"
                  min="0"
                  step="form.type === 'percentage' ? 1 : 0.01"
                  placeholder="e.g., 50"
                  required
                  class="w-full px-6 py-4 bg-[#f5f4f0]/50 border border-stone-200 rounded-2xl focus:ring-4 focus:ring-amber-500/30 outline-none font-light transition-all"
                />
              </div>

              <!-- Title (Optional) -->
              <div>
                <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-3">Offer Title</label>
                <input
                  v-model="form.title"
                  type="text"
                  placeholder="e.g., Summer Collection"
                  class="w-full px-6 py-4 bg-[#f5f4f0]/50 border border-stone-200 rounded-2xl focus:ring-4 focus:ring-amber-500/30 outline-none font-light transition-all"
                />
              </div>

              <!-- Description (Optional) -->
              <div>
                <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-3">Description</label>
                <textarea
                  v-model="form.description"
                  placeholder="Describe your special offer..."
                  rows="3"
                  class="w-full px-6 py-4 bg-[#f5f4f0]/50 border border-stone-200 rounded-2xl focus:ring-4 focus:ring-amber-500/30 outline-none font-light resize-none transition-all"
                ></textarea>
              </div>

              <!-- Min Order Amount (Optional) -->
              <div>
                <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-3">Min. Order Amount ($)</label>
                <input
                  v-model.number="form.min_order_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Leave empty for no minimum"
                  class="w-full px-6 py-4 bg-[#f5f4f0]/50 border border-stone-200 rounded-2xl focus:ring-4 focus:ring-amber-500/30 outline-none font-light transition-all"
                />
              </div>

              <!-- Max Uses (Optional) -->
              <div>
                <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-3">Max Uses</label>
                <input
                  v-model.number="form.max_uses"
                  type="number"
                  min="1"
                  placeholder="Leave empty for unlimited"
                  class="w-full px-6 py-4 bg-[#f5f4f0]/50 border border-stone-200 rounded-2xl focus:ring-4 focus:ring-amber-500/30 outline-none font-light transition-all"
                />
              </div>

              <!-- Expires At (Optional) -->
              <div>
                <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-3">Expiry Date</label>
                <input
                  v-model="form.expires_at"
                  type="datetime-local"
                  class="w-full px-6 py-4 bg-[#f5f4f0]/50 border border-stone-200 rounded-2xl focus:ring-4 focus:ring-amber-500/30 outline-none font-light transition-all"
                />
              </div>

              <!-- Active Status -->
              <div class="flex items-center gap-3">
                <input
                  v-model="form.active"
                  type="checkbox"
                  id="active"
                  class="w-5 h-5 rounded cursor-pointer accent-amber-600"
                />
                <label for="active" class="text-sm font-medium text-stone-700 cursor-pointer">Active</label>
              </div>

              <!-- Submit Button -->
              <div class="flex gap-3 pt-4">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="flex-1 px-8 py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs tracking-wider"
                >
                  {{ isSubmitting ? 'Saving...' : (editingId ? 'Update' : 'Create') }}
                </button>
                <button
                  v-if="editingId"
                  type="button"
                  @click="resetForm"
                  class="flex-1 px-8 py-4 bg-stone-300 text-stone-700 rounded-2xl font-bold hover:bg-stone-400 transition-all uppercase text-xs tracking-wider"
                >
                  Cancel
                </button>
              </div>

              <!-- Error Message -->
              <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {{ error }}
              </div>
            </form>
          </div>
        </div>

        <!-- Discounts List -->
        <div class="lg:col-span-2">
          <div class="bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/50 p-10">
            <h2 class="font-serif text-3xl text-stone-900 mb-8">Active Offers</h2>
            
            <div v-if="loading" class="text-center py-12">
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
              <p class="mt-4 text-stone-600">Loading discounts...</p>
            </div>

            <div v-else-if="discountsList.length === 0" class="text-center py-12">
              <p class="text-stone-600 text-lg">No discounts created yet.</p>
              <p class="text-stone-500 text-sm mt-2">Create your first special offer using the form on the left!</p>
            </div>

            <div v-else class="space-y-4">
              <div 
                v-for="discount in discountsList" 
                :key="discount.id"
                class="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 hover:shadow-lg transition-all"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <span class="text-2xl font-bold text-amber-600">{{ discount.value }}<span v-if="discount.type === 'percentage'" class="text-lg">%</span><span v-else class="text-lg">$</span></span>
                      <span class="px-3 py-1 bg-amber-600 text-white rounded-full text-xs font-bold uppercase">{{ discount.code }}</span>
                      <span v-if="!discount.active" class="px-3 py-1 bg-stone-400 text-white rounded-full text-xs font-bold uppercase">Inactive</span>
                    </div>
                    <p v-if="discount.title" class="font-bold text-stone-900">{{ discount.title }}</p>
                    <p v-if="discount.description" class="text-sm text-stone-600 mt-1">{{ discount.description }}</p>
                    <div class="text-xs text-stone-500 mt-3 space-y-1">
                      <p v-if="discount.min_order_amount">Minimum order: ${{ discount.min_order_amount }}</p>
                      <p v-if="discount.max_uses">Max uses: {{ discount.uses || 0 }}/{{ discount.max_uses }}</p>
                      <p v-if="discount.expires_at">Expires: {{ new Date(discount.expires_at).toLocaleDateString() }}</p>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button
                      @click="editDiscount(discount)"
                      class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteDiscount(discount.id)"
                      class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { discountService, type Discount, type CreateDiscountInput } from '@/services/discount'

/* State */
const discountsList = ref<Discount[]>([])
const loading = ref(false)
const isSubmitting = ref(false)
const error = ref<string | null>(null)
const editingId = ref<number | null>(null)

/* Form */
const form = ref<CreateDiscountInput>({
  code: '',
  type: 'percentage',
  value: 50,
  title: '',
  description: '',
  min_order_amount: null,
  max_uses: null,
  expires_at: null,
  active: true,
})

/* Reset form to initial state */
const resetForm = () => {
  form.value = {
    code: '',
    type: 'percentage',
    value: 50,
    title: '',
    description: '',
    min_order_amount: null,
    max_uses: null,
    expires_at: null,
    active: true,
  }
  editingId.value = null
  error.value = null
}

/* Fetch all discounts */
const fetchDiscounts = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await discountService.getDiscounts(1)
    discountsList.value = response.data || []
  } catch (err: any) {
    console.error('Error fetching discounts:', err)
    error.value = 'Failed to load discounts'
  } finally {
    loading.value = false
  }
}

/* Handle form submit - Create or Update */
const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    error.value = null

    if (editingId.value) {
      // Update existing discount
      await discountService.updateDiscount(editingId.value, form.value)
    } else {
      // Create new discount
      await discountService.createDiscount(form.value)
    }

    // Refresh list and reset form
    await fetchDiscounts()
    resetForm()
  } catch (err: any) {
    console.error('Error saving discount:', err)
    error.value = err?.response?.data?.message || 'Failed to save discount'
  } finally {
    isSubmitting.value = false
  }
}

/* Edit an existing discount */
const editDiscount = async (discount: Discount) => {
  try {
    form.value = {
      code: discount.code,
      type: discount.type,
      value: discount.value,
      title: discount.title || '',
      description: discount.description || '',
      min_order_amount: discount.min_order_amount,
      max_uses: discount.max_uses,
      expires_at: discount.expires_at || null,
      active: discount.active,
    }
    editingId.value = discount.id
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    error.value = 'Failed to load discount details'
  }
}

/* Delete a discount */
const deleteDiscount = async (id: number) => {
  if (!confirm('Are you sure you want to delete this discount?')) return

  try {
    error.value = null
    await discountService.deleteDiscount(id)
    await fetchDiscounts()
  } catch (err: any) {
    console.error('Error deleting discount:', err)
    error.value = 'Failed to delete discount'
  }
}

/* Load discounts on mount */
onMounted(() => {
  fetchDiscounts()
})
</script>
