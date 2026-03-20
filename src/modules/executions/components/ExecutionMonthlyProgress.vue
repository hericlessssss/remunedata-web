<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-vue-next'
import { ExecutionService } from '../services/execution.service'

const props = defineProps<{
  executionId: number
  status: string
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
</script>

<template>
  <div v-if="isLoading" class="flex items-center justify-center p-8">
    <RefreshCw class="w-6 h-6 text-blue-500 animate-spin mr-3" />
    <span class="text-slate-500 font-medium font-mono animate-pulse">Obtendo logs de orquestração...</span>
  </div>
  
  <div v-else-if="data?.monthly_executions" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
    <div 
      v-for="m in data.monthly_executions" 
      :key="m.mes_referencia"
      class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-y-2 relative overflow-hidden"
    >
      <div 
        v-if="m.status === 'running'"
        class="absolute top-0 left-0 w-full h-1 bg-blue-400 animate-pulse"
      ></div>
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-slate-400">Mês {{ m.mes_referencia }}</span>
        <div :class="getStatusClass(m.status)" class="p-1 rounded-full border">
          <CheckCircle2 v-if="m.status === 'success'" class="w-3 h-3" />
          <RefreshCw v-else-if="m.status === 'running'" class="w-3 h-3 animate-spin" />
          <RefreshCw v-else-if="m.status === 'pending'" class="w-3 h-3 opacity-30" />
          <XCircle v-else class="w-3 h-3" />
        </div>
      </div>
      <div>
        <div class="text-sm font-bold text-slate-700">
          {{ m.registros_coletados.toLocaleString('pt-BR') }}
        </div>
        <div class="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Registros</div>
      </div>
    </div>
  </div>

  <div v-else class="p-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
    <p class="text-slate-400 text-sm italic">Nenhum detalhe mensal disponível para esta execução.</p>
  </div>
</template>
