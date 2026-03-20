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
    // Se começar com "SECRETARIA DE", remover para encurtar
    let name = o.nome_orgao.replace(/^SECRETARIA DE (ESTADO DE )?/i, '').trim()
    if (name.length > 20) name = name.substring(0, 18) + '...'
    return name
  })
  
  const values = data.value.top_orgaos.map((o) => {
    // Mapeamento resiliente para diferentes versões da API
    const item = o as unknown as Record<string, unknown>
    return (
      o.media_salarial ||
      (item.media_bruta as number) ||
      (item.valor_bruto as number) ||
      (item.total_gasto_bruto as number) ||
      0
    )
  })

  return {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', axisLabel: { formatter: '{value} R$' } },
    yAxis: { type: 'category', data: categories },
    series: [
      {
        name: 'Média Salarial Bruta',
        type: 'bar',
        data: values,
        itemStyle: { color: '#1e293b' },
        label: {
          show: true,
          position: 'right',
          formatter: (params: { value: number }) => formatCurrency(params.value),
        },
      },
    ],
  }
})
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col gap-1">
      <h2 class="text-3xl font-bold text-slate-900 font-serif">Visão Geral</h2>
      <p class="text-slate-500">
        Métricas e análise da estrutura remuneratória do DF em
        {{ data?.ano_referencia || ':' }}
      </p>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BaseCard
        title="Total de Servidores"
        :value="isLoading ? '...' : data?.total_servidores.toLocaleString('pt-BR') || '0'"
        description="Servidores ativos identificados"
        :icon="Users"
      />
      <BaseCard
        title="Média Salarial"
        :value="isLoading ? '...' : formatCurrency(data?.media_salarial || 0)"
        description="Remuneração média mensal"
        :icon="TrendingUp"
      />
      <BaseCard
        title="Gasto Total Bruto"
        :value="isLoading ? '...' : formatCurrency(data?.total_gasto_bruto || 0)"
        description="Total folha de pagamento"
        :icon="Wallet"
      />
    </div>

    <!-- Charts Section -->
    <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 class="text-lg font-bold text-slate-800 mb-6">Média Salarial por Órgão (Top 5)</h3>
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
