import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/app/layouts/MainLayout.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/modules/dashboard/views/DashboardView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'remuneration',
          name: 'remuneration',
          component: () => import('@/modules/remuneration/views/RemunerationView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'remuneration/:id',
          name: 'remuneration-detail',
          component: () => import('@/modules/remuneration/views/RemunerationDetailView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'executions',
          name: 'executions',
          component: () => import('@/modules/executions/views/ExecutionsView.vue'),
          meta: { requiresAuth: true },
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
  ],
})

import { useAuthStore } from '@/core/auth/authStore'

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // Se a rota exige auth e o usuário não está logado
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login' })
  }

  // Se o usuário está logado e tenta acessar login/signup
  if (to.path.startsWith('/auth') && authStore.isAuthenticated) {
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
