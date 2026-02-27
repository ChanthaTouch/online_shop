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
        <h1 class="font-serif text-6xl md:text-8xl text-white mb-6">Category Management</h1>
        <div class="w-24 h-[1px] bg-amber-500/50 mx-auto"></div>
        <p class="mt-8 text-white/80 text-lg font-light">Manage your product categories</p>
      </div>
    </div>

    <div class="container mx-auto px-6 -mt-20 relative z-20 max-w-7xl">
      <!-- Action Bar -->
      <div class="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-6 mb-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 class="text-2xl font-serif font-bold text-[#2c1810]">All Categories</h2>
          <router-link
            :to="{ name: 'CategoryCreate' }"
            class="bg-amber-600 text-white px-8 py-3 rounded-2xl font-medium hover:bg-amber-700 transition-all shadow-lg whitespace-nowrap"
          >
            + Add New Category
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto"></div>
        <p class="mt-4 text-stone-600">Loading categories...</p>
      </div>

      <!-- Categories Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="category in categories"
          :key="category.id"
          class="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all"
        >
          <!-- Category Image -->
          <div class="h-48 bg-gradient-to-br from-amber-100 to-orange-100 relative overflow-hidden">
            <img
              v-if="category.image"
              :src="category.image"
              :alt="category.name"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-20 h-20 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>

          <!-- Category Info -->
          <div class="p-6">
            <h3 class="text-2xl font-serif font-bold text-[#2c1810] mb-2">{{ category.name }}</h3>
            <p v-if="category.slug" class="text-sm text-stone-500 mb-3">{{ category.slug }}</p>
            <p v-if="category.description" class="text-stone-600 text-sm line-clamp-2 mb-4">
              {{ category.description }}
            </p>

            <!-- Actions -->
            <div class="flex gap-2 mt-4">
              <button
                @click="editCategory(category)"
                class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Edit
              </button>
              <button
                @click="confirmDelete(category)"
                class="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && categories.length === 0" class="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-20 text-center">
        <svg class="mx-auto h-24 w-24 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 class="mt-4 text-xl font-serif text-stone-600">No categories found</h3>
        <p class="mt-2 text-stone-500">Get started by creating a new category</p>
        <router-link
          :to="{ name: 'CategoryCreate' }"
          class="mt-6 inline-block bg-amber-600 text-white px-8 py-3 rounded-2xl font-medium hover:bg-amber-700 transition-all shadow-lg"
        >
          Create Category
        </router-link>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      @click.self="showEditModal = false"
    >
      <div class="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl my-8">
        <h3 class="text-3xl font-serif font-bold text-[#2c1810] mb-6">Edit Category</h3>
        
        <form @submit.prevent="updateCategory" class="space-y-6">
          <!-- Current Image -->
          <div v-if="editForm.current_image">
            <label class="block text-xs font-black uppercase tracking-wider text-amber-700 mb-2">Current Image</label>
            <img
              :src="editForm.current_image"
              alt="Current category image"
              class="w-full h-48 object-cover rounded-2xl shadow-md"
              @error="handleImageError"
            />
          </div>

          <div>
            <label class="block text-xs font-black uppercase tracking-wider text-amber-700 mb-2">
              Category Name <span class="text-red-600">*</span>
            </label>
            <input
              v-model="editForm.name"
              type="text"
              required
              class="w-full px-4 py-3 bg-[#f5f4f0]/50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-500/30 outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-black uppercase tracking-wider text-amber-700 mb-2">Slug</label>
            <input
              v-model="editForm.slug"
              type="text"
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

          <!-- New Image Upload -->
          <div>
            <label class="block text-xs font-black uppercase tracking-wider text-amber-700 mb-2">
              Upload New Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              @change="handleEditFileChange"
              class="w-full px-4 py-3 bg-[#f5f4f0]/50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-500/30 outline-none"
            />
            <p class="mt-2 text-sm text-stone-600">Leave empty to keep current image</p>
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
              {{ isUpdating ? 'Updating...' : 'Update Category' }}
            </button>
          </div>
        </form>
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
          Are you sure you want to delete <strong>{{ categoryToDelete?.name }}</strong>? This action cannot be undone.
        </p>
        <div class="flex gap-4">
          <button
            @click="showDeleteModal = false"
            class="flex-1 px-6 py-3 bg-stone-200 text-stone-700 rounded-2xl hover:bg-stone-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            @click="deleteCategory"
            :disabled="isDeleting"
            class="flex-1 px-6 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { categoryService } from '@/services/categorie'
import { authService } from '@/services/auth'
import api from '@/services/api'

const router = useRouter()
const categories = ref<any[]>([])
const isLoading = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const categoryToEdit = ref<any>(null)
const categoryToDelete = ref<any>(null)
const isUpdating = ref(false)
const isDeleting = ref(false)
const editImageFile = ref<File | null>(null)

const editForm = ref({
  name: '',
  slug: '',
  description: '',
  current_image: ''
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

  await loadCategories()
})

const loadCategories = async () => {
  isLoading.value = true
  try {
    categories.value = await categoryService.getCategories()
  } catch (error) {
    console.error('Failed to load categories', error)
    alert('Failed to load categories')
  } finally {
    isLoading.value = false
  }
}

const editCategory = (category: any) => {
  categoryToEdit.value = category
  editForm.value = {
    name: category.name,
    slug: category.slug || '',
    description: category.description || '',
    current_image: category.image || ''
  }
  editImageFile.value = null
  showEditModal.value = true
}

const handleEditFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    editImageFile.value = target.files[0]
  }
}

const updateCategory = async () => {
  if (!categoryToEdit.value) return

  isUpdating.value = true
  try {
    const formData = new FormData()
    formData.append('name', editForm.value.name)
    if (editForm.value.slug) {
      formData.append('slug', editForm.value.slug)
    }
    if (editForm.value.description) {
      formData.append('description', editForm.value.description)
    }
    if (editImageFile.value) {
      formData.append('image', editImageFile.value)
    }

    await api.post(`/categories/${categoryToEdit.value.id}?_method=PUT`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    alert('Category updated successfully!')
    showEditModal.value = false
    await loadCategories()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Failed to update category')
  } finally {
    isUpdating.value = false
  }
}

const confirmDelete = (category: any) => {
  categoryToDelete.value = category
  showDeleteModal.value = true
}

const deleteCategory = async () => {
  if (!categoryToDelete.value) return

  isDeleting.value = true
  try {
    await api.delete(`/categories/${categoryToDelete.value.id}`)
    alert('Category deleted successfully!')
    showDeleteModal.value = false
    await loadCategories()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Failed to delete category')
  } finally {
    isDeleting.value = false
  }
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect fill="%23f5f4f0" width="200" height="200"/%3E%3Cpath d="M70 70h60v60H70z" fill="%23d6d3d1"/%3E%3Cpath d="M85 85l15 20 10-10 20 25H80z" fill="%23a8a29e"/%3E%3Ccircle cx="95" cy="90" r="5" fill="%23a8a29e"/%3E%3C/svg%3E'
  target.onerror = null
}
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
