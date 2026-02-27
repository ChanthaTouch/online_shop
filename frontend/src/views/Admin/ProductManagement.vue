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
        <h1 class="font-serif text-6xl md:text-8xl text-white mb-6">Product Management</h1>
        <div class="w-24 h-[1px] bg-amber-500/50 mx-auto"></div>
        <p class="mt-8 text-white/80 text-lg font-light">Manage your product catalog</p>
      </div>
    </div>

    <div class="container mx-auto px-6 -mt-20 relative z-20 max-w-7xl">
      <!-- Action Bar -->
      <div class="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-6 mb-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex-1 w-full md:w-auto">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products..."
              class="w-full px-6 py-3 bg-[#f5f4f0]/50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-500/30 outline-none"
              @input="handleSearch"
            />
          </div>
          <router-link
            :to="{ name: 'AdminDashboard' }"
            class="bg-amber-600 text-white px-8 py-3 rounded-2xl font-medium hover:bg-amber-700 transition-all shadow-lg whitespace-nowrap"
          >
            + Add New Product
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto"></div>
        <p class="mt-4 text-stone-600">Loading products...</p>
      </div>

      <!-- Products Table -->
      <div v-else class="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-amber-50/50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-amber-700">Image</th>
                <th class="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-amber-700">Product</th>
                <th class="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-amber-700">Category</th>
                <th class="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-amber-700">Price</th>
                <th class="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-amber-700">Stock</th>
                <th class="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-amber-700">Status</th>
                <th class="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-amber-700">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-200">
              <tr v-for="product in products" :key="product.id" class="hover:bg-amber-50/30 transition-colors">
                <td class="px-6 py-4">
                  <img
                    :src="product.display_image"
                    :alt="product.name"
                    class="w-16 h-16 object-cover rounded-xl shadow-md"
                    @error="handleImageError"
                  />
                </td>
                <td class="px-6 py-4">
                  <div class="font-serif text-lg font-medium text-[#2c1810]">{{ product.name }}</div>
                  <div class="text-sm text-stone-500">{{ product.slug }}</div>
                </td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-sm">
                    {{ product.category?.name || 'N/A' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="font-serif text-lg">${{ product.price.toFixed(2) }}</div>
                  <div v-if="product.discount_price" class="text-sm text-amber-600 font-medium">
                    Sale: ${{ product.discount_price.toFixed(2) }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-medium',
                      product.stock > 10 ? 'bg-green-100 text-green-700' :
                      product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    ]"
                  >
                    {{ product.stock }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-medium',
                      product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    ]"
                  >
                    {{ product.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end gap-2">
                    <button
                      @click="editProduct(product)"
                      class="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      @click="confirmDelete(product)"
                      class="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="products.length === 0" class="text-center py-20">
          <svg class="mx-auto h-24 w-24 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 class="mt-4 text-xl font-serif text-stone-600">No products found</h3>
          <p class="mt-2 text-stone-500">Get started by creating a new product</p>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.last_page > 1" class="px-6 py-4 bg-stone-50/50 border-t border-stone-200">
          <div class="flex justify-between items-center">
            <button
              @click="changePage(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="px-4 py-2 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span class="text-sm text-stone-600">
              Page {{ pagination.current_page }} of {{ pagination.last_page }}
            </span>
            <button
              @click="changePage(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="px-4 py-2 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showDeleteModal = false"
    >
      <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <h3 class="text-2xl font-serif font-bold text-[#2c1810] mb-4">Confirm Delete</h3>
        <p class="text-stone-600 mb-6">
          Are you sure you want to delete <strong>{{ productToDelete?.name }}</strong>? This action cannot be undone.
        </p>
        <div class="flex gap-4">
          <button
            @click="showDeleteModal = false"
            class="flex-1 px-6 py-3 bg-stone-200 text-stone-700 rounded-2xl hover:bg-stone-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            @click="deleteProduct"
            :disabled="isDeleting"
            class="flex-1 px-6 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      @click.self="showEditModal = false"
    >
      <div class="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl my-8">
        <h3 class="text-3xl font-serif font-bold text-[#2c1810] mb-6">Edit Product</h3>
        
        <form @submit.prevent="updateProduct" class="space-y-6">
          <div>
            <label class="block text-xs font-black uppercase tracking-wider text-amber-700 mb-2">Product Name</label>
            <input
              v-model="editForm.name"
              type="text"
              required
              class="w-full px-4 py-3 bg-[#f5f4f0]/50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-500/30 outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-black uppercase tracking-wider text-amber-700 mb-2">Description</label>
            <textarea
              v-model="editForm.description"
              rows="3"
              class="w-full px-4 py-3 bg-[#f5f4f0]/50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-500/30 outline-none resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-black uppercase tracking-wider text-amber-700 mb-2">Price ($)</label>
              <input
                v-model.number="editForm.price"
                type="number"
                min="0"
                step="0.01"
                required
                class="w-full px-4 py-3 bg-[#f5f4f0]/50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-500/30 outline-none"
              />
            </div>
            <div>
              <label class="block text-xs font-black uppercase tracking-wider text-amber-700 mb-2">Stock</label>
              <input
                v-model.number="editForm.stock"
                type="number"
                min="0"
                required
                class="w-full px-4 py-3 bg-[#f5f4f0]/50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-500/30 outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-black uppercase tracking-wider text-amber-700 mb-2">Category</label>
            <select
              v-model="editForm.category_id"
              required
              class="w-full px-4 py-3 bg-[#f5f4f0]/50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-500/30 outline-none"
            >
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="flex items-center gap-4">
            <input
              v-model="editForm.is_active"
              type="checkbox"
              class="h-5 w-5 text-amber-600 border-stone-300 rounded focus:ring-amber-500"
            />
            <label class="text-lg font-serif text-[#2c1810]">Product is active</label>
          </div>

          <div class="flex gap-4 pt-4">
            <button
              type="button"
              @click="showEditModal = false"
              class="flex-1 px-6 py-3 bg-stone-200 text-stone-700 rounded-2xl hover:bg-stone-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isUpdating"
              class="flex-1 px-6 py-3 bg-amber-600 text-white rounded-2xl hover:bg-amber-700 transition-colors font-medium disabled:opacity-50"
            >
              {{ isUpdating ? 'Updating...' : 'Update Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { productService, type Product } from '@/services/products'
import { authService } from '@/services/auth'

const router = useRouter()
const products = ref<Product[]>([])
const categories = ref<any[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0
})

const showDeleteModal = ref(false)
const showEditModal = ref(false)
const productToDelete = ref<Product | null>(null)
const productToEdit = ref<Product | null>(null)
const isDeleting = ref(false)
const isUpdating = ref(false)

const editForm = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category_id: '',
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

  await loadProducts()
  await loadCategories()
})

const loadProducts = async (page = 1) => {
  isLoading.value = true
  try {
    const response = await productService.getProducts(page, undefined, searchQuery.value)
    products.value = response.data
    pagination.value = {
      current_page: response.current_page,
      last_page: response.last_page,
      per_page: response.per_page,
      total: response.total
    }
  } catch (error) {
    console.error('Failed to load products', error)
    alert('Failed to load products')
  } finally {
    isLoading.value = false
  }
}

const loadCategories = async () => {
  try {
    categories.value = await productService.getCategories()
  } catch (error) {
    console.error('Failed to load categories', error)
  }
}

const handleSearch = () => {
  loadProducts(1)
}

const changePage = (page: number) => {
  loadProducts(page)
}

const editProduct = (product: Product) => {
  productToEdit.value = product
  editForm.value = {
    name: product.name,
    description: product.description || '',
    price: product.price,
    stock: product.stock || 0,
    category_id: product.category?.id || '',
    is_active: product.is_active !== false
  }
  showEditModal.value = true
}

const updateProduct = async () => {
  if (!productToEdit.value) return

  isUpdating.value = true
  try {
    const formData = new FormData()
    formData.append('name', editForm.value.name)
    formData.append('description', editForm.value.description)
    formData.append('price', String(editForm.value.price))
    formData.append('stock', String(editForm.value.stock))
    formData.append('category_id', String(editForm.value.category_id))
    formData.append('is_active', editForm.value.is_active ? '1' : '0')

    await productService.updateProduct(productToEdit.value.id, formData)
    alert('Product updated successfully!')
    showEditModal.value = false
    await loadProducts(pagination.value.current_page)
  } catch (error: any) {
    alert(error.response?.data?.message || 'Failed to update product')
  } finally {
    isUpdating.value = false
  }
}

const confirmDelete = (product: Product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const deleteProduct = async () => {
  if (!productToDelete.value) return

  isDeleting.value = true
  try {
    await productService.deleteProduct(productToDelete.value.id)
    alert('Product deleted successfully!')
    showDeleteModal.value = false
    await loadProducts(pagination.value.current_page)
  } catch (error: any) {
    alert(error.response?.data?.message || 'Failed to delete product')
  } finally {
    isDeleting.value = false
  }
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = '/images/placeholder-product.jpg'
}
</script>
