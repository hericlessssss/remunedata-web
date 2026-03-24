<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/core/auth/supabase'
import { LogIn, Mail, Lock, Loader2, AlertCircle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function handleLogin() {
  loading.value = true
  error.value = null

  try {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (signInError) throw signInError

    let redirectPath = route.query.redirect as string
    
    // Se não houver redirect na URL, tenta recuperar do localStorage (vido de um signup recente)
    if (!redirectPath) {
      redirectPath = window.localStorage.getItem('auth_redirect') || ''
      window.localStorage.removeItem('auth_redirect')
    }

    if (redirectPath && redirectPath !== 'undefined') {
      router.push(redirectPath)
    } else {
      router.push({ name: 'dashboard' })
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao realizar login. Tente novamente.'
    error.value = message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h2 class="font-serif text-2xl font-bold text-slate-900 mb-2">Bem-vindo de volta</h2>
    <p class="text-slate-500 text-sm mb-8">Acesse sua conta para continuar</p>

    <form class="space-y-5" @submit.prevent="handleLogin">
      <div v-if="error" class="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl flex items-start gap-3 text-sm animate-shake">
        <AlertCircle class="w-5 h-5 shrink-0" />
        <span class="font-medium">{{ error }}</span>
      </div>

      <div class="space-y-1.5">
        <label class="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">E-mail</label>
        <div class="relative group">
          <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
          <input
            v-model="email"
            type="email"
            required
            placeholder="seu@email.com"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-hidden font-medium"
          />
        </div>
      </div>

      <div class="space-y-1.5">
        <div class="flex items-center justify-between ml-1">
          <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Senha</label>
          <router-link :to="{ name: 'recovery' }" class="text-xs text-slate-900 hover:opacity-70 font-black uppercase tracking-wider transition-all">
            Esqueceu a senha?
          </router-link>
        </div>
        <div class="relative group">
          <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-hidden font-medium"
          />
        </div>
      </div>

      <div class="pt-2">
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98]"
        >
          <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
          <LogIn v-else class="w-5 h-5" />
          <span>{{ loading ? 'Autenticando...' : 'Acessar Sistema' }}</span>
        </button>
      </div>

      <div class="text-center pt-4">
        <p class="text-sm text-slate-500 font-medium">
          Ainda não tem acesso?
          <router-link :to="{ name: 'signup' }" class="text-slate-900 hover:opacity-70 font-black uppercase tracking-wider transition-all ml-1">
            Solicitar Cadastro
          </router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
.animate-shake {
  animation: shake 0.2s ease-in-out 0s 2;
}
</style>
