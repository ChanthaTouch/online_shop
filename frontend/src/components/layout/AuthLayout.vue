<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 to-white">
    <div class="container mx-auto px-4">
      <div class="py-8 text-center mb-8">
        <router-link to="/" class="inline-flex items-center gap-2">
          <div class="text-3xl font-black text-pink-500">NAK NAK</div>
          <div class="text-sm font-bold text-gray-700">STORE</div>
        </router-link>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
