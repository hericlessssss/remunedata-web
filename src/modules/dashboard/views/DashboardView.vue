<script setup lang="ts">
import { computed } from 'vue'
import { Users, TrendingUp, Wallet } from 'lucide-vue-next'
import { useDashboardSummary } from '../composables/useDashboardSummary'
import { formatCurrency } from '@/core/formatters/currency'
import BaseCard from '@/shared/ui/BaseCard.vue'
import BaseChart from '@/shared/ui/BaseChart.vue'
import BaseLoading from '@/shared/ui/BaseLoading.vue'

const { data, isLoading, isError, error } = useDashboardSummary()

const chartOptions = computed(() => {
  if (!data.value) return {}

  const categories = data.value.top_orgaos.map((o) => {
    // Limpar espaços extras e remover prefixos repetitivos
    let name = o.nome_orgao.trim().replace(/^SECRETARIA DE (ESTADO DE )?/i, '').trim()
    if (name.length > 25) name = name.substring(0, 23) + '...'
    return name
  })
  
  const values = data.value.top_orgaos.map((o) => {
    const item = o as unknown as Record<string, unknown>
    // Usar count (da API real) ou fallbacks
    return (item.count as number) || o.total_servidores || (o.media_salarial as number) || 0
  })

  return {
    tooltip: { 
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderWidth: 0,
      textStyle: { color: '#1e293b' },
      shadowBlur: 15,
      shadowColor: 'rgba(0,0,0,0.1)',
      formatter: (params: unknown) => {
        const p = (params as { name: string; value: number }[])[0]
        return `
          <div class="px-3 py-1">
            <div class="text-xs text-slate-400 font-bold uppercase mb-1">${p.name}</div>
            <div class="text-sm font-bold">${p.value.toLocaleString('pt-BR')} servidores</div>
          </div>
        `
      }
    },
    grid: { left: '4%', right: '8%', bottom: '5%', top: '5%', containLabel: true },
    xAxis: { 
      type: 'value', 
      axisLabel: { formatter: (val: number) => val.toLocaleString('pt-BR') } 
    },
    yAxis: { type: 'category', data: categories, inverse: true },
    series: [
      {
        name: 'Total de Servidores',
        type: 'bar',
        data: values,
        barWidth: 24,
        showBackground: true,
        backgroundStyle: {
          color: '#f8fafc',
          borderRadius: 12
        },
        itemStyle: {
          borderRadius: [0, 12, 12, 0],
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#0f172a' }, // slate-900
              { offset: 1, color: '#334155' }  // slate-700
            ]
          },
          shadowBlur: 10,
          shadowColor: 'rgba(15, 23, 42, 0.1)',
          shadowOffsetX: 4
        },
        emphasis: {
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: '#1e293b' },
                { offset: 1, color: '#475569' }
              ]
            }
          }
        },
        label: {
          show: true,
          position: 'right',
          formatter: (params: { value: number }) => params.value.toLocaleString('pt-BR'),
        },
      },
    ],
  }
})
</script>

<template>
  <div class="space-y-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div class="flex flex-col gap-1">
          <h2 class="text-3xl font-bold text-slate-900 font-serif">Visão Geral</h2>
          <p class="text-slate-500">
            Análise consolidada da estrutura remuneratória para o exercício de
            <span class="font-bold text-slate-700">{{ data?.ano_referencia || 'Todos os Anos' }}</span>
          </p>
        </div>
        <div v-if="data" class="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-xl">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-xs font-bold text-green-700 uppercase tracking-wider">
            Sincronizado
          </span>
        </div>
      </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BaseCard
        title="Total de Servidores"
        :value="isLoading ? '...' : data?.total_servidores.toLocaleString('pt-BR') || '0'"
        description="Contagem de CPF únicos identificados no exercício selecionado."
        :icon="Users"
      />
      <BaseCard
        title="Média Salarial"
        :value="isLoading ? '...' : formatCurrency(data?.media_salarial || 0)"
        description="Valor médio da remuneração bruta mensal no período."
        :icon="TrendingUp"
      />
      <BaseCard
        title="Gasto Total Bruto"
        :value="isLoading ? '...' : formatCurrency(data?.total_gasto_bruto || 0)"
        description="Somatório acumulado de todas as folhas de pagamento identificadas."
        :icon="Wallet"
      />
    </div>

    <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h3 class="text-xl font-bold text-slate-900">Distribuição por Órgão</h3>
          <p class="text-sm text-slate-500">Top 5 órgãos com maior volume de servidores</p>
        </div>
        <div class="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Tempo Real
        </div>
      </div>
      <BaseLoading v-if="isLoading" label="Analisando dados remuneratórios..." />
      <BaseChart v-else-if="data" :option="chartOptions" />
      <div
        v-else-if="isError"
        class="h-[350px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-lg"
      >
        <div class="text-center">
          <p class="text-red-500 font-medium">Erro ao carregar dados</p>
          <p class="text-sm text-slate-400">{{ (error as Error)?.message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
