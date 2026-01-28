import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const routes = [
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
      { path: 'admin', name: 'Admin', component: () => import('@/views/Admin/ProductUpload.vue') }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token
  const userRole = localStorage.getItem('userRole') || ''

  // If user is already logged in, don't allow access to login/register
  if (isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    next({ name: 'Home' })
    return
  }

  // Protect authenticated routes
  if (!isAuthenticated && ['Profile', 'Orders', 'Checkout'].includes(to.name as string)) {
    next({ name: 'Login' })
    return
  }

  // Protect admin route
  if (to.name === 'Admin' && userRole !== 'admin') {
    next({ name: 'Home' }) // or next({ name: 'Login' })
    return
  }

  next()
})

export default router