import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SubscriptionStatus } from '../services/subscription.service'
import { SubscriptionService } from '../services/subscription.service'

import { ENV } from '@/core/config/env'
import { useAuthStore } from '@/core/auth/authStore'

export const useSubscriptionStore = defineStore('subscription', () => {
  const authStore = useAuthStore()
  const status = ref<SubscriptionStatus | null>(null)
  const isLoading = ref(false)

  const isActive = computed(() => status.value?.status === 'active')
  
  // Novo: Verifica se o e-mail do usuário está na lista branca admin
  const isAdmin = computed(() => {
    const email = authStore.user?.email
    if (!email) return false
    return ENV.ADMIN_EMAILS.includes(email)
  })

  // Novo: Usuário tem acesso total se estiver ativo OU se for admin
  const isPremium = computed(() => isActive.value || isAdmin.value)

  const currentPlan = computed(() => status.value?.plan)
  const expiresAt = computed(() => status.value?.expires_at)

  async function fetchStatus() {
    isLoading.value = true
    try {
      status.value = await SubscriptionService.getMySubscription()
    } catch {
      status.value = { status: 'inactive', plan: null, expires_at: null }
    } finally {
      isLoading.value = false
    }
  }

  function clearStatus() {
    status.value = null
  }

  return {
    status,
    isLoading,
    isActive,
    isAdmin,
    isPremium,
    currentPlan,
    expiresAt,
    fetchStatus,
    clearStatus
  }
})
