<!-- src/views/admin/CategoryCreate.vue -->
<template>
  <div class="bg-gray-50">
    <div class="container mx-auto px-4 max-w-2xl py-8">
      <div class="mb-8">
        <h1 class="text-4xl font-black text-gray-800 mb-2">Admin Dashboard</h1>
        <p class="text-gray-600">Create a new product category</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Name -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Category Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
              placeholder="e.g. Electronics, Fashion, Home & Kitchen"
            />
          </div>

          <!-- Slug -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Slug (optional)</label>
            <input
              v-model="form.slug"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
              placeholder="auto-generated-if-empty (e.g. electronics)"
            />
            <p class="mt-1 text-xs text-gray-500">
              Used in URLs. Leave empty to auto-generate from name.
            </p>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Description (optional)</label>
            <textarea
              v-model="form.description"
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
              placeholder="Short description of this category..."
            ></textarea>
          </div>

          <!-- Image Upload -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Category Image (optional)</label>
            <div
              class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-pink-500 transition-colors cursor-pointer"
              @dragover.prevent
              @drop.prevent="handleDrop"
            >
              <div class="space-y-1 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <div class="flex text-sm text-gray-600">
                  <label class="relative cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-pink-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      class="sr-only"
                      @change="handleFileChange"
                    />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>

                <p class="text-xs text-gray-500">PNG, JPG, GIF, WEBP up to 2MB</p>

                <p v-if="fileName" class="text-sm font-medium text-pink-600 mt-2">
                  Selected: {{ fileName }}
                </p>

                <img
                  v-if="imagePreview"
                  :src="imagePreview"
                  alt="Category preview"
                  class="mt-4 max-h-48 mx-auto rounded shadow object-contain"
                />
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center items-center gap-2 py-4 px-6 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              {{ isLoading ? 'Creating Category...' : 'Create Category' }}
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
import { categoryService } from '@/services/categorie'   // ← make sure path & name correct
import { authService } from '@/services/auth'

const router = useRouter()

const isLoading = ref(false)
const fileName = ref('')
const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)

const form = ref({
  name: '',
  slug: '',
  description: '',
  // removed is_active from form → handled as '1' by default
})

onMounted(() => {
  if (!authService.isAuthenticated() || !authService.isAdmin()) {
    alert('Admin access required')
    router.push({ name: 'Home' })
  }
})

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) {
    handleFile(input.files[0])
  }
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  if (e.dataTransfer?.files?.[0]) {
    handleFile(e.dataTransfer.files[0])
  }
}

const handleFile = (file: File) => {
  if (file.size > 2 * 1024 * 1024) {
    alert('File is too large. Maximum size is 2MB.')
    return
  }

  if (!file.type.startsWith('image/')) {
    alert('Please select an image file (jpg, png, gif, webp).')
    return
  }

  selectedFile.value = file
  fileName.value = file.name

  const reader = new FileReader()
  reader.onload = (ev) => {
    imagePreview.value = ev.target?.result as string
  }
  reader.readAsDataURL(file)
}

const handleSubmit = async () => {
  if (!form.value.name.trim()) {
    alert('Category name is required')
    return
  }

  isLoading.value = true

  try {
    const formData = new FormData()

    formData.append('name', form.value.name.trim())

    if (form.value.slug.trim()) {
      formData.append('slug', form.value.slug.trim())
    }

    if (form.value.description.trim()) {
      formData.append('description', form.value.description.trim())
    }

    // Most common default in Laravel: active = 1
    formData.append('is_active', '1')

    if (selectedFile.value) {
      formData.append('image', selectedFile.value)
    }

    await categoryService.createCategory(formData)

    alert('Category created successfully!')

    // Reset
    form.value = { name: '', slug: '', description: '' }
    selectedFile.value = null
    fileName.value = ''
    imagePreview.value = null
  } catch (error: any) {
    console.error('Category creation failed:', error)

    let message = 'Failed to create category. Please try again.'

    if (error.response?.data?.errors) {
      // Show first validation error
      const errors = error.response.data.errors
      const firstKey = Object.keys(errors)[0]
      message = errors[firstKey][0] || message
    } else if (error.response?.data?.message) {
      message = error.response.data.message
    }

    alert(message)
  } finally {
    isLoading.value = false
  }
}
</script>