<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { formatCurrency } from '@/core/formatters/currency'

interface Plan {
  slug: string
  name: string
  description: string
  price_brl: number
  duration_days: number
}

defineProps<{
  plan: Plan
  isFeatured?: boolean
  loading?: boolean
}>()

defineEmits(['select'])
</script>

<template>
  <div
    class="relative group p-8 rounded-3xl border transition-all duration-500 overflow-hidden"
    :class="[
      isFeatured 
        ? 'bg-white/10 backdrop-blur-xl border-blue-500/50 shadow-2xl shadow-blue-500/20' 
        : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
    ]"
  >
    <!-- Background Glow for Featured -->
    <div 
      v-if="isFeatured"
      class="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full group-hover:bg-blue-500/30 transition-colors"
    ></div>

    <div class="relative z-10 flex flex-col h-full">
      <div class="mb-8">
        <span 
          v-if="isFeatured"
          class="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest mb-4 animate-pulse"
        >
          Mais Vendido
        </span>
        <h3 
          class="text-2xl font-bold font-serif italic mb-2"
          :class="isFeatured ? 'text-slate-900' : 'text-slate-900'"
        >
          {{ plan.name }}
        </h3>
        <p 
          class="text-sm leading-relaxed"
          :class="isFeatured ? 'text-slate-600' : 'text-slate-500'"
        >
          {{ plan.description }}
        </p>
      </div>

      <div class="mb-8">
        <div class="flex items-baseline gap-1">
          <span class="text-4xl font-black tracking-tight text-slate-900">
            {{ formatCurrency(plan.price_brl) }}
          </span>
          <span class="text-slate-400 text-sm font-medium">
            / {{ plan.duration_days }} dias
          </span>
        </div>
      </div>

      <ul class="space-y-4 mb-10 flex-grow">
        <li 
          v-for="i in 4" 
          :key="i"
          class="flex items-start gap-3"
        >
          <div 
            class="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
            :class="isFeatured ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'"
          >
            <Check class="w-3 h-3" />
          </div>
          <span class="text-sm font-medium text-slate-600">Benefício {{ i }} do plano</span>
        </li>
      </ul>

      <BaseButton
        :variant="isFeatured ? 'primary' : 'outline'"
        class="w-full py-6 text-base font-bold rounded-2xl transition-transform active:scale-95"
        :class="isFeatured ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl hover:shadow-blue-500/30 border-none' : ''"
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
