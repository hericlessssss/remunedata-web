<script setup lang="ts">
import { ref, computed } from 'vue'
import { ShieldCheck, User, CreditCard, Phone } from 'lucide-vue-next'
import BaseButton from '@/shared/ui/BaseButton.vue'

defineProps<{
  planName: string
  loading?: boolean
}>()

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  name: '',
  tax_id: '',
  cellphone: '',
})

// Validação simples de CPF (apenas formato/tamanho para UX rápida)
const isTaxIdValid = computed(() => {
  const clean = form.value.tax_id.replace(/\D/g, '')
  return clean.length === 11
})

// Validação simples de Celular
const isPhoneValid = computed(() => {
  const clean = form.value.cellphone.replace(/\D/g, '')
  return clean.length >= 10 && clean.length <= 11
})

const isFormValid = computed(() => {
  return form.value.name.length > 3 && isTaxIdValid.value && isPhoneValid.value
})

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', { ...form.value })
  }
}
</script>

<template>
  <div class="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-10 max-w-lg w-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/20 animate-in fade-in zoom-in duration-500 relative overflow-hidden">
    <!-- Background Sparkle -->
    <div class="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/5 blur-[80px] rounded-full"></div>
    
    <div class="relative z-10 flex items-center gap-4 mb-10">
      <div class="p-3 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-900/10 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
        <ShieldCheck class="w-6 h-6" />
      </div>
      <div>
        <h3 class="text-2xl font-black text-slate-900 leading-tight tracking-tight">Dados de Faturamento</h3>
        <p class="text-sm text-slate-500 font-medium">Plano: <span class="text-slate-900 font-bold px-2 py-0.5 bg-slate-100 rounded-lg">{{ planName }}</span></p>
      </div>
    </div>

    <form class="relative z-10 space-y-8" @submit.prevent="handleSubmit">
      <!-- Nome -->
      <div class="space-y-2">
        <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nome Completo</label>
        <div class="relative group">
          <User class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
          <input 
            v-model="form.name"
            type="text" 
            placeholder="Nome impresso no cartão"
            class="w-full pl-11 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm focus:ring-8 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all font-bold placeholder:font-medium"
            :class="{'border-red-200 bg-red-50/10': form.name && form.name.length < 3}"
            required
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- CPF -->
        <div class="space-y-2">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">CPF</label>
          <div class="relative group">
            <CreditCard class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
            <input 
              v-model="form.tax_id"
              v-maska="'###.###.###-##'"
              type="text" 
              placeholder="000.000.000-00"
              class="w-full pl-11 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm focus:ring-8 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all font-bold placeholder:font-medium"
              :class="{'border-red-200 bg-red-50/10': form.tax_id && !isTaxIdValid}"
              required
            />
          </div>
        </div>

        <!-- Celular -->
        <div class="space-y-2">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">WhatsApp</label>
          <div class="relative group">
            <Phone class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
            <input 
              v-model="form.cellphone"
              v-maska="'(##) #####-####'"
              type="text" 
              placeholder="(00) 00000-0000"
              class="w-full pl-11 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm focus:ring-8 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all font-bold placeholder:font-medium"
              :class="{'border-red-200 bg-red-50/10': form.cellphone && !isPhoneValid}"
              required
            />
          </div>
        </div>
      </div>

      <div class="pt-6 flex flex-col gap-4">
        <BaseButton
          variant="gradient"
          type="submit"
          class="w-full py-8 text-lg font-black rounded-[1.5rem] transition-all active:scale-[0.98] shadow-2xl group/btn overflow-hidden relative"
          :disabled="!isFormValid || loading"
          :loading="loading"
        >
          <span class="relative z-10 flex items-center gap-2">
            Ir para o Pagamento Seguro
            <svg class="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
          <div class="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
        </BaseButton>

        <button 
          type="button"
          class="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all py-3 flex items-center justify-center gap-2"
          @click="$emit('cancel')"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Escolher outro plano
        </button>
      </div>

      <p class="text-[10px] text-center text-slate-400 px-6 leading-relaxed font-bold uppercase tracking-tighter opacity-70">
        Checkout 100% seguro processado via <span class="text-slate-600 font-black">AbacatePay</span>. <br/>
        Dados criptografados de ponta a ponta.
      </p>
    </form>
  </div>
</template>
