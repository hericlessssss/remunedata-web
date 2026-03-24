import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SubscriptionStatus } from '../services/subscription.service'
import { SubscriptionService } from '../services/subscription.service'

export const useSubscriptionStore = defineStore('subscription', () => {
  const status = ref<SubscriptionStatus | null>(null)
  const isLoading = ref(false)

  const isActive = computed(() => status.value?.status === 'active')
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
    currentPlan,
    expiresAt,
    fetchStatus,
    clearStatus
  }
})
