import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Restaurants from '../views/Restaurants.vue'
import Menu from '../views/Menu.vue'
import Cart from '../views/Cart.vue'
import Checkout from '../views/Checkout.vue'
import OrderTrack from '../views/OrderTrack.vue'
import Login from '../views/Login.vue'
import Orders from '../views/Orders.vue'
import Profile from '../views/Profile.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/restaurants', name: 'Restaurants', component: Restaurants },
  { path: '/restaurants/:id', name: 'Menu', component: Menu, props: true },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/checkout', name: 'Checkout', component: Checkout },
  { path: '/track/:orderId', name: 'OrderTrack', component: OrderTrack, props: true },
  { path: '/login', name: 'Login', component: Login },
  { path: '/orders', name: 'Orders', component: Orders },
  { path: '/profile', name: 'Profile', component: Profile },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } },
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  const protectedRoutes = ['Cart', 'Checkout', 'Orders', 'Profile']
  if (protectedRoutes.includes(to.name as string) && !token) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  next()
})

export default router