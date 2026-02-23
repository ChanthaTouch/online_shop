<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { productService } from '@/services/products'

const route = useRoute()
const product = ref<any>(null)
const selectedImage = ref<string>('/images/placeholder.jpg')
const loading = ref(true)

onMounted(async () => {
  try {
    const slug = route.params.slug as string
    const data = await productService.getProductBySlug(slug)
    product.value = data
    
    // Use the normalized path from the service
    if (data.all_images && data.all_images.length > 0) {
      selectedImage.value = data.all_images[0]
    } else {
      selectedImage.value = data.display_image || '/images/placeholder.jpg'
    }
  } catch (error) {
    console.error('Product failed to load:', error)
  } finally {
    loading.value = false
  }
})

const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).src = '/images/placeholder.jpg'
}
</script>

<template>
  <img 
    v-if="!loading"
    :src="selectedImage" 
    @error="handleImageError"
    class="w-full h-full object-cover transition-transform duration-700"
  />

  <div v-if="product?.all_images?.length > 1" class="flex gap-4 mt-6">
    <button 
      v-for="(img, idx) in product.all_images" 
      :key="idx"
      @click="selectedImage = img"
      class="w-20 h-20 rounded-xl overflow-hidden border-2"
      :class="selectedImage === img ? 'border-amber-800' : 'border-transparent'"
    >
      <img :src="img" @error="handleImageError" class="w-full h-full object-cover" />
    </button>
  </div>
</template>