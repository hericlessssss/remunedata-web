<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/core/auth/supabase'
import { UserPlus, Mail, Lock, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-vue-next'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

async function handleSignup() {
  loading.value = true
  error.value = null
  success.value = false

  try {
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: window.location.origin + '/auth/login',
      },
    })

    if (signUpError) throw signUpError
    
    success.value = true
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao criar conta. Tente novamente.'
    error.value = message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <router-link :to="{ name: 'login' }" class="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold uppercase tracking-wider mb-6 group">
      <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      Voltar para o login
    </router-link>

    <h2 class="font-serif text-2xl font-bold text-slate-900 mb-2">Crie sua conta</h2>
    <p class="text-slate-500 text-sm mb-8">Preencha os dados para solicitar acesso</p>

    <div v-if="success" class="space-y-8 text-center animate-fade-in py-4">
      <div class="flex justify-center">
        <div class="bg-emerald-50 p-4 rounded-2xl ring-1 ring-emerald-100">
          <CheckCircle2 class="w-12 h-12 text-emerald-500" />
        </div>
      </div>
      <div class="space-y-3">
        <h3 class="font-serif text-xl font-bold text-slate-900">Solicitação Enviada!</h3>
        <p class="text-slate-500 text-sm leading-relaxed">
          Enviamos um link de confirmação para <br><strong class="text-slate-900">{{ email }}</strong>.
          <br>Verifique seu e-mail para ativar sua conta.
        </p>
      </div>
      <router-link :to="{ name: 'login' }" class="block w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-slate-900/10">
        Ir para Login
      </router-link>
    </div>

    <form v-else class="space-y-5" @submit.prevent="handleSignup">
      <div v-if="error" class="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl flex items-start gap-3 text-sm animate-shake">
        <AlertCircle class="w-5 h-5 shrink-0" />
        <span class="font-medium">{{ error }}</span>
      </div>

      <div class="space-y-1.5">
        <label class="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">E-mail Corporativo</label>
        <div class="relative group">
          <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <input
            v-model="email"
            type="email"
            required
            placeholder="seu@email.com"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-hidden font-medium"
          />
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Senha de Acesso</label>
        <div class="relative group">
          <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <input
            v-model="password"
            type="password"
            required
            placeholder="Mínimo 6 caracteres"
            minlength="6"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-hidden font-medium"
          />
        </div>
      </div>

      <div class="pt-2">
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/10 active:scale-[0.98]"
        >
          <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
          <UserPlus v-else class="w-5 h-5" />
          <span>{{ loading ? 'Processando...' : 'Criar minha conta' }}</span>
        </button>
      </div>

      <div class="text-center pt-4">
        <p class="text-sm text-slate-500 font-medium">
          Já possui cadastro?
          <router-link :to="{ name: 'login' }" class="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">
            Fazer login
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
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
