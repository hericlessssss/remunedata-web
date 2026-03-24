import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/core/auth/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(true)

  const isAuthenticated = computed(() => !!user.value)
  const accessToken = computed(() => session.value?.access_token || null)

  async function initialize() {
    loading.value = true
    try {
      const { data } = await supabase.auth.getSession()
      session.value = data.session
      user.value = data.session?.user ?? null

      supabase.auth.onAuthStateChange((_event, _session) => {
        session.value = _session
        user.value = _session?.user ?? null
        loading.value = false
      })
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    const subStore = (await import('@/modules/subscriptions/store/subscriptionStore')).useSubscriptionStore()
    await supabase.auth.signOut()
    user.value = null
    session.value = null
    subStore.clearStatus()
  }

  return {
    user,
    session,
    loading,
    isAuthenticated,
    accessToken,
    initialize,
    signOut,
  }
})
