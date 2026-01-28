import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'home', component: () => import('@/views/Home.vue') },
      { path: 'products', name: 'products', component: () => import('@/views/Products.vue') },
      { path: 'product/:id', name: 'product-detail', component: () => import('@/views/ProductDetail.vue') },
      { path: 'discount', name: 'discount', component: () => import('@/views/Discount.vue') },
      { path: 'cart', name: 'cart', component: () => import('@/views/Cart.vue') },
    ]
  },
  {
    path: '/auth',
    component: () => import('@/components/layout/AuthLayout.vue'),
    children: [
      { path: 'login', name: 'login', component: () => import('@/views/Login.vue') },
      { path: 'register', name: 'register', component: () => import('@/views/Register.vue') },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router