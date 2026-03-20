<script setup lang="ts">
import { computed } from 'vue'
import { Search, ChevronLeft, ChevronRight, FileDown } from 'lucide-vue-next'
import { useRemunerationSearch } from '../composables/useRemunerationSearch'
import { RemunerationService } from '../services/remuneration.service'
import { formatCurrency } from '@/core/formatters/currency'
import { formatCompetence } from '@/core/formatters/date'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseTable from '@/shared/ui/BaseTable.vue'

const { 
  filters, 
  appliedFilters,
  data, 
  isFetching, 
  setPage, 
  setOrdering,
  applySearch 
} = useRemunerationSearch()

const handleExport = async (type: 'xlsx' | 'csv') => {
  try {
    const url = await RemunerationService.getExportUrl(type)
    window.open(url, '_blank')
  } catch {
    window.alert('Erro ao gerar exportação. Verifique se existem execuções finalizadas.')
  }
}

const tableHeaders = [
  { key: 'nome_servidor', label: 'Servidor', sortable: true },
  { key: 'orgao', label: 'Órgão', class: 'hidden lg:table-cell', sortable: true },
  { key: 'cargo', label: 'Cargo', class: 'hidden md:table-cell', sortable: true },
  { key: 'referencia', label: 'Referência' },
  { key: 'valor_bruto', label: 'Vlr. Bruto', sortable: true },
  { key: 'valor_liquido', label: 'Vlr. Líquido', sortable: true },
]

const sortKey = computed(() => {
  const o = appliedFilters.value.ordering || ''
  return o.startsWith('-') ? o.substring(1) : o
})

const sortOrder = computed(() => {
  const o = appliedFilters.value.ordering || ''
  if (!o) return undefined
  return o.startsWith('-') ? 'desc' : 'asc'
})

const isLoading = computed(() => isFetching.value)

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
        <div class="flex gap-2">
          <BaseButton variant="outline" class="gap-2" @click="handleExport('xlsx')">
            <FileDown class="w-4 h-4" />
            Planilha (1k)
          </BaseButton>
          <BaseButton variant="outline" class="gap-2" @click="handleExport('csv')">
            <FileDown class="w-4 h-4" />
            CSV (5k)
          </BaseButton>
        </div>
      </div>
  
      <!-- Filtros -->
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-6 gap-4">
          <!-- Nome -->
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-400 uppercase">Nome do Servidor</label>
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                v-model="filters.nome"
                type="text"
                placeholder="Ex: FRANCISCO..."
                class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all font-medium"
                @keyup.enter="applySearch"
              />
            </div>
          </div>
  
          <!-- CPF -->
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-400 uppercase">CPF</label>
            <input
              v-model="filters.cpf"
              type="text"
              placeholder="***.000.***-**"
              class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all font-medium"
              @keyup.enter="applySearch"
            />
          </div>
  
          <!-- Cargo -->
        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-400 uppercase">Cargo</label>
          <input
            v-model="filters.cargo"
            type="text"
            placeholder="Ex: Delegado..."
            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all font-medium"
            @keyup.enter="applySearch"
          />
        </div>

        <!-- Órgão -->
        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-400 uppercase">Órgão</label>
          <input
            v-model="filters.orgao"
            type="text"
            placeholder="Ex: Policia..."
            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all font-medium"
            @keyup.enter="applySearch"
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
        <div class="space-y-1 flex flex-col">
          <label class="text-xs font-bold text-slate-400 uppercase">Mês</label>
          <div class="flex gap-2">
            <select
              v-model="filters.mes"
              class="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all font-medium"
            >
              <option v-for="m in meses" :key="m.v" :value="m.v">{{ m.l }}</option>
            </select>
            
            <BaseButton :loading="isFetching" class="px-6 gap-2" @click="applySearch">
              <Search class="w-4 h-4" />
              Pesquisar
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <BaseTable 
      :headers="tableHeaders" 
      :items="data?.items || []" 
      :is-loading="isLoading"
      :sort-key="sortKey"
      :sort-order="sortOrder"
      @sort="setOrdering"
    >
      <template #cell-nome_servidor="{ item }">
        <RouterLink
          :to="{
            name: 'remuneration-detail',
            params: { id: item.id },
            query: {
              nome: item.nome_servidor,
              cpf: item.cpf_servidor,
              ano: item.ano_exercicio,
              mes: item.mes_referencia,
            },
          }"
          class="font-bold text-slate-900 hover:text-slate-600 hover:underline decoration-slate-300 underline-offset-4"
        >
          {{ item.nome_servidor }}
        </RouterLink>
      </template>

      <template #cell-referencia="{ item }">
        <span class="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
          {{ formatCompetence(item.mes_referencia, item.ano_exercicio) }}
        </span>
      </template>

      <template #cell-orgao="{ item }">
        <span class="truncate max-w-[200px] inline-block" :title="item.nome_orgao || undefined">
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
