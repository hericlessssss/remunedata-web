import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/core/auth/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(true)
  const rememberMe = ref(window.localStorage.getItem('auth_remember_me') === 'true')
  const savedEmail = ref(window.localStorage.getItem('auth_saved_email') || '')

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

  function setRememberMe(value: boolean, email?: string) {
    rememberMe.value = value
    window.localStorage.setItem('auth_remember_me', String(value))
    if (value && email) {
      savedEmail.value = email
      window.localStorage.setItem('auth_saved_email', email)
    } else if (!value) {
      savedEmail.value = ''
      window.localStorage.removeItem('auth_saved_email')
    }
  }

  return {
    user,
    session,
    loading,
    isAuthenticated,
    accessToken,
    initialize,
    signOut,
    rememberMe,
    savedEmail,
    setRememberMe,
  }
})
