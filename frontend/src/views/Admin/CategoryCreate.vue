<!-- src/views/admin/CategoryCreate.vue -->
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
        <h1 class="font-serif text-6xl md:text-8xl text-white mb-6">Create Category</h1>
        <div class="w-24 h-[1px] bg-amber-500/50 mx-auto"></div>
        <p class="mt-8 text-white/80 text-lg font-light">Add a new category to organize your collection</p>
      </div>
    </div>

    <div class="container mx-auto px-6 -mt-20 relative z-20 max-w-3xl">
      <!-- Form Card -->
      <div class="bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/50 p-10 md:p-16">
        <form @submit.prevent="handleSubmit" class="space-y-12">
          <!-- Category Name -->
          <div>
            <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-4">
              Category Name <span class="text-red-600">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-8 py-6 bg-[#f5f4f0]/50 border border-stone-200 rounded-3xl focus:ring-4 focus:ring-amber-500/30 outline-none text-lg font-light transition-all"
              placeholder="e.g. Single Origin, Blends, Equipment"
            />
          </div>

          <!-- Slug -->
          <div>
            <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-4">
              Slug (optional)
            </label>
            <input
              v-model="form.slug"
              type="text"
              class="w-full px-8 py-6 bg-[#f5f4f0]/50 border border-stone-200 rounded-3xl focus:ring-4 focus:ring-amber-500/30 outline-none text-lg font-light transition-all"
              placeholder="auto-generated-if-empty (e.g. single-origin)"
            />
            <p class="mt-3 text-sm text-stone-600">
              Used in URLs. Leave empty to auto-generate from name.
            </p>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-4">
              Description (optional)
            </label>
            <textarea
              v-model="form.description"
              rows="5"
              class="w-full px-8 py-6 bg-[#f5f4f0]/50 border border-stone-200 rounded-3xl focus:ring-4 focus:ring-amber-500/30 outline-none text-lg font-light resize-none transition-all"
              placeholder="Short description of this category..."
            ></textarea>
          </div>

          <!-- Image Upload -->
          <div>
            <label class="block text-xs font-black uppercase tracking-[0.3em] text-amber-700 mb-4">
              Category Image (optional)
            </label>
            <div
              class="flex justify-center px-10 pt-12 pb-14 border-2 border-dashed border-stone-300 rounded-3xl hover:border-amber-500 transition-colors bg-[#f5f4f0]/30 cursor-pointer"
              @dragover.prevent
              @drop.prevent="handleDrop"
            >
              <div class="space-y-6 text-center">
                <svg class="mx-auto h-16 w-16 text-stone-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <div class="flex text-lg text-stone-600 justify-center">
                  <label class="relative cursor-pointer rounded-md font-medium text-amber-600 hover:text-amber-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      class="sr-only"
                      @change="handleFileChange"
                    />
                  </label>
                  <p class="pl-2">or drag and drop</p>
                </div>

                <p class="text-xs text-stone-500">PNG, JPG, GIF, WEBP up to 2MB</p>

                <p v-if="fileName" class="text-lg font-serif font-bold text-amber-700 mt-4">
                  Selected: {{ fileName }}
                </p>

                <img
                  v-if="imagePreview"
                  :src="imagePreview"
                  alt="Category preview"
                  class="mt-6 max-h-64 mx-auto rounded-2xl shadow-xl object-cover border border-stone-200"
                />
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-amber-600 text-white py-6 rounded-3xl font-serif text-2xl font-medium hover:bg-amber-700 transition-all disabled:bg-stone-400 flex justify-center items-center gap-4 shadow-xl"
          >
            <span v-if="isLoading" class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></span>
            {{ isLoading ? 'Creating Category...' : 'Create Category' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Script remains unchanged – only visual redesign applied
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