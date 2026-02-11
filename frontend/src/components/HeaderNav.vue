<template>
  <header class="bg-white shadow-sm">
    <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
      <router-link to="/" class="text-xl font-bold">DeliveryApp</router-link>
      <nav class="flex items-center gap-4">
        <router-link to="/restaurants" class="text-sm">Restaurants</router-link>
        <router-link to="/orders" class="text-sm">Orders</router-link>
        <router-link to="/cart" class="text-sm">Cart</router-link>
        <router-link to="/profile" class="text-sm">Profile</router-link>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
</script>

<style scoped>
header { background: #fff; }
</style>
