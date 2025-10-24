import { createRouter, createWebHistory } from 'vue-router'
import { currentUser, isOnboarded } from '../services/supabase'

const routes = [
  { path: '/login', name: 'Login', component: () => import('../views/AuthLogin.vue'), meta: { hideTabbar: true } },
  { path: '/register', name: 'Register', component: () => import('../views/AuthRegister.vue'), meta: { hideTabbar: true } },
  { path: '/onboarding', name: 'Onboarding', component: () => import('../views/Onboarding.vue'), meta: { hideTabbar: true } },
  { path: '/', name: 'Dashboard', component: () => import('../views/Dashboard.vue') },
  { path: '/watchlist', name: 'Watchlist', component: () => import('../views/Watchlist.vue') },
  { path: '/account', name: 'Account', component: () => import('../views/Account.vue') },
  { path: '/stock/:symbol', name: 'StockDetail', component: () => import('../views/StockDetail.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const publicPaths = ['/login', '/register']
  if (publicPaths.includes(to.path)) return true
  const user = await currentUser()
  if (!user) return { path: '/login' }
  if (to.path !== '/onboarding') {
    try {
      const onboarded = await isOnboarded()
      if (!onboarded) return { path: '/onboarding' }
    } catch {}
  } else {
    try {
      const onboarded = await isOnboarded()
      if (onboarded) return { path: '/' }
    } catch {}
  }
  return true
})

export default router