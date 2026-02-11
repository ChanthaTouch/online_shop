<!-- src/components/layout/AdminLayout.vue -->
<template>
  <div class="flex flex-col min-h-screen">
    <!-- Public Header -->
    <Header />

    <!-- Main Admin Content (Sidebar + Main) -->
    <div class="flex flex-1 bg-gray-100">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-lg">
        <div class="p-6">
          <h2 class="text-2xl font-black text-pink-600">Admin Panel</h2>
        </div>
        <nav class="mt-6">
          <ul>
            <li>
              <router-link
                to="/admin"
                class="block px-6 py-3 hover:bg-pink-50 hover:text-pink-600"
                active-class="bg-pink-50 text-pink-600 border-r-4 border-pink-500"
              >
                Products
              </router-link>
            </li>
            <li>
              <router-link
                to="/admin/categories/create"
                class="block px-6 py-3 hover:bg-pink-50 hover:text-pink-600"
                active-class="bg-pink-50 text-pink-600 border-r-4 border-pink-500"
              >
                Create Category
              </router-link>
            </li>
            <!-- Add more later: Categories list, Orders, Users... -->
          </ul>
        </nav>
      </aside>

      <!-- Main content -->
      <div class="flex-1">

        <main class="p-6">
          <router-view />
        </main>
      </div>
    </div>

    <!-- Public Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue'  // Import your public header
import Footer from '@/components/layout/Footer.vue'  // Import your public footer (create if needed)
</script>