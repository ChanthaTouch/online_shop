<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-2xl">
      <div class="mb-8 flex justify-between items-end">
        <div>
          <h1 class="text-4xl font-black text-gray-800 mb-2">Admin Dashboard</h1>
          <p class="text-gray-600">
            Edit Product: <span class="text-amber-700 font-bold">{{ form.name || '...' }}</span>
          </p>
        </div>
        <router-link to="/admin" class="text-sm text-gray-500 hover:text-gray-800 transition-colors">
          ← Back to Dashboard
        </router-link>
      </div>

      <div v-if="loading" class="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto"></div>
        <p class="mt-4 text-gray-500 font-serif italic">Retrieving product details...</p>
      </div>

      <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 gap-6">

            <div>
              <label class="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Product Name</label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="Enter product name"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Price ($)</label>
                <input
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label class="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Stock</label>
                <input
                  v-model.number="form.stock"
                  type="number"
                  min="0"
                  required
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Category</label>
              <div class="relative">
                <select
                  v-model="form.category_id"
                  required
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none appearance-none bg-white"
                >
                  <option value="" disabled>Select a category</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Description</label>
              <textarea
                v-model="form.description"
                rows="4"
                placeholder="Describe the product experience..."
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition"
              ></textarea>
            </div>

            <div class="bg-amber-50/50 p-6 rounded-xl border border-amber-100">
              <div class="flex items-center mb-4">
                <input
                  v-model="hasDiscount"
                  type="checkbox"
                  id="discount-toggle"
                  class="h-5 w-5 text-amber-700 border-gray-300 rounded focus:ring-amber-500 cursor-pointer"
                />
                <label for="discount-toggle" class="ml-3 text-sm font-bold text-gray-800 cursor-pointer">Enable Sale / Discount</label>
              </div>

              <div v-if="hasDiscount" class="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label class="block text-xs font-bold text-gray-600 mb-1">Percentage (%)</label>
                  <input
                    v-model.number="form.discount_percentage"
                    type="number"
                    min="0"
                    max="100"
                    class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-amber-500 outline-none"
                  />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-gray-600 mb-1">Starts At</label>
                    <input v-model="form.discount_starts_at" type="date" class="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-600 mb-1">Ends At</label>
                    <input v-model="form.discount_ends_at" type="date" class="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>

            <div v-if="currentImages.length > 0">
              <label class="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Current Gallery</label>
              <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <div v-for="(img, i) in currentImages" :key="i" class="relative group flex-shrink-0">
                  <img :src="img" class="h-24 w-24 object-cover rounded-xl border border-gray-200 shadow-sm" />
                </div>
              </div>
            </div>

            <div>
              <label class="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Upload New Images</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-amber-400 transition-colors">
                <div class="space-y-1 text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div class="flex text-sm text-gray-600">
                    <label class="relative cursor-pointer bg-white rounded-md font-medium text-amber-700 hover:text-amber-600">
                      <span>Upload files</span>
                      <input type="file" multiple accept="image/*" @change="handleFileChange" class="sr-only" />
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </div>
              <div v-if="selectedFiles.length > 0" class="mt-2 text-xs text-amber-700 font-bold">
                {{ selectedFiles.length }} new files selected.
              </div>
            </div>
          </div>

          <div class="flex gap-4 pt-8">
            <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 bg-[#2C1810] text-white py-4 rounded-xl font-bold hover:bg-black transition-all disabled:opacity-50 flex justify-center items-center gap-3 shadow-lg shadow-stone-200"
            >
              <span v-if="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ isLoading ? 'Saving Changes...' : 'Update Product' }}
            </button>
            <button
              type="button"
              @click="router.back()"
              class="px-8 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productService } from '@/services/products'
import { authService } from '@/services/auth'

const route = useRoute()
const router = useRouter()

const productId = ref<number | null>(null)
const loading = ref(true)
const isLoading = ref(false)
const hasDiscount = ref(false)
const selectedFiles = ref<File[]>([])
const currentImages = ref<string[]>([])
const categories = ref<any[]>([])

// Using 'category_id' to match the backend expectation
const form = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category_id: '', 
  discount_percentage: 0,
  discount_starts_at: '',
  discount_ends_at: '',
})

onMounted(async () => {
  // Security Check
  if (!authService.isAdmin()) {
    router.push({ name: 'Home' })
    return
  }

  try {
    const slug = route.params.slug as string
    if (!slug) throw new Error('No product slug provided')

    const [product, cats] = await Promise.all([
      productService.getProductBySlug(slug),
      productService.getCategories()
    ])

    categories.value = cats
    productId.value = product.id
    
    // Map data to form
    form.value = {
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      stock: product.stock || 0,
      category_id: product.category_id ? String(product.category_id) : '',
      discount_percentage: product.discount_percentage || 0,
      // Date formatting for <input type="date"> (YYYY-MM-DD)
      discount_starts_at: product.discount_starts_at ? product.discount_starts_at.split('T')[0] : '',
      discount_ends_at: product.discount_ends_at ? product.discount_ends_at.split('T')[0] : '',
    }
    
    hasDiscount.value = product.is_on_sale || !!product.discount_percentage
    currentImages.value = product.image_urls || (product.display_image ? [product.display_image] : [])
    
  } catch (error) {
    console.error('Fetch error:', error)
    alert('Could not find this product.')
    router.push('/admin')
  } finally {
    loading.value = false
  }
})

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    selectedFiles.value = Array.from(target.files)
  }
}

const handleSubmit = async () => {
  if (!productId.value) return
  isLoading.value = true

  try {
    const formData = new FormData()
    
    /**
     * IMPORTANT: Laravel/PHP often requires '_method: PUT' when sending 
     * multipart/form-data via POST because browsers/servers don't 
     * natively support files via standard PUT.
     */
    formData.append('_method', 'PUT')
    
    formData.append('name', form.value.name)
    formData.append('description', form.value.description)
    formData.append('price', String(form.value.price))
    formData.append('stock', String(form.value.stock))
    formData.append('category_id', form.value.category_id)

    if (hasDiscount.value) {
      formData.append('discount_percentage', String(form.value.discount_percentage))
      formData.append('discount_starts_at', form.value.discount_starts_at)
      formData.append('discount_ends_at', form.value.discount_ends_at)
    } else {
      // If discount is disabled, send nulls or 0s to clear it on backend
      formData.append('discount_percentage', '0')
    }

    // Append new images if any
    selectedFiles.value.forEach((file) => {
      formData.append('images[]', file)
    })

    await productService.updateProduct(productId.value, formData)
    
    alert('Product updated successfully!')
    router.push('/admin')
  } catch (err: any) {
    console.error('Update error:', err)
    const msg = err.response?.data?.message || 'Something went wrong while updating.'
    alert(msg)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Optional: Hide scrollbar for images row */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>