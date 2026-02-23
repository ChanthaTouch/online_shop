// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

// Layouts (we will create them below)
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const routes = [
  // ── PUBLIC SITE (with header + footer) ─────────────────────────────
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'Home', component: () => import('@/views/Home.vue') },
      { path: 'products', name: 'Products', component: () => import('@/views/Products.vue') },
      { path: 'products/:slug', name: 'ProductDetail', component: () => import('@/views/ProductDetail.vue') },
      { path: 'discount', name: 'Discount', component: () => import('@/views/Discount.vue') },
      { path: 'cart', name: 'Cart', component: () => import('@/views/Cart.vue') },
      { path: 'checkout', name: 'Checkout', component: () => import('@/views/Checkout.vue') },
      { path: 'profile', name: 'Profile', component: () => import('@/views/Profile.vue') },
      { path: 'orders', name: 'Orders', component: () => import('@/views/Orders.vue') },
    ],
  },

  // ── ADMIN SECTION (protected) ──────────────────────────────────────
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      { 
        path: '', 
        name: 'AdminDashboard', 
        component: () => import('@/views/Admin/ProductUpload.vue') 
      },
      { 
        path: 'products/:slug/edit',        // ← FIXED: no leading slash
        name: 'ProductEdit', 
        component: () => import('@/views/Admin/ProductEdit.vue'),
        props: true 
      },
      { 
        path: 'categories/create', 
        name: 'CategoryCreate', 
        component: () => import('@/views/Admin/CategoryCreate.vue') 
      },
      { 
        path: 'discounts', 
        name: 'DiscountCreate', 
        component: () => import('@/views/Admin/DiscountCreate.vue') 
      },
    ],
  },

  // ── AUTH PAGES (full screen, no layout) ────────────────────────────
  { path: '/login', name: 'Login', component: () => import('@/views/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('@/views/Register.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// ── Navigation Guards ─────────────────────────────────────────────────
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token
  const userRole = localStorage.getItem('userRole') || 'customer'

  // Already logged in → block login/register
  if (isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    next({ name: 'Home' })
    return
  }

  // Protected user routes
  const protectedRoutes = ['Cart', 'Checkout', 'Profile', 'Orders']
  if (!isAuthenticated && protectedRoutes.includes(to.name as string)) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // Admin protection
  if (to.matched.some(record => record.meta.requiresAdmin) && userRole !== 'admin') {
    alert('Access denied: Admin only')
    next({ name: 'Home' })
    return
  }

  next()
})

export default router