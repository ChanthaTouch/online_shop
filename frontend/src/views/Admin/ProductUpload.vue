<template>
  <div class="min-h-screen bg-[#faf9f6] text-[#2c1810] pb-20">
    <!-- Hero Header matching Products.vue style -->
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
        <h1 class="font-serif text-6xl md:text-8xl text-white mb-6">Upload Product</h1>
        <div class="w-24 h-[1px] bg-amber-500/50 mx-auto"></div>
        <p class="mt-8 text-white/80 text-lg font-light">Add new items to your curated collection</p>
      </div>
    </div>

    <div class="container mx-auto px-6 -mt-20 relative z-20 max-w-4xl">
      <!-- Form Card -->
      <div class="bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/50 p-10 md:p-16">
        <form @submit.prevent="handleSubmit" class="space-y-12">
          <!-- Product Basics -->
          <div class="space-y-8">
            <div>
              <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-4">Product Name</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-8 py-6 bg-[#f5f4f0]/50 border border-stone-200 rounded-3xl focus:ring-4 focus:ring-amber-500/30 outline-none text-lg font-light transition-all"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-4">Description</label>
              <textarea
                v-model="form.description"
                rows="5"
                class="w-full px-8 py-6 bg-[#f5f4f0]/50 border border-stone-200 rounded-3xl focus:ring-4 focus:ring-amber-500/30 outline-none text-lg font-light resize-none transition-all"
                placeholder="Describe your product"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-4">Price ($)</label>
                <input
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="w-full px-8 py-6 bg-[#f5f4f0]/50 border border-stone-200 rounded-3xl focus:ring-4 focus:ring-amber-500/30 outline-none text-lg font-light"
                />
              </div>
              <div>
                <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-4">Stock</label>
                <input
                  v-model.number="form.stock"
                  type="number"
                  min="0"
                  required
                  class="w-full px-8 py-6 bg-[#f5f4f0]/50 border border-stone-200 rounded-3xl focus:ring-4 focus:ring-amber-500/30 outline-none text-lg font-light"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-4">Category</label>
              <select
                v-model="form.category"
                required
                class="w-full px-8 py-6 bg-[#f5f4f0]/50 border border-stone-200 rounded-3xl focus:ring-4 focus:ring-amber-500/30 outline-none text-lg font-light appearance-none cursor-pointer"
              >
                <option value="" disabled>Select a category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Discount Section -->
          <div class="border-t border-stone-200 pt-10">
            <div class="flex items-center mb-8">
              <input
                v-model="hasDiscount"
                type="checkbox"
                class="h-6 w-6 text-amber-600 border-stone-300 rounded focus:ring-amber-500"
              />
              <label class="ml-4 text-xl font-serif text-[#2c1810]">Apply discount to this product</label>
            </div>

            <div v-if="hasDiscount" class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-4">Discount Percentage (%)</label>
                <input
                  v-model.number="form.discount_percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  class="w-full px-8 py-6 bg-[#f5f4f0]/50 border border-stone-200 rounded-3xl focus:ring-4 focus:ring-amber-500/30 outline-none text-lg font-light"
                  placeholder="e.g. 15"
                />
              </div>
              <div>
                <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-4">Start Date</label>
                <input
                  v-model="form.discount_starts_at"
                  type="date"
                  class="w-full px-8 py-6 bg-[#f5f4f0]/50 border border-stone-200 rounded-3xl focus:ring-4 focus:ring-amber-500/30 outline-none text-lg font-light"
                />
              </div>
              <div>
                <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-4">End Date</label>
                <input
                  v-model="form.discount_ends_at"
                  type="date"
                  class="w-full px-8 py-6 bg-[#f5f4f0]/50 border border-stone-200 rounded-3xl focus:ring-4 focus:ring-amber-500/30 outline-none text-lg font-light"
                />
              </div>
            </div>

            <!-- Discounted price preview -->
            <div
              v-if="hasDiscount && form.price > 0 && form.discount_percentage > 0"
              class="mt-10 p-8 bg-amber-50/70 rounded-3xl border border-amber-200"
            >
              <p class="text-sm text-stone-700">Original price: <span class="font-serif text-xl">${{ form.price.toFixed(2) }}</span></p>
              <p class="text-2xl font-serif font-bold text-amber-800 mt-2">
                Discounted price: ${{ (form.price * (1 - form.discount_percentage / 100)).toFixed(2) }}
              </p>
            </div>
          </div>

          <!-- Images -->
          <div>
            <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-4">Product Images (multiple allowed)</label>
            <div
              class="mt-1 flex justify-center px-10 pt-12 pb-14 border-2 border-dashed border-stone-300 rounded-3xl hover:border-amber-500 transition-colors bg-[#f5f4f0]/30"
            >
              <div class="space-y-4 text-center">
                <svg class="mx-auto h-16 w-16 text-stone-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div class="flex text-lg text-stone-600 justify-center">
                  <label class="relative cursor-pointer rounded-md font-medium text-amber-600 hover:text-amber-500">
                    <span>Upload files</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      class="sr-only"
                      @change="handleFileChange"
                    />
                  </label>
                  <p class="pl-2">or drag and drop</p>
                </div>
                <p class="text-xs text-stone-500">PNG, JPG, GIF up to 2MB each</p>
                <p v-if="fileName" class="text-lg font-serif font-bold text-amber-700 mt-4">
                  Selected: {{ fileName }}
                </p>
              </div>
            </div>
          </div>

          <!-- Active Checkbox -->
          <div class="flex items-center">
            <input
              v-model="isActive"
              type="checkbox"
              class="h-6 w-6 text-amber-600 border-stone-300 rounded focus:ring-amber-500"
            />
            <label class="ml-4 text-lg font-serif text-[#2c1810]">Product is active and visible</label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-amber-600 text-white py-6 rounded-3xl font-serif text-2xl font-medium hover:bg-amber-700 transition-all disabled:bg-stone-400 flex justify-center items-center gap-4 shadow-xl"
          >
            <span v-if="isLoading" class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></span>
            {{ isLoading ? 'Uploading...' : 'Create Product' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { productService } from '@/services/products'
import { authService } from '@/services/auth'
import api from '@/services/api'

const router = useRouter()
const categories = ref<any[]>([])
const isLoading = ref(false)
const isActive = ref(true)
const hasDiscount = ref(false)
const fileName = ref<string>('')
const selectedFiles = ref<File[]>([])

const form = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  discount_percentage: 0,
  discount_starts_at: '',
  discount_ends_at: '',
})

onMounted(async () => {
  if (!authService.isAuthenticated()) {
    router.push({ name: 'Login' })
    return
  }
  if (!authService.isAdmin()) {
    alert('Access Denied: Admins Only')
    router.push({ name: 'Home' })
    return
  }

  try {
    // Fetch categories directly from API
    const { data } = await api.get('/categories')
    categories.value = data
  } catch (error) {
    console.error('Failed to load categories', error)
  }
})

watch(hasDiscount, (val) => {
  if (!val) {
    form.value.discount_percentage = 0
    form.value.discount_starts_at = ''
    form.value.discount_ends_at = ''
  }
})

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFiles.value = Array.from(target.files)
    fileName.value = selectedFiles.value.length === 1
      ? selectedFiles.value[0].name
      : `${selectedFiles.value.length} files selected`
  }
}

const handleSubmit = async () => {
  if (!authService.isAdmin()) {
    alert('Admin access required')
    return
  }

  isLoading.value = true
  try {
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('description', form.value.description || '')
    formData.append('price', String(form.value.price))
    formData.append('stock', String(form.value.stock))
    formData.append('category_id', String(form.value.category))
    formData.append('is_active', isActive.value ? '1' : '0')

    if (hasDiscount.value) {
      if (form.value.discount_percentage > 0) {
        formData.append('discount_percentage', String(form.value.discount_percentage))
      }
      if (form.value.discount_starts_at) {
        formData.append('discount_starts_at', form.value.discount_starts_at)
      }
      if (form.value.discount_ends_at) {
        formData.append('discount_ends_at', form.value.discount_ends_at)
      }
    }

    selectedFiles.value.forEach((file) => {
      formData.append('images[]', file)
    })

    await productService.createProduct(formData)
    
    const goToManage = confirm('Product uploaded successfully! Would you like to view all products?')
    
    if (goToManage) {
      router.push({ name: 'ProductManagement' })
      return
    }

    // Reset form
    form.value = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      discount_percentage: 0,
      discount_starts_at: '',
      discount_ends_at: '',
    }
    selectedFiles.value = []
    fileName.value = ''
    isActive.value = true
    hasDiscount.value = false
  } catch (error: any) {
    console.error('Upload error:', error)
    alert(error.response?.data?.message || 'Failed to upload product. Please try again.')
  } finally {
    isLoading.value = false
  }
}
</script>