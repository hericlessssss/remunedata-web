<script setup lang="ts">
import { ref } from 'vue'
import { CheckCircle2, XCircle, Clock, Calendar, RefreshCw } from 'lucide-vue-next'
import { useExecutions } from '../composables/useExecutions'
import { ExecutionService } from '../services/execution.service'
import { formatDate } from '@/core/formatters/date'
import BaseTable from '@/shared/ui/BaseTable.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'

const { data, isLoading, page, refetch } = useExecutions()
const isSyncing = ref(false)

const tableHeaders = [
  { key: 'status', label: 'Status' },
  { key: 'started_at', label: 'Início' },
  { key: 'finished_at', label: 'Conclusão' },
  { key: 'total_registros_coletados', label: 'Registros', class: 'text-right font-mono' },
  { key: 'error_message', label: 'Observações', class: 'hidden lg:table-cell' },
]

const getStatusClass = (status: string) => {
  const s = status.toLowerCase()
  if (s === 'success') return 'bg-green-50 text-green-700 border-green-200'
  if (s === 'running') return 'bg-blue-50 text-blue-700 border-blue-200'
  return 'bg-red-50 text-red-700 border-red-200'
}

const handleSync = async () => {
  const anoStr = window.prompt('Informe o ano para sincronização (ex: 2025):', '2025')
  if (!anoStr) return

  const ano = parseInt(anoStr)
  if (isNaN(ano)) {
    window.alert('Ano inválido!')
    return
  }

  try {
    isSyncing.value = true
    await ExecutionService.triggerSync(ano)
    window.alert('Sincronização disparada com sucesso!')
    refetch()
  } catch {
    window.alert('Falha ao disparar sincronização. Verifique se a API está online.')
  } finally {
    isSyncing.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h2 class="text-3xl font-bold text-slate-900 font-serif">Execuções</h2>
        <p class="text-slate-500">Log de auditoria das sincronizações de dados com o portal.</p>
      </div>
      <BaseButton :loading="isSyncing" @click="handleSync">
        <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': isSyncing }" />
        Sincronizar Dados
      </BaseButton>
    </div>

    <!-- Tabela -->
    <BaseTable :headers="tableHeaders" :items="data?.items || []" :loading="isLoading">
      <template #cell-status="{ item }">
        <div
          class="flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-bold w-fit"
          :class="getStatusClass(item.status)"
        >
          <CheckCircle2 v-if="item.status.toLowerCase() === 'success'" class="w-3.5 h-3.5" />
          <RefreshCw v-else-if="item.status.toLowerCase() === 'running'" class="w-3.5 h-3.5 animate-spin" />
          <XCircle v-else class="w-3.5 h-3.5" />
          {{ item.status.toUpperCase() }}
        </div>
      </template>

      <template #cell-started_at="{ item }">
        <span class="flex items-center gap-1.5 text-slate-600 font-medium">
          <Calendar class="w-3.5 h-3.5 text-slate-400" />
          {{ formatDate(item.started_at) }}
        </span>
      </template>

      <template #cell-finished_at="{ item }">
        <span v-if="item.finished_at" class="flex items-center gap-1.5 text-slate-400">
          <Clock class="w-3.5 h-3.5" />
          {{ formatDate(item.finished_at) }}
        </span>
        <span v-else class="text-amber-500 font-medium animate-pulse">Sincronizando...</span>
      </template>

      <template #cell-total_registros_coletados="{ item }">
        <span class="font-bold text-slate-900">
          {{ item.total_registros_coletados.toLocaleString('pt-BR') }}
        </span>
      </template>

      <template #cell-error_message="{ item }">
        <span class="text-xs text-slate-400 truncate max-w-xs block" :title="item.error_message || undefined">
          {{ item.error_message || 'Carga realizada com sucesso' }}
        </span>
      </template>
    </BaseTable>

    <!-- Paginação -->
    <div v-if="data && data.pages > 1" class="flex justify-end gap-2">
      <BaseButton variant="outline" size="sm" :disabled="page === 1" @click="page--">
        Anterior
      </BaseButton>
      <BaseButton variant="outline" size="sm" :disabled="page === data.pages" @click="page++">
        Próximo
      </BaseButton>
    </div>
  </div>
</template>
