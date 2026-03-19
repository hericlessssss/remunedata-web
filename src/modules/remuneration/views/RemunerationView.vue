<script setup lang="ts">
import { ref, watch } from 'vue'
import { Search, Filter, ChevronLeft, ChevronRight, FileDown } from 'lucide-vue-next'
import { useRemunerationSearch } from '../composables/useRemunerationSearch'
import { formatCurrency } from '@/core/formatters/currency'
import { formatCompetence } from '@/core/formatters/date'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseTable from '@/shared/ui/BaseTable.vue'

const { filters, data, isLoading, setPage } = useRemunerationSearch()

const tableHeaders = [
  { key: 'nome_servidor', label: 'Servidor' },
  { key: 'orgao', label: 'Órgão', class: 'hidden lg:table-cell' },
  { key: 'cargo', label: 'Cargo', class: 'hidden md:table-cell' },
  { key: 'referencia', label: 'Referência' },
  { key: 'valor_bruto', label: 'Vlr. Bruto' },
  { key: 'valor_liquido', label: 'Vlr. Líquido' },
]

// Debounce local para o nome
const localNome = ref(filters.value.nome)
let debounceTimeout: any
watch(localNome, (val) => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    filters.value.nome = val
    filters.value.page = 1
  }, 500)
})

const anos = [2025, 2024, 2023]
const meses = [
  { v: '01', l: 'Janeiro' },
  { v: '02', l: 'Fevereiro' },
  { v: '03', l: 'Março' },
  { v: '04', l: 'Abril' },
  { v: '05', l: 'Maio' },
  { v: '06', l: 'Junho' },
  { v: '07', l: 'Julho' },
  { v: '08', l: 'Agosto' },
  { v: '09', l: 'Setembro' },
  { v: '10', l: 'Outubro' },
  { v: '11', l: 'Novembro' },
  { v: '12', l: 'Dezembro' },
]
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-3xl font-bold text-slate-900 font-serif">Consulta Pública</h2>
        <p class="text-slate-500">Explore os dados de remuneração do Distrito Federal.</p>
      </div>
      <BaseButton variant="outline" class="gap-2">
        <FileDown class="w-4 h-4" />
        Exportar Filtro
      </BaseButton>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Nome -->
        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-400 uppercase">Nome do Servidor</label>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              v-model="localNome"
              type="text"
              placeholder="Ex: FRANCISCO..."
              class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all font-medium"
            />
          </div>
        </div>

        <!-- Cargo -->
        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-400 uppercase">Cargo</label>
          <input
            v-model="filters.cargo"
            type="text"
            placeholder="Ex: Delegado..."
            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all font-medium"
          />
        </div>

        <!-- Ano -->
        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-400 uppercase">Ano</label>
          <select
            v-model="filters.ano"
            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all font-medium"
          >
            <option v-for="ano in anos" :key="ano" :value="ano">{{ ano }}</option>
          </select>
        </div>

        <!-- Mes -->
        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-400 uppercase">Mês</label>
          <select
            v-model="filters.mes"
            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all font-medium"
          >
            <option v-for="m in meses" :key="m.v" :value="m.v">{{ m.l }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <BaseTable :headers="tableHeaders" :items="data?.items || []" :loading="isLoading">
      <template #cell-referencia="{ item }">
        <span class="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
          {{ formatCompetence(item.mes_referencia, item.ano_exercicio) }}
        </span>
      </template>

      <template #cell-orgao="{ item }">
        <span class="truncate max-w-[200px] inline-block" :title="item.nome_orgao">
          {{ item.nome_orgao }}
        </span>
      </template>

      <template #cell-valor_bruto="{ item }">
        <span class="font-bold text-slate-900">{{ formatCurrency(item.valor_bruto) }}</span>
      </template>

      <template #cell-valor_liquido="{ item }">
        <span class="text-green-600 font-semibold">{{ formatCurrency(item.valor_liquido) }}</span>
      </template>
    </BaseTable>

    <!-- Paginação -->
    <div v-if="data && data.pages > 1" class="flex items-center justify-between pt-4">
      <p class="text-sm text-slate-500">
        Mostrando <span class="font-bold text-slate-900">{{ data.items.length }}</span> de
        <span class="font-bold text-slate-900">{{ data.total }}</span> registros
      </p>

      <div class="flex gap-2">
        <BaseButton
          variant="outline"
          size="sm"
          :disabled="filters.page === 1"
          @click="setPage(filters.page! - 1)"
        >
          <ChevronLeft class="w-4 h-4 mr-1" /> Anterior
        </BaseButton>
        <div class="flex items-center px-4 text-sm font-bold text-slate-700 select-none">
          Página {{ filters.page }} de {{ data.pages }}
        </div>
        <BaseButton
          variant="outline"
          size="sm"
          :disabled="filters.page === data.pages"
          @click="setPage(filters.page! + 1)"
        >
          Próximo <ChevronRight class="w-4 h-4 ml-1" />
        </BaseButton>
      </div>
    </div>
  </div>
</template>
