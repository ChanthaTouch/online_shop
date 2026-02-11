<!-- src/views/Admin/ProductEdit.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-2xl">
      <div class="mb-8">
        <h1 class="text-4xl font-black text-gray-800 mb-2">Admin Dashboard</h1>
        <p class="text-gray-600">Edit Product: {{ form.name || 'Loading...' }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-xl shadow-sm p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading product data...</p>
      </div>

      <!-- Edit Form -->
      <div v-else class="bg-white rounded-xl shadow-sm p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 gap-6">

            <!-- Product Name -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                placeholder="Enter product name"
              />
            </div>

            <!-- Slug -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Slug (URL friendly)</label>
              <input
                v-model="form.slug"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                placeholder="Auto-generated if left empty"
              />
              <p class="text-xs text-gray-500 mt-1">Leave empty to keep current or let backend generate</p>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea
                v-model="form.description"
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                placeholder="Describe your product"
              ></textarea>
            </div>

            <!-- Price & Stock -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Price ($)</label>
                <input
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Stock</label>
                <input
                  v-model.number="form.stock"
                  type="number"
                  min="0"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                />
              </div>
            </div>

            <!-- Category -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select
                v-model="form.category"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              >
                <option value="" disabled>Select a category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <!-- Discount Section -->
            <div class="border-t pt-6">
              <div class="flex items-center mb-4">
                <input
                  v-model="hasDiscount"
                  type="checkbox"
                  class="h-5 w-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                />
                <label class="ml-3 text-lg font-bold text-gray-900">Apply discount</label>
              </div>

              <div v-if="hasDiscount" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Discount Percentage (%)</label>
                  <input
                    v-model.number="form.discount_percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
                  <input
                    v-model="form.discount_starts_at"
                    type="date"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">End Date</label>
                  <input
                    v-model="form.discount_ends_at"
                    type="date"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                  />
                </div>
              </div>

              <!-- Discount Preview -->
              <div
                v-if="hasDiscount && form.price > 0 && form.discount_percentage > 0"
                class="mt-6 p-4 bg-pink-50 rounded-lg"
              >
                <p class="text-sm text-gray-700">Original: <span class="font-bold">${{ form.price.toFixed(2) }}</span></p>
                <p class="text-lg font-bold text-pink-600">
                  Discounted: ${{ (form.price * (1 - form.discount_percentage / 100)).toFixed(2) }}
                </p>
              </div>
            </div>

            <!-- Current Images -->
            <div v-if="currentImages.length > 0">
              <label class="block text-sm font-bold text-gray-700 mb-2">Current Images</label>
              <div class="grid grid-cols-3 gap-4">
                <div v-for="(img, i) in currentImages" :key="i" class="relative">
                  <img
                    :src="img"
                    class="h-32 w-full object-cover rounded-lg shadow-sm"
                    alt="Current product image"
                  />
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-2">Upload new images below to replace all</p>
            </div>

            <!-- Upload New Images -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Replace Images (optional)</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-pink-500 transition">
                <div class="space-y-1 text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h0.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div class="flex text-sm text-gray-600">
                    <label class="relative cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500">
                      <span>Upload files</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        class="sr-only"
                        @change="handleFileChange"
                      />
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                  <p v-if="fileName" class="text-sm font-bold text-pink-500 mt-2">{{ fileName }}</p>
                </div>
              </div>
            </div>

            <!-- Active Status -->
            <div class="flex items-center">
              <input
                v-model="isActive"
                type="checkbox"
                class="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <label class="ml-2 block text-sm text-gray-900">Product is active and visible</label>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-4 pt-6">
            <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 bg-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-pink-600 transition disabled:bg-gray-400 flex justify-center items-center gap-3"
            >
              <span v-if="isLoading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              {{ isLoading ? 'Saving...' : 'Update Product' }}
            </button>

            <router-link
              :to="{ name: 'AdminDashboard' }"
              class="px-6 py-4 bg-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-400 transition text-center"
            >
              Cancel
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productService } from '@/services/products'
import { authService } from '@/services/auth'

const route = useRoute()
const router = useRouter()

const slug = ref<string>('')
const productId = ref<number | null>(null)
const loading = ref(true)
const isLoading = ref(false)
const isActive = ref(true)
const hasDiscount = ref(false)
const fileName = ref<string>('')
const selectedFiles = ref<File[]>([])
const currentImages = ref<string[]>([])

const categories = ref<any[]>([])

const form = ref({
  name: '',
  slug: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  discount_percentage: 0,
  discount_starts_at: '',
  discount_ends_at: '',
})

onMounted(async () => {
  // Admin guard
  if (!authService.isAuthenticated() || !authService.isAdmin()) {
    alert('Access Denied: Admins Only')
    router.push({ name: 'Home' })
    return
  }

  slug.value = route.params.slug as string
  if (!slug.value) {
    alert('Invalid product slug')
    router.push({ name: 'AdminDashboard' })
    return
  }

  try {
    // Load categories
    categories.value = await productService.getCategories()

    // Load product by slug (public API – reliable)
    const product = await productService.getProductBySlug(slug.value)

    // Save ID for update
    productId.value = product.id

    // Fill form
    form.value = {
      name: product.name,
      slug: product.slug || '',
      description: product.description || '',
      price: product.price,
      stock: product.stock ?? 0,
      category: String(product.category_id),
      discount_percentage: product.discount_percentage ?? 0,
      discount_starts_at: product.discount_starts_at ? product.discount_starts_at.slice(0, 10) : '',
      discount_ends_at: product.discount_ends_at ? product.discount_ends_at.slice(0, 10) : '',
    }

    isActive.value = product.is_active ?? true
    currentImages.value = product.image_urls || (product.primary_image ? [product.primary_image] : [])
    hasDiscount.value = !!product.discount_percentage && product.discount_percentage > 0
  } catch (error) {
    console.error('Failed to load product:', error)
    alert('Product not found or error loading data')
    router.push({ name: 'AdminDashboard' })
  } finally {
    loading.value = false
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
  if (!productId.value) return

  isLoading.value = true
  try {
    const formData = new FormData()
    formData.append('_method', 'PUT')  // Laravel form spoofing
    formData.append('name', form.value.name)
    if (form.value.slug) formData.append('slug', form.value.slug)
    formData.append('description', form.value.description || '')
    formData.append('price', String(form.value.price))
    formData.append('stock', String(form.value.stock))
    formData.append('category_id', form.value.category)
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

    if (selectedFiles.value.length > 0) {
      selectedFiles.value.forEach(file => formData.append('images[]', file))
    }

    await productService.updateProduct(productId.value, formData)

    alert('Product updated successfully!')
    router.push({ name: 'AdminDashboard' })
  } catch (error: any) {
    console.error('Update failed:', error)
    alert(error.response?.data?.message || 'Failed to update product. Check fields and try again.')
  } finally {
    isLoading.value = false
  }
}
</script>