<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { ArrowLeft, User, Building2, Briefcase, TrendingUp } from 'lucide-vue-next'
import { RemunerationService } from '../services/remuneration.service'
import { formatCurrency } from '@/core/formatters/currency'
import { formatCompetence } from '@/core/formatters/date'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseChart from '@/shared/ui/BaseChart.vue'
import BaseCard from '@/shared/ui/BaseCard.vue'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

// Busca dados do registro atual
const { data: current, isLoading: loadingCurrent } = useQuery({
  queryKey: ['remuneration', 'detail', id],
  queryFn: () => RemunerationService.getById(id),
})

// Busca histórico baseado no CPF (quando disponível)
const { data: history, isLoading: loadingHistory } = useQuery({
  queryKey: ['remuneration', 'history', computed(() => current.value?.cpf_servidor)],
  queryFn: () => RemunerationService.getHistory(current.value!.cpf_servidor),
  enabled: computed(() => !!current.value?.cpf_servidor),
})

const chartOptions = computed(() => {
  if (!history.value) return {}

  // Ordenar histórico por data
  const sorted = [...history.value].sort((a, b) => {
    const dateA = new Date(a.ano_exercicio, Number(a.mes_referencia) - 1)
    const dateB = new Date(b.ano_exercicio, Number(b.mes_referencia) - 1)
    return dateA.getTime() - dateB.getTime()
  })

  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Vlr. Bruto', 'Vlr. Líquido'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: sorted.map((h) => formatCompetence(h.mes_referencia, h.ano_exercicio)),
    },
    yAxis: { type: 'value', axisLabel: { formatter: (v: number) => `R$ ${v / 1000}k` } },
    series: [
      {
        name: 'Vlr. Bruto',
        type: 'line',
        data: sorted.map((h) => h.valor_bruto),
        smooth: true,
        itemStyle: { color: '#1e293b' },
      },
      {
        name: 'Vlr. Líquido',
        type: 'line',
        data: sorted.map((h) => h.valor_liquido),
        smooth: true,
        itemStyle: { color: '#10b981' },
      },
    ],
  }
})

const goBack = () => router.back()
</script>

<template>
  <div class="space-y-8 pb-12">
    <!-- Header -->
    <div class="flex flex-col gap-4">
      <BaseButton variant="ghost" size="sm" class="w-fit -ml-2 text-slate-500" @click="goBack">
        <ArrowLeft class="w-4 h-4 mr-2" />
        Voltar para a lista
      </BaseButton>

      <div v-if="loadingCurrent" class="animate-pulse space-y-2">
        <div class="h-10 bg-slate-200 rounded w-1/3"></div>
        <div class="h-4 bg-slate-100 rounded w-1/4"></div>
      </div>
      <div v-else-if="current" class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div class="space-y-1">
          <h2 class="text-4xl font-bold text-slate-900 font-serif">{{ current.nome_servidor }}</h2>
          <div class="flex flex-wrap items-center gap-4 text-slate-500 text-sm">
            <span class="flex items-center gap-1.5"><User class="w-4 h-4" /> {{ current.cpf_servidor }}</span>
            <span class="flex items-center gap-1.5"><Building2 class="w-4 h-4" /> {{ current.nome_orgao }}</span>
            <span class="flex items-center gap-1.5"><Briefcase class="w-4 h-4" /> {{ current.cargo }}</span>
          </div>
        </div>
        <div class="bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-100">
           <p class="text-xs font-bold uppercase tracking-wider opacity-70">Última Referência</p>
           <p class="text-lg font-bold">{{ formatCompetence(current.mes_referencia, current.ano_exercicio) }}</p>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BaseCard
        title="Remuneração Bruta"
        :value="loadingCurrent ? '...' : formatCurrency(current?.valor_bruto || 0)"
        description="Valor total antes de descontos"
        :icon="TrendingUp"
      />
      <BaseCard
        title="Remuneração Líquida"
        :value="loadingCurrent ? '...' : formatCurrency(current?.valor_liquido || 0)"
        description="Valor creditado em conta"
        :icon="TrendingUp"
      />
      <BaseCard
        title="Total de Registros"
        :value="loadingHistory ? '...' : String(history?.length || 0)"
        description="Meses acumulados no sistema"
        :icon="Briefcase"
      />
    </div>

    <!-- Charts Section -->
    <div class="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
      <h3 class="text-xl font-bold text-slate-800 mb-8 font-serif">Evolução de Ganhos</h3>
      <div v-if="loadingHistory" class="h-[400px] flex items-center justify-center bg-slate-50 rounded-xl animate-pulse">
        <span class="text-slate-400 font-medium">Carregando série temporal...</span>
      </div>
      <BaseChart v-else-if="history && history.length > 0" :option="chartOptions" class="h-[400px]" />
      <div v-else class="h-[400px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl">
         <p class="text-slate-400">Histórico insuficiente para gerar gráfico.</p>
      </div>
    </div>

    <!-- History Table Placeholder or Full Table -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 class="font-bold text-slate-800">Histórico de Contracheques</h3>
        </div>
        <div class="divide-y divide-slate-100">
             <div v-for="h in history" :key="h.id" class="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                    <p class="font-bold text-slate-700">{{ formatCompetence(h.mes_referencia, h.ano_exercicio) }}</p>
                    <p class="text-xs text-slate-400">Referência Mensal</p>
                </div>
                <div class="flex gap-8 text-right">
                    <div>
                        <p class="text-xs text-slate-400 uppercase font-bold">Bruto</p>
                        <p class="font-bold text-slate-900">{{ formatCurrency(h.valor_bruto) }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-slate-400 uppercase font-bold">Líquido</p>
                        <p class="font-bold text-green-600">{{ formatCurrency(h.valor_liquido) }}</p>
                    </div>
                </div>
             </div>
        </div>
    </div>
  </div>
</template>
