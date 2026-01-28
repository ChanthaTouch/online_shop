<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-2xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-black text-gray-800 mb-2">Admin Dashboard</h1>
        <p class="text-gray-600">Manage products and inventory</p>
      </div>

      <!-- Admin Menu -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div 
          @click="handleTabChange('upload')"
          :class="['p-6 bg-white rounded-lg shadow cursor-pointer hover:shadow-lg transition', currentTab === 'upload' ? 'border-2 border-pink-500' : '']"
        >
          <h3 class="text-xl font-bold text-gray-800">📤 Upload Product</h3>
          <p class="text-gray-600 text-sm mt-2">Add new products to store</p>
        </div>
        <div 
          @click="handleTabChange('list')"
          :class="['p-6 bg-white rounded-lg shadow cursor-pointer hover:shadow-lg transition', currentTab === 'list' ? 'border-2 border-pink-500' : '']"
        >
          <h3 class="text-xl font-bold text-gray-800">📋 View Products</h3>
          <p class="text-gray-600 text-sm mt-2">See all products</p>
        </div>
      </div>

      <!-- Upload Form -->
      <div v-if="currentTab === 'upload'" class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-bold mb-6">Add New Product</h2>
        
        <form @submit.prevent="uploadProduct" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-2">Product Name</label>
            <input 
              v-model="form.name"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2">Description</label>
            <textarea 
              v-model="form.description"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              rows="4"
              required
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-2">Price</label>
              <input 
                v-model="form.price"
                type="number"
                step="0.01"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Stock</label>
              <input 
                v-model="form.stock"
                type="number"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2">Category</label>
            <select 
              v-model="form.category"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              required
            >
              <option value="">Select category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2">Product Images</label>
            <input 
              type="file"
              multiple
              accept="image/*"
              @change="handleImageSelect"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
            />
            <p class="text-xs text-gray-500 mt-2">You can select multiple images</p>
            <div v-if="form.images.length > 0" class="mt-3 flex flex-wrap gap-2">
              <span v-for="(img, idx) in form.images" :key="idx" class="px-2 py-1 bg-pink-100 text-pink-700 text-sm rounded">
                {{ img.name }}
              </span>
            </div>
          </div>

          <button 
            type="submit"
            :disabled="isLoading"
            class="w-full px-4 py-3 bg-pink-500 text-white rounded-lg font-bold hover:bg-pink-600 disabled:bg-gray-400 transition"
          >
            {{ isLoading ? 'Uploading...' : 'Upload Product' }}
          </button>
        </form>
      </div>

      <!-- Products List -->
      <div v-if="currentTab === 'list'" class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-bold mb-6">Products</h2>
        <div v-if="products.length === 0" class="text-gray-600">No products found</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="border-b">
              <tr>
                <th class="text-left p-2">Name</th>
                <th class="text-left p-2">Price</th>
                <th class="text-left p-2">Stock</th>
                <th class="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id" class="border-b hover:bg-gray-50">
                <td class="p-2">{{ product.name }}</td>
                <td class="p-2">${{ parseFloat(product.price).toFixed(2) }}</td>
                <td class="p-2">{{ product.stock }}</td>
                <td class="p-2">
                  <span v-if="product.is_active" class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Active</span>
                  <span v-else class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Inactive</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { productService } from '@/services/products'
import { authService } from '@/services/auth'

const router = useRouter()
const currentTab = ref('upload')
const isLoading = ref(false)
const products = ref([])
const categories = ref([])

const form = ref({
  name: '',
  description: '',
  price: '',
  stock: '',
  category: '',
  images: [] as File[]
})

// Check if user is admin on mount
onMounted(async () => {
  if (!authService.isAdmin()) {
    router.push({ name: 'Home' })
    return
  }
  
  try {
    const data = await productService.getCategories()
    categories.value = data.data || data
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
})

const handleImageSelect = (event: any) => {
  form.value.images = Array.from(event.target.files)
}

const uploadProduct = async () => {
  if (!form.value.name || !form.value.description || !form.value.price || !form.value.stock || !form.value.category) {
    alert('Please fill in all required fields')
    return
  }

  isLoading.value = true
  try {
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('description', form.value.description)
    formData.append('price', form.value.price)
    formData.append('stock', form.value.stock)
    formData.append('category_id', form.value.category)
    formData.append('is_active', 'true')
    
    // Generate slug from name
    const slug = form.value.name.toLowerCase().replace(/\s+/g, '-')
    formData.append('slug', slug)

    // Add images
    form.value.images.forEach((image) => {
      formData.append('images[]', image)
    })

    const response = await productService.createProduct(formData)
    alert('Product uploaded successfully!')
    form.value = { name: '', description: '', price: '', stock: '', category: '', images: [] }
  } catch (error: any) {
    console.error('Upload error:', error)
    alert(error.response?.data?.message || 'Error uploading product')
  } finally {
    isLoading.value = false
  }
}

const loadProducts = async () => {
  try {
    const data = await productService.getProducts()
    products.value = data.data || data
  } catch (error) {
    console.error('Failed to load products:', error)
  }
}

const handleTabChange = (tab: string) => {
  currentTab.value = tab
  if (tab === 'list') {
    loadProducts()
  }
}
</script>