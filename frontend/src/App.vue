<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <HeaderNav />
    <main class="p-4 max-w-4xl mx-auto">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import HeaderNav from './components/HeaderNav.vue'
</script>

<style>
html, body, #app { height: 100%; width: 100%; }
body { font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
</style>
