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
  <div class="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-300">
    <div class="flex items-center gap-3 mb-6">
      <div class="p-2 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/10">
        <ShieldCheck class="w-6 h-6" />
      </div>
      <div>
        <h3 class="text-xl font-bold text-slate-900 leading-tight">Dados de Faturamento</h3>
        <p class="text-sm text-slate-500">Plano selecionado: <span class="font-black text-slate-900 underline decoration-slate-200 underline-offset-4">{{ planName }}</span></p>
      </div>
    </div>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <!-- Nome -->
      <div class="space-y-1">
        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
        <div class="relative">
          <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            v-model="form.name"
            type="text" 
            placeholder="Seu nome como no cartão"
            class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all font-medium"
            required
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- CPF -->
        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">CPF</label>
          <div class="relative">
            <CreditCard class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              v-model="form.tax_id"
              v-maska="'###.###.###-##'"
              type="text" 
              placeholder="000.000.000-00"
              class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all font-medium"
              required
            />
          </div>
        </div>

        <!-- Celular -->
        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp</label>
          <div class="relative">
            <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              v-model="form.cellphone"
              v-maska="'(##) #####-####'"
              type="text" 
              placeholder="(00) 00000-0000"
              class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all font-medium"
              required
            />
          </div>
        </div>
      </div>

      <div class="pt-4 flex flex-col gap-3">
        <BaseButton
          type="submit"
          class="w-full py-6 text-base font-bold rounded-2xl bg-slate-900 hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/20 border-none transition-all active:scale-95 text-white"
          :disabled="!isFormValid || loading"
          :loading="loading"
        >
          Ir para o Pagamento Seguro
        </BaseButton>
        <button 
          type="button"
          class="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors py-2"
          @click="$emit('cancel')"
        >
          Voltar para Escolha de Planos
        </button>
      </div>

      <p class="text-[10px] text-center text-slate-400 px-4 leading-relaxed">
        Seus dados estão seguros e criptografados. O pagamento é processado pela AbacatePay.
      </p>
    </form>
  </div>
</template>
