<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { formatCurrency } from '@/core/formatters/currency'
import { computed } from 'vue'

interface Plan {
  slug: string
  name: string
  description: string
  price_brl: number
  duration_days: number
}

const props = defineProps<{
  plan: Plan
  isFeatured?: boolean
  loading?: boolean
}>()

defineEmits(['select'])

const features = computed(() => {
  const common = [
    'Consulta básica de remuneração',
    'Filtros por órgão e cargo',
    'Interface premium B&W',
  ]

  switch (props.plan.slug) {
    case 'essencial':
      return [
        ...common,
        'Histórico dos últimos 12 meses',
      ]
    case 'profissional':
      return [
        'Todos os benefícios do Essencial',
        'Filtros avançados e combinados',
        'Histórico completo (2020-2026)',
        'Gráficos de evolução salarial',
        'Suporte prioritário',
      ]
    case 'corporativo':
      return [
        'Todos os benefícios do Profissional',
        'Exportação de dados (CSV/Excel)',
        'Alertas de novas atualizações',
        'Relatórios consolidados',
        'Suporte por WhatsApp',
      ]
    default:
      return common
  }
})
</script>

<template>
  <div
    class="relative group p-8 rounded-3xl border transition-all duration-500 overflow-hidden h-full flex flex-col"
    :class="[
      isFeatured 
        ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-slate-900/20' 
        : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
    ]"
  >
    <!-- Background Glow for Featured -->
    <div 
      v-if="isFeatured"
      class="absolute -top-24 -right-24 w-64 h-64 bg-slate-800/20 blur-[100px] rounded-full group-hover:bg-slate-800/30 transition-colors"
    ></div>

    <div class="relative z-10 flex flex-col h-full">
      <div class="mb-8">
        <span 
          v-if="isFeatured"
          class="inline-block px-3 py-1 rounded-full bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest mb-4"
        >
          Mais Vendido
        </span>
        <h3 
          class="text-2xl font-bold font-serif italic mb-2"
          :class="isFeatured ? 'text-white' : 'text-slate-900'"
        >
          {{ plan.name }}
        </h3>
        <p 
          class="text-sm leading-relaxed font-medium"
          :class="isFeatured ? 'text-slate-400' : 'text-slate-500'"
        >
          {{ plan.description }}
        </p>
      </div>

      <div class="mb-8">
        <div class="flex items-baseline gap-1">
          <span 
            class="text-4xl font-black tracking-tighter"
            :class="isFeatured ? 'text-white' : 'text-slate-900'"
          >
            {{ formatCurrency(plan.price_brl) }}
          </span>
          <span 
            class="text-sm font-medium"
            :class="isFeatured ? 'text-slate-500' : 'text-slate-400'"
          >
            / {{ plan.duration_days }} dias
          </span>
        </div>
      </div>

      <ul class="space-y-4 mb-10 flex-grow">
        <li 
          v-for="feature in features" 
          :key="feature"
          class="flex items-start gap-3"
        >
          <div 
            class="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors"
            :class="isFeatured ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-400'"
          >
            <Check class="w-3.5 h-3.5" />
          </div>
          <span 
            class="text-sm font-medium"
            :class="isFeatured ? 'text-slate-300' : 'text-slate-600'"
          >
            {{ feature }}
          </span>
        </li>
      </ul>

      <BaseButton
        :variant="isFeatured ? 'primary' : 'outline'"
        class="w-full py-6 text-base font-bold rounded-2xl transition-all active:scale-95 shadow-lg"
        :class="isFeatured ? 'bg-white text-slate-900 hover:bg-slate-50 border-none' : 'border-slate-200 text-slate-900 hover:bg-slate-50'"
        :loading="loading"
        @click="$emit('select', plan)"
      >
        Selecionar {{ plan.name }}
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.group:hover {
  transform: translateY(-8px);
}
</style>
