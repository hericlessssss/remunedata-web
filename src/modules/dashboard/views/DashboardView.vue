<script setup lang="ts">
import { computed } from 'vue'
import { Users, TrendingUp, Wallet, RefreshCw } from 'lucide-vue-next'
import { useDashboardSummary } from '../composables/useDashboardSummary'
import { formatCurrency } from '@/core/formatters/currency'
import BaseCard from '@/shared/ui/BaseCard.vue'
import BaseChart from '@/shared/ui/BaseChart.vue'
import BaseSkeleton from '@/shared/ui/BaseSkeleton.vue'

const { data, isLoading, isFetching, isError, error } = useDashboardSummary()

const chartOptions = computed(() => {
  if (!data.value) return {}

  const categories = data.value.top_orgaos.map((o) => {
    let name = o.nome_orgao.trim().replace(/^SECRETARIA DE (ESTADO DE )?/i, '').trim()
    if (name.length > 20) name = name.substring(0, 18) + '...'
    return name
  })
  
  const values = data.value.top_orgaos.map((o) => {
    const item = o as unknown as Record<string, unknown>
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
            <div class="text-[10px] text-slate-400 font-bold uppercase mb-1">${p.name}</div>
            <div class="text-sm font-bold text-slate-900">${p.value.toLocaleString('pt-BR')} servidores</div>
          </div>
        `
      }
    },
    grid: { left: '3%', right: '10%', bottom: '3%', top: '5%', containLabel: true },
    xAxis: { 
      type: 'value', 
      axisLabel: { show: false },
      splitLine: { show: false }
    },
    yAxis: { 
      type: 'category', 
      data: categories, 
      inverse: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontWeight: '600', color: '#64748b' }
    },
    series: [
      {
        name: 'Servidores',
        type: 'bar',
        data: values,
        barWidth: 18,
        showBackground: true,
        backgroundStyle: { color: '#f8fafc', borderRadius: 10 },
        itemStyle: {
          borderRadius: 10,
          color: {
            type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#0f172a' },
              { offset: 1, color: '#334155' }
            ]
          }
        },
        label: {
          show: true,
          position: 'right',
          fontWeight: 'bold',
          formatter: (params: unknown) => (params as { value: number }).value.toLocaleString('pt-BR'),
        },
      },
    ],
  }
})
</script>

<template>
  <div class="space-y-8 pb-10">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-4xl font-bold text-slate-900 font-serif tracking-tight">Visão Geral</h2>
        <p class="text-slate-500 font-medium">
          Dashboard consolidado de remunerações do Distrito Federal.
        </p>
      </div>
      <div v-if="data" class="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </div>
        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          Monitorando em Tempo Real
          <RefreshCw v-if="isFetching" class="w-3 h-3 animate-spin text-blue-500" />
        </span>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BaseCard title="Total de Servidores" :icon="Users">
        <template #default>
          <BaseSkeleton v-if="isLoading" height="32px" width="60%" class="mt-1" />
          <p v-else class="text-3xl font-bold text-slate-900 mt-1">
            {{ data?.total_servidores.toLocaleString('pt-BR') || '0' }}
          </p>
        </template>
        <template #footer>
          <p class="text-xs text-slate-500">Média baseada no período de {{ data?.ano_referencia }}</p>
        </template>
      </BaseCard>

      <BaseCard title="Média Salarial" :icon="TrendingUp">
        <template #default>
          <BaseSkeleton v-if="isLoading" height="32px" width="80%" class="mt-1" />
          <p v-else class="text-3xl font-bold text-slate-900 mt-1">
            {{ formatCurrency(data?.media_salarial || 0) }}
          </p>
        </template>
        <template #footer>
          <p class="text-xs text-slate-500 text-emerald-600 font-bold">↑ Remuneração Bruta Estimada</p>
        </template>
      </BaseCard>

      <BaseCard title="Gasto Total Bruto" :icon="Wallet">
        <template #default>
          <BaseSkeleton v-if="isLoading" height="32px" width="90%" class="mt-1" />
          <p v-else class="text-3xl font-bold text-slate-900 mt-1">
            {{ formatCurrency(data?.total_gasto_bruto || 0) }}
          </p>
        </template>
        <template #footer>
          <p class="text-xs text-slate-500">Impacto orçamentário identificado</p>
        </template>
      </BaseCard>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 gap-6">
      <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
        <div class="flex items-center justify-between mb-10">
          <div>
            <h3 class="text-2xl font-bold text-slate-900 font-serif">Engajamento por Órgão</h3>
            <p class="text-sm text-slate-500 font-medium">Top 5 órgãos com maior contingente de pessoal</p>
          </div>
        </div>
        
        <div v-if="isLoading" class="space-y-4 py-10">
          <BaseSkeleton v-for="i in 5" :key="i" height="30px" :width="`${100 - (i*10)}%`" />
        </div>
        <div v-else-if="data" class="h-[400px] w-full">
          <BaseChart :option="chartOptions" height="100%" />
        </div>
        <div v-else-if="isError" class="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
          <p class="text-red-500 font-bold">Falha na sincronização de dados</p>
          <p class="text-sm text-slate-400">{{ (error as Error)?.message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
