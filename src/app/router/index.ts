import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/modules/dashboard/views/DashboardView.vue'),
    },
    {
      path: '/remuneration',
      name: 'remuneration',
      component: () => import('@/modules/remuneration/views/RemunerationView.vue'),
    },
    {
      path: '/remuneration/:id',
      name: 'remuneration-detail',
      component: () => import('@/modules/remuneration/views/RemunerationDetailView.vue'),
    },
    {
      path: '/executions',
      name: 'executions',
      component: () => import('@/modules/executions/views/ExecutionsView.vue'),
    },
  ],
})

export default router
