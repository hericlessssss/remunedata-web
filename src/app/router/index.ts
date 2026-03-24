import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/modules/home/views/LandingView.vue'),
    },
    {
      path: '/app',
      component: () => import('@/app/layouts/MainLayout.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('@/modules/dashboard/views/DashboardView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/remuneration',
          name: 'remuneration',
          component: () => import('@/modules/remuneration/views/RemunerationView.vue'),
          meta: { requiresAuth: true, requiresSubscription: true },
        },
        {
          path: '/remuneration/:id',
          name: 'remuneration-detail',
          component: () => import('@/modules/remuneration/views/RemunerationDetailView.vue'),
          meta: { requiresAuth: true, requiresSubscription: true },
        },
        {
          path: '/executions',
          name: 'executions',
          component: () => import('@/modules/executions/views/ExecutionsView.vue'),
          meta: { requiresAuth: true, requiresSubscription: true },
        },
        {
          path: '/subscriptions/plans',
          name: 'subscriptions-plans',
          component: () => import('@/modules/subscriptions/views/PlansView.vue'),
        },
      ],
    },
    {
      path: '/auth',
      component: () => import('@/modules/auth/layouts/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/modules/auth/views/LoginView.vue'),
        },
        {
          path: 'signup',
          name: 'signup',
          component: () => import('@/modules/auth/views/SignupView.vue'),
        },
        {
          path: 'recovery',
          name: 'recovery',
          component: () => import('@/modules/auth/views/RecoveryView.vue'),
        },
      ],
    },
    // Rota 404 - Redireciona para Home
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home' }
    }
  ],
})

import { useAuthStore } from '@/core/auth/authStore'
import { useSubscriptionStore } from '@/modules/subscriptions/store/subscriptionStore'

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  const subStore = useSubscriptionStore()

  // Se a rota exige auth e o usuário não está logado
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ 
      name: 'login', 
      query: { redirect: to.fullPath } 
    })
  }

  // Se o usuário está logado, garantimos que temos o status da assinatura
  if (authStore.isAuthenticated && !subStore.status) {
    await subStore.fetchStatus()
  }

  // Se a rota exige assinatura ativa e usuário não tem
  if (to.meta.requiresSubscription && !subStore.isActive) {
    return next({ 
      name: 'subscriptions-plans',
      query: { redirect: 'forbidden' }
    })
  }

  // Se o usuário está logado e tenta acessar login/signup ou a landing page
  if (authStore.isAuthenticated && (to.path.startsWith('/auth') || to.path === '/')) {
    return next({ name: 'dashboard' })
  }

  next()
})

router.onError((error, to) => {
  const errors = [
    'Failed to fetch dynamically imported module',
    'Importing a module script failed',
    'error loading dynamically imported module'
  ]

  if (errors.some(msg => error.message?.includes(msg))) {
    // eslint-disable-next-line no-console
    console.warn('Chunk loading failed. Force refreshing page...')
    window.location.href = to.fullPath
  }
})

export default router
