<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-vue-next'
import { ExecutionService } from '../services/execution.service'
import type { MonthlyExecution } from '@/core/types/api'

const props = defineProps<{
  executionId: number
  status: string
  parentTotal: number
}>()

const { data, isLoading } = useQuery({
  queryKey: ['executions', 'detail', props.executionId],
  queryFn: () => ExecutionService.getById(props.executionId),
  refetchInterval: () => {
    const s = props.status.toLowerCase()
    return (s === 'running' || s === 'pending') ? 5000 : false
  }
})

const getStatusClass = (status: string) => {
  const s = status.toLowerCase()
  if (s === 'success') return 'bg-green-50 text-green-700 border-green-200'
  if (s === 'running') return 'bg-blue-50 text-blue-700 border-blue-200'
  if (s === 'pending') return 'bg-slate-50 text-slate-600 border-slate-200'
  if (s === 'partial_success') return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-red-50 text-red-700 border-red-200'
}

const getMonthlyCount = (m: MonthlyExecution, allMonths: MonthlyExecution[]) => {
  if (m.status !== 'running') return m.registros_coletados ?? 0
  
  // Encontra qual é o PRIMEIRO mês que está rodando na lista
  const firstRunningMonth = allMonths.find(month => month.status === 'running')
  
  // Se não for o mês ativo da fila, apenas retorna o valor real da API (evita duplicar o total do pai)
  if (firstRunningMonth?.mes_referencia !== m.mes_referencia) {
    return m.registros_coletados ?? 0
  }

  // Se o total do pai for maior que o que temos no mês, usamos o do pai como estimativa real-time
  const otherMonthsTotal = allMonths
    .filter(month => month.mes_referencia !== m.mes_referencia && month.status === 'success')
    .reduce((acc, month) => acc + (month.registros_coletados || 0), 0)
  
  const estimated = props.parentTotal - otherMonthsTotal
  
  // Se a estimativa for muito discrepante do valor base (750), usamos ela
  return Math.max(m.registros_coletados ?? 0, estimated)
}
</script>

<template>
  <div v-if="isLoading" class="flex items-center justify-center p-8">
    <RefreshCw class="w-6 h-6 text-blue-500 animate-spin mr-3" />
    <span class="text-slate-500 font-medium font-mono animate-pulse">Obtendo logs de orquestração...</span>
  </div>
  
  <div v-else-if="data" class="space-y-4">
    <div v-if="(data.monthly_executions || data.monthlyExecutions)?.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      <div 
        v-for="m in (data.monthly_executions || data.monthlyExecutions)" 
        :key="m.id || m.mes_referencia"
        class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-y-2 relative overflow-hidden transition-all hover:border-blue-200"
      >
        <div 
          v-if="m.status === 'running'"
          class="absolute top-0 left-0 w-full h-1 bg-blue-400 animate-pulse"
        ></div>
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-tighter">Mês {{ m.mes_referencia }}</span>
          <div :class="getStatusClass(m.status)" class="p-1 rounded-full border">
            <CheckCircle2 v-if="m.status === 'success'" class="w-3 h-3" />
            <RefreshCw v-else-if="m.status === 'running'" class="w-3 h-3 animate-spin" />
            <RefreshCw v-else-if="m.status === 'pending'" class="w-3 h-3 opacity-30" />
            <XCircle v-else class="w-3 h-3" />
          </div>
        </div>
        <div>
          <div class="text-sm font-bold text-slate-700">
            {{ getMonthlyCount(m, data.monthly_executions || data.monthlyExecutions || []).toLocaleString('pt-BR') }}
          </div>
          <div class="text-[10px] text-slate-400 uppercase font-extrabold tracking-tight">Coletados (Mês)</div>
        </div>
      </div>
    </div>
    
    <div v-else class="p-8 text-center bg-white/50 rounded-xl border border-dashed border-slate-200">
      <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 mb-3 text-slate-400">
        <RefreshCw class="w-5 h-5" />
      </div>
      <p class="text-slate-500 text-sm font-medium">Logs de orquestração ainda não gerados para esta execução.</p>
      <p class="text-slate-400 text-[10px] uppercase mt-1">Aguardando início do processamento mensal...</p>
    </div>
  </div>
</template>
