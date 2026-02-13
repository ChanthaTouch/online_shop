// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const routes = [
  // ── Main Public Site (uses DefaultLayout with Header + Footer) ─────────────────
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',                      // ← Root URL → Home page (this is what you want first!)
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/views/Products.vue'),
      },
      {
        path: 'products/:slug',
        name: 'ProductDetail',
        component: () => import('@/views/ProductDetail.vue'),
      },
      {
        path: 'discount',
        name: 'Discount',
        component: () => import('@/views/Discount.vue'),
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/views/Cart.vue'),
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: () => import('@/views/Checkout.vue'),
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue'),
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/Orders.vue'),
      },
    ],
  },

  // ── Admin Section (protected by role) ───────────────────────────────────────
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/Admin/ProductUpload.vue'),
      },
      {
        path: '/products/:slug/edit',
        name: 'ProductEdit',
        component: () => import('@/views/Admin/ProductEdit.vue'),
        props: true
      },
      {
        path: 'categories/create',
        name: 'CategoryCreate',
        component: () => import('@/views/Admin/CategoryCreate.vue'),
      },
      {
        path: 'discounts',
        name: 'DiscountCreate',
        component: () => import('@/views/Admin/DiscountCreate.vue'),
      },
    ],
  },

  // ── Authentication Pages (no layout – full-screen pink background) ─────────────
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top on navigation
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

// ── Global Navigation Guards ───────────────────────────────────────────────────
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token
  const userRole = localStorage.getItem('userRole') || ''

  // 1. If already logged in → don't allow access to login/register
  if (isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    next({ name: 'Home' })
    return
  }

  // 2. Protect pages that require login
  const protectedRoutes = ['Cart', 'Checkout', 'Profile', 'Orders']
  if (!isAuthenticated && protectedRoutes.includes(to.name as string)) {
    // Save where they were going so we can redirect back after login
    next({
      name: 'Login',
      query: { redirect: to.fullPath },
    })
    return
  }

  // 3. Protect all /admin routes
  if (to.matched.some(record => record.meta.requiresAdmin) && userRole !== 'admin') {
    alert('Access denied: Admin only')
    next({ name: 'Home' })
    return
  }

  // Everything else → allow
  next()
})

export default router