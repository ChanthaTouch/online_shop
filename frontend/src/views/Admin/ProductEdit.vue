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
        <h1 class="font-serif text-6xl md:text-8xl text-white mb-6">Edit Product</h1>
        <div class="w-24 h-[1px] bg-amber-500/50 mx-auto"></div>
        <p class="mt-8 text-white/80 text-lg font-light">Update product details</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoadingProduct" class="container mx-auto px-6 -mt-20 relative z-20 max-w-4xl">
      <div class="bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/50 p-16 text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto"></div>
        <p class="mt-4 text-stone-600">Loading product...</p>
      </div>
    </div>

    <!-- Edit Form -->
    <div v-else-if="product" class="container mx-auto px-6 -mt-20 relative z-20 max-w-4xl">
      <div class="bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/50 p-10 md:p-16">
        <!-- Back Button -->
        <button
          @click="$router.push({ name: 'ProductManagement' })"
          class="mb-8 flex items-center gap-2 text-amber-700 hover:text-amber-900 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </button>

        <form @submit.prevent="handleSubmit" class="space-y-12">
          <!-- Current Images -->
          <div v-if="product.images && product.images.length > 0">
            <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-4">Current Images</label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div v-for="(img, index) in product.images" :key="index" class="relative group">
                <img
                  :src="img"
                  :alt="`Product image ${index + 1}`"
                  class="w-full h-32 object-cover rounded-2xl shadow-md"
                  @error="handleImageError"
                />
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                  <span class="text-white text-xs">Image {{ index + 1 }}</span>
                </div>
              </div>
            </div>
            <p class="mt-3 text-sm text-stone-600">
              Note: Upload new images below to replace these
            </p>
          </div>

          <!-- Product Basics -->
          <div class="space-y-8">
            <div>
              <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-4">
                Product Name <span class="text-red-600">*</span>
              </label>
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
                <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-4">
                  Price ($) <span class="text-red-600">*</span>
                </label>
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
                <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-4">
                  Stock <span class="text-red-600">*</span>
                </label>
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
              <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-4">
                Category <span class="text-red-600">*</span>
              </label>
              <select
                v-model="form.category_id"
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
                <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-4">Discount %</label>
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

          <!-- New Images Upload -->
          <div>
            <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-4">
              Upload New Images (optional)
            </label>
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
            <p class="mt-3 text-sm text-stone-600">
              Leave empty to keep existing images
            </p>
          </div>

          <!-- Active Checkbox -->
          <div class="flex items-center">
            <input
              v-model="form.is_active"
              type="checkbox"
              class="h-6 w-6 text-amber-600 border-stone-300 rounded focus:ring-amber-500"
            />
            <label class="ml-4 text-lg font-serif text-[#2c1810]">Product is active and visible</label>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4">
            <button
              type="button"
              @click="$router.push({ name: 'ProductManagement' })"
              class="flex-1 bg-stone-200 text-stone-700 py-6 rounded-3xl font-serif text-2xl font-medium hover:bg-stone-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 bg-amber-600 text-white py-6 rounded-3xl font-serif text-2xl font-medium hover:bg-amber-700 transition-all disabled:bg-stone-400 flex justify-center items-center gap-4 shadow-xl"
            >
              <span v-if="isLoading" class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></span>
              {{ isLoading ? 'Updating...' : 'Update Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="container mx-auto px-6 -mt-20 relative z-20 max-w-4xl">
      <div class="bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/50 p-16 text-center">
        <svg class="mx-auto h-24 w-24 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-2xl font-serif text-stone-600">Product not found</h3>
        <button
          @click="$router.push({ name: 'ProductManagement' })"
          class="mt-6 px-8 py-3 bg-amber-600 text-white rounded-2xl hover:bg-amber-700 transition-colors"
        >
          Back to Products
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { productService } from '@/services/products'
import { authService } from '@/services/auth'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()

const product = ref<any>(null)
const categories = ref<any[]>([])
const isLoadingProduct = ref(true)
const isLoading = ref(false)
const hasDiscount = ref(false)
const fileName = ref<string>('')
const selectedFiles = ref<File[]>([])

const form = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category_id: '',
  discount_percentage: 0,
  discount_starts_at: '',
  discount_ends_at: '',
  is_active: true
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

  await loadProduct()
  await loadCategories()
})

const loadProduct = async () => {
  isLoadingProduct.value = true
  try {
    const slug = route.params.slug as string
    product.value = await productService.getProductBySlug(slug)
    
    if (product.value) {
      // Populate form
      form.value = {
        name: product.value.name,
        description: product.value.description || '',
        price: product.value.price,
        stock: product.value.stock || 0,
        category_id: product.value.category?.id || '',
        discount_percentage: product.value.discount_percentage || 0,
        discount_starts_at: product.value.discount_starts_at ? product.value.discount_starts_at.split('T')[0] : '',
        discount_ends_at: product.value.discount_ends_at ? product.value.discount_ends_at.split('T')[0] : '',
        is_active: product.value.is_active !== false
      }
      
      hasDiscount.value = !!product.value.discount_percentage
    }
  } catch (error) {
    console.error('Failed to load product', error)
  } finally {
    isLoadingProduct.value = false
  }
}

const loadCategories = async () => {
  try {
    const { data } = await api.get('/categories')
    categories.value = data
  } catch (error) {
    console.error('Failed to load categories', error)
  }
}

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
    formData.append('category_id', String(form.value.category_id))
    formData.append('is_active', form.value.is_active ? '1' : '0')

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

    // Only append images if new ones were selected
    if (selectedFiles.value.length > 0) {
      selectedFiles.value.forEach((file) => {
        formData.append('images[]', file)
      })
    }

    await productService.updateProduct(product.value.id, formData)
    
    const goToList = confirm('Product updated successfully! Would you like to view all products?')
    if (goToList) {
      router.push({ name: 'ProductManagement' })
    } else {
      // Reload product data
      await loadProduct()
      selectedFiles.value = []
      fileName.value = ''
    }
  } catch (error: any) {
    console.error('Update error:', error)
    alert(error.response?.data?.message || 'Failed to update product. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23f5f4f0" width="100" height="100"/%3E%3Ctext x="50" y="50" font-family="Arial" font-size="14" fill="%23a8a29e" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E'
  target.onerror = null
}
</script>
