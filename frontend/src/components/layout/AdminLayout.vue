<!-- src/components/layout/AdminLayout.vue -->
<template>
  <div class="flex flex-col min-h-screen bg-[#faf9f6] text-[#2c1810]">
    <!-- Public Header (kept for brand consistency) -->
    <Header />

    <!-- Main Admin Area: Sidebar + Content -->
    <div class="flex flex-1">
      <!-- Sidebar -->
      <aside class="w-80 bg-[#1a120b] shadow-2xl relative z-30">
        <div class="p-10">
          <h2 class="font-serif text-4xl text-white tracking-widest">Admin Panel</h2>
          <p class="text-amber-500/70 text-xs font-black uppercase tracking-[0.4em] mt-2">Curated Management</p>
        </div>

        <nav class="mt-8">
          <ul class="space-y-2">
            <li>
              <router-link
                to="/admin"
                exact
                class="group flex items-center px-10 py-5 text-white/80 hover:text-white hover:bg-white/5 transition-all duration-300"
                active-class="text-amber-500 bg-white/10 border-l-4 border-amber-500"
              >
                <svg class="w-5 h-5 mr-4 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span class="font-medium tracking-wide">Add Product</span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/admin/products"
                class="group flex items-center px-10 py-5 text-white/80 hover:text-white hover:bg-white/5 transition-all duration-300"
                active-class="text-amber-500 bg-white/10 border-l-4 border-amber-500"
              >
                <svg class="w-5 h-5 mr-4 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10m-4-4l-8-4m16 0l-8 4" />
                </svg>
                <span class="font-medium tracking-wide">Manage Products</span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/admin/categories/create"
                class="group flex items-center px-10 py-5 text-white/80 hover:text-white hover:bg-white/5 transition-all duration-300"
                active-class="text-amber-500 bg-white/10 border-l-4 border-amber-500"
              >
                <svg class="w-5 h-5 mr-4 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2" />
                </svg>
                <span class="font-medium tracking-wide">Create Category</span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/admin/discounts"
                class="group flex items-center px-10 py-5 text-white/80 hover:text-white hover:bg-white/5 transition-all duration-300"
                active-class="text-amber-500 bg-white/10 border-l-4 border-amber-500"
              >
                <svg class="w-5 h-5 mr-4 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-medium tracking-wide">Special Offers</span>
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- Optional subtle pattern overlay -->
        <div class="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="admin-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" stroke-width="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#admin-grid)" />
          </svg>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div class="flex-1 relative">
        <!-- Child views (ProductUpload, CategoryCreate, etc.) render here -->
        <!-- They already have full-page designs with heroes, so no extra padding/background here -->
        <main class="absolute inset-0">
          <router-view />
        </main>
      </div>
    </div>

    <!-- Public Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
</script>