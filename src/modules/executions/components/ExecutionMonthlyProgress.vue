<script setup lang="ts">
import { ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { CheckCircle2, XCircle, RefreshCw, Clock, Activity } from 'lucide-vue-next'
import { ExecutionService } from '../services/execution.service'

const props = defineProps<{
  executionId: number
  status: string
  parentTotal: number
}>()

const { data, isLoading, refetch } = useQuery({
  queryKey: ['executions', 'detail', props.executionId],
  queryFn: () => ExecutionService.getById(props.executionId),
  refetchInterval: () => {
    const s = props.status.toLowerCase()
    return (s === 'running' || s === 'pending') ? 3000 : false
  }
})

const retryingMonths = ref<Set<string>>(new Set())

const handleRetryMonth = async (mes: string) => {
  try {
    retryingMonths.value.add(mes)
    await ExecutionService.retryMonth(props.executionId, mes)
    // Pequeno delay para o polling capturar o novo status 'running' do worker
    window.setTimeout(() => {
      refetch()
      retryingMonths.value.delete(mes)
    }, 1500)
  } catch {
    retryingMonths.value.delete(mes)
  }
}

const getStatusClass = (status: string, isRetrying = false) => {
  if (isRetrying) return 'bg-slate-900 text-white border-slate-900 ring-4 ring-slate-900/10'
  const s = status.toLowerCase()
  if (s === 'success') return 'bg-slate-50 text-slate-900 border-slate-200'
  if (s === 'running') return 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20'
  if (s === 'pending') return 'bg-slate-50 text-slate-400 border-slate-100 italic'
  if (s === 'partial_success' || s === 'warning') return 'bg-slate-100 text-slate-800 border-slate-300'
  return 'bg-white text-slate-900 border-slate-900 font-black decoration-double underline'
}

const getStatusLabel = (status: string, isRetrying = false) => {
  if (isRetrying) return 'Reiniciando'
  const s = status.toLowerCase()
  if (s === 'success') return 'Concluído'
  if (s === 'running') return 'Processando'
  if (s === 'pending') return 'Aguardando'
  if (s === 'partial_success') return 'Parcial'
  if (s === 'error') return 'Erro'
  return status.toUpperCase()
}
</script>

<template>
  <div v-if="isLoading" class="flex flex-col items-center justify-center p-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
    <div class="relative mb-4">
      <RefreshCw class="w-10 h-10 text-slate-900 animate-spin" />
      <Activity class="w-4 h-4 text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>
    <span class="text-slate-900 font-black text-sm tracking-tighter mb-1 uppercase">Nitro Engine: Orquestração Ativa</span>
    <span class="text-slate-400 text-[10px] uppercase font-mono animate-pulse">Sincronizando lotes de processamento...</span>
  </div>
  
  <div v-else-if="data" class="space-y-6">
    <!-- Grid de Meses -->
    <div v-if="(data.monthly_executions || data.monthlyExecutions)?.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div 
        v-for="m in (data.monthly_executions || data.monthlyExecutions)" 
        :key="m.id || m.mes_referencia"
        class="group bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:border-slate-900 relative overflow-hidden"
        :class="{ 'ring-4 ring-slate-900/5 border-slate-900': m.status === 'running' || retryingMonths.has(m.mes_referencia) }"
      >
        <!-- Running/Retry Progress Glow -->
        <div 
          v-if="m.status === 'running' || retryingMonths.has(m.mes_referencia)"
          class="absolute top-0 left-0 w-full h-1 bg-slate-900 animate-pulse"
        ></div>

        <div class="flex items-start justify-between mb-4">
          <div class="flex flex-col">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Mês</span>
            <span class="text-xl font-black text-slate-900 leading-none">{{ m.mes_referencia.padStart(2, '0') }}</span>
          </div>
          <div :class="getStatusClass(m.status, retryingMonths.has(m.mes_referencia))" class="p-1.5 rounded-lg border transition-all group-hover:scale-110 duration-200 shadow-sm">
            <CheckCircle2 v-if="m.status === 'success'" class="w-4 h-4" />
            <RefreshCw v-else-if="m.status === 'running' || retryingMonths.has(m.mes_referencia)" class="w-4 h-4 animate-spin" />
            <Clock v-else-if="m.status === 'pending'" class="w-4 h-4 opacity-50" />
            
            <template v-else-if="m.status === 'error'">
              <button 
                class="retry-button hover:rotate-180 transition-transform duration-500 flex items-center justify-center"
                title="Tentar Novamente"
                @click.stop="handleRetryMonth(m.mes_referencia)"
              >
                <RefreshCw class="w-4 h-4 cursor-pointer" />
              </button>
            </template>
            
            <XCircle v-else class="w-4 h-4" />
          </div>
        </div>

        <div class="space-y-1">
          <div class="flex items-baseline gap-1">
            <span class="text-lg font-black text-slate-800 tabular-nums">
              {{ (m.registros_coletados || 0).toLocaleString('pt-BR') }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[9px] text-slate-400 uppercase font-black tracking-tighter">Registros</span>
            <span class="text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter" :class="getStatusClass(m.status, retryingMonths.has(m.mes_referencia))">
              {{ getStatusLabel(m.status, retryingMonths.has(m.mes_referencia)) }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="p-10 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-inner">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 mb-4 text-slate-400 shadow-sm border border-slate-100">
        <Activity class="w-7 h-7" />
      </div>
      <h4 class="text-slate-900 font-black uppercase tracking-tighter mb-1">Logs Indisponíveis</h4>
      <p class="text-slate-500 text-sm max-w-sm mx-auto font-medium">
        A Nitro Engine ainda não gerou os pontos de controle para esta sincronização.
      </p>
      <div class="mt-4 inline-flex items-center px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] uppercase font-black tracking-widest animate-pulse border border-slate-800">
        Aguardando Workers...
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>

