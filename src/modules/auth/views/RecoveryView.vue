<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/core/auth/supabase'
import { KeyRound, Mail, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-vue-next'

const email = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

async function handleRecovery() {
  loading.value = true
  error.value = null
  success.value = false

  try {
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: window.location.origin + '/auth/reset-password',
    })

    if (resetError) throw resetError
    
    success.value = true
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao enviar e-mail de recuperação.'
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

    <h2 class="font-serif text-2xl font-bold text-slate-900 mb-2">Recuperar senha</h2>
    <p class="text-slate-500 text-sm mb-8">Enviaremos instruções para o seu e-mail</p>

    <div v-if="success" class="space-y-8 text-center animate-fade-in py-4">
      <div class="flex justify-center">
        <div class="bg-blue-50 p-4 rounded-2xl ring-1 ring-blue-100">
          <CheckCircle2 class="w-12 h-12 text-blue-500" />
        </div>
      </div>
      <div class="space-y-3">
        <h3 class="font-serif text-xl font-bold text-slate-900">Email Enviado!</h3>
        <p class="text-slate-500 text-sm leading-relaxed">
          Se o e-mail <br><strong class="text-slate-900">{{ email }}</strong> estiver cadastrado,
          <br>você receberá um link de recuperação em instantes.
        </p>
      </div>
      <router-link :to="{ name: 'login' }" class="block w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-slate-900/10">
        Voltar para Login
      </router-link>
    </div>

    <form v-else class="space-y-5" @submit.prevent="handleRecovery">
      <div v-if="error" class="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl flex items-start gap-3 text-sm animate-shake">
        <AlertCircle class="w-5 h-5 shrink-0" />
        <span class="font-medium">{{ error }}</span>
      </div>

      <div class="space-y-1.5">
        <label class="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">E-mail de Cadastro</label>
        <div class="relative group">
          <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            v-model="email"
            type="email"
            required
            placeholder="seu@email.com"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-hidden font-medium"
          />
        </div>
      </div>

      <div class="pt-2">
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/10 active:scale-[0.98]"
        >
          <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
          <KeyRound v-else class="w-5 h-5" />
          <span>{{ loading ? 'Enviando...' : 'Recuperar Senha' }}</span>
        </button>
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
