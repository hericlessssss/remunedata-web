<script setup lang="ts">
import { CheckCircle2, XCircle, Clock, Database, Calendar } from 'lucide-vue-next'
import { useExecutions } from '../composables/useExecutions'
import { formatDate } from '@/core/formatters/date'
import BaseTable from '@/shared/ui/BaseTable.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'

const { data, isLoading, page } = useExecutions()

const tableHeaders = [
  { key: 'status', label: 'Status' },
  { key: 'start_at', label: 'Início' },
  { key: 'end_at', label: 'Conclusão' },
  { key: 'records_processed', label: 'Registros', class: 'text-right font-mono' },
  { key: 'error_message', label: 'Observações', class: 'hidden lg:table-cell' },
]

const getStatusClass = (status: string) => {
  return status === 'SUCCESS'
    ? 'bg-green-50 text-green-700 border-green-200'
    : 'bg-red-50 text-red-700 border-red-200'
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-3xl font-bold text-slate-900 font-serif">Execuções</h2>
      <p class="text-slate-500">Log de auditoria das sincronizações de dados com o portal.</p>
    </div>

    <!-- Tabela -->
    <BaseTable :headers="tableHeaders" :items="data?.items || []" :loading="isLoading">
      <template #cell-status="{ item }">
        <div
          class="flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-bold w-fit"
          :class="getStatusClass(item.status)"
        >
          <CheckCircle2 v-if="item.status === 'SUCCESS'" class="w-3.5 h-3.5" />
          <XCircle v-else class="w-3.5 h-3.5" />
          {{ item.status === 'SUCCESS' ? 'SUCESSO' : 'FALHA' }}
        </div>
      </template>

      <template #cell-start_at="{ item }">
        <span class="flex items-center gap-1.5 text-slate-600 font-medium">
          <Calendar class="w-3.5 h-3.5 text-slate-400" />
          {{ formatDate(item.start_at) }}
        </span>
      </template>

      <template #cell-end_at="{ item }">
        <span v-if="item.end_at" class="flex items-center gap-1.5 text-slate-400">
          <Clock class="w-3.5 h-3.5" />
          {{ formatDate(item.end_at) }}
        </span>
        <span v-else class="text-amber-500 font-medium animate-pulse">Sincronizando...</span>
      </template>

      <template #cell-records_processed="{ item }">
        <span class="font-bold text-slate-900">{{ item.records_processed.toLocaleString('pt-BR') }}</span>
      </template>

      <template #cell-error_message="{ item }">
        <span class="text-xs text-slate-400 truncate max-w-xs block" :title="item.error_message">
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
