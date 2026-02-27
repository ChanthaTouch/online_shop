// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const DefaultLayout = () => import('@/components/layout/DefaultLayout.vue')
const AdminLayout   = () => import('@/components/layout/AdminLayout.vue')

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '',          name: 'Home',        component: () => import('@/views/Home.vue') },
      { path: 'products',   name: 'Products',   component: () => import('@/views/Products.vue') },
      { path: 'products/:slug', name: 'ProductDetail', component: () => import('@/views/ProductDetail.vue'), props: true },
      { path: 'discount',   name: 'Discount',   component: () => import('@/views/Discount.vue') },
      { path: 'cart',       name: 'Cart',       component: () => import('@/views/Cart.vue') },
      { path: 'checkout',   name: 'Checkout',   component: () => import('@/views/Checkout.vue') },
      { path: 'profile',    name: 'Profile',    component: () => import('@/views/Profile.vue') },
      { path: 'orders',     name: 'Orders',     component: () => import('@/views/Orders.vue') },
    ]
  },

  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      { path: '',                        name: 'AdminDashboard',      component: () => import('@/views/Admin/ProductUpload.vue') },
      { path: 'products',                name: 'ProductManagement',   component: () => import('@/views/Admin/ProductManagement.vue') },
      { path: 'products/:slug/edit',     name: 'ProductEdit',         component: () => import('@/views/Admin/ProductEdit.vue'),     props: true },
      { path: 'categories/create',       name: 'CategoryCreate',      component: () => import('@/views/Admin/CategoryCreate.vue') },
      { path: 'discounts',               name: 'DiscountCreate',      component: () => import('@/views/Admin/DiscountCreate.vue') },
    ]
  },

  { path: '/login',    name: 'Login',    component: () => import('@/views/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('@/views/Register.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token
  const userRole = localStorage.getItem('userRole') || 'customer'

  if (isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    next({ name: 'Home' })
    return
  }

  const protectedRoutes = ['Cart', 'Checkout', 'Profile', 'Orders']
  if (!isAuthenticated && protectedRoutes.includes(String(to.name))) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  if (to.matched.some(r => r.meta.requiresAdmin) && userRole !== 'admin') {
    alert('Access denied: Admin only')
    next({ name: 'Home' })
    return
  }

  next()
})

export default router