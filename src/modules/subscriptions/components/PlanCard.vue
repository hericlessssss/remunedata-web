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
    class="relative group p-8 rounded-3xl border transition-all duration-700 overflow-hidden h-full flex flex-col backdrop-blur-xl"
    :class="[
      isFeatured 
        ? 'bg-slate-900/95 border-slate-700 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/10' 
        : 'bg-white/80 border-slate-200/60 hover:border-slate-300 shadow-sm hover:shadow-xl'
    ]"
  >
    <!-- Animated Border for Featured -->
    <div 
      v-if="isFeatured"
      class="absolute inset-0 p-[2px] rounded-3xl -z-10"
    >
      <div class="absolute inset-0 bg-gradient-to-r from-[#007AFF] via-[#5856D6] to-[#007AFF] bg-[length:200%_auto] animate-gradient-slow rounded-3xl opacity-50"></div>
    </div>

    <!-- Background Glow -->
    <div 
      class="absolute -top-24 -right-24 w-64 h-64 blur-[100px] rounded-full transition-all duration-700"
      :class="isFeatured ? 'bg-blue-600/20 group-hover:bg-blue-600/30' : 'bg-slate-100 group-hover:bg-blue-50'"
    ></div>

    <div class="relative z-10 flex flex-col h-full">
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <span 
            v-if="isFeatured"
            class="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-[#007AFF] to-[#5856D6] text-white text-[10px] font-black uppercase tracking-widest"
          >
            Mais Vendido
          </span>
          <div 
            v-else
            class="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:bg-white transition-all"
          >
            <Check class="w-4 h-4" />
          </div>
        </div>

        <h3 
          class="text-2xl font-bold font-serif italic mb-2 tracking-tight transition-transform group-hover:translate-x-1 duration-500"
          :class="isFeatured ? 'text-white' : 'text-slate-900'"
        >
          {{ plan.name }}
        </h3>
        <p 
          class="text-sm leading-relaxed font-medium transition-colors duration-500"
          :class="isFeatured ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-500 group-hover:text-slate-600'"
        >
          {{ plan.description }}
        </p>
      </div>

      <div class="mb-10">
        <div class="flex items-baseline gap-1">
          <span 
            class="text-5xl font-black tracking-tighter"
            :class="isFeatured ? 'text-white' : 'text-slate-900'"
          >
            {{ formatCurrency(plan.price_brl) }}
          </span>
          <span 
            class="text-xs font-bold uppercase tracking-widest opacity-50"
            :class="isFeatured ? 'text-slate-300' : 'text-slate-500'"
          >
            / {{ plan.duration_days }} dias
          </span>
        </div>
      </div>

      <ul class="space-y-4 mb-10 flex-grow">
        <li 
          v-for="feature in features" 
          :key="feature"
          class="flex items-start gap-3 group/item"
        >
          <div 
            class="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300"
            :class="isFeatured ? 'bg-slate-800 text-blue-400 group-hover/item:scale-110' : 'bg-slate-50 text-slate-400 group-hover/item:bg-blue-50 group-hover/item:text-blue-500'"
          >
            <Check class="w-3.5 h-3.5" />
          </div>
          <span 
            class="text-sm font-medium transition-colors"
            :class="isFeatured ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-500 group-hover:text-slate-700'"
          >
            {{ feature }}
          </span>
        </li>
      </ul>

      <BaseButton
        :variant="isFeatured ? 'gradient' : 'outline'"
        class="w-full py-7 text-base font-black rounded-2xl transition-all active:scale-95 shadow-lg uppercase tracking-widest"
        :class="[
          isFeatured 
            ? 'shadow-blue-500/20 hover:shadow-blue-500/40 transform hover:-translate-y-1' 
            : 'border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white hover:border-slate-900'
        ]"
        :loading="loading"
        @click="$emit('select', plan)"
      >
        {{ isFeatured ? 'Começar Agora' : 'Selecionar ' + plan.name }}
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.animate-gradient-slow {
  animation: gradient 6s linear infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.group:hover {
  transform: translateY(-12px);
}
</style>
