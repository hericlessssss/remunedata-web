<script setup lang="ts" generic="T">
import { ChevronUp, ChevronDown } from 'lucide-vue-next'
import BaseLoading from './BaseLoading.vue'

interface Props {
  items: T[]
  headers: { key: string; label: string; class?: string; sortable?: boolean }[]
  isLoading?: boolean
  sortKey?: string
  sortOrder?: 'asc' | 'desc'
}

defineProps<Props>()
defineEmits<{
  (e: 'row-click', item: T): void
  (e: 'sort', key: string): void
}>()
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse" aria-label="Tabela de dados">
        <thead class="bg-slate-50/50 border-b border-slate-100">
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"
            :class="[
              header.class,
              { 'cursor-pointer hover:bg-slate-100/50 transition-colors select-none': header.sortable }
            ]"
            @click="header.sortable ? $emit('sort', header.key) : null"
          >
            <div class="flex items-center gap-1.5">
              <slot :name="`header-${header.key}`" :header="header">
                {{ header.label }}
              </slot>
              
              <div v-if="header.sortable" class="flex flex-col text-slate-300">
                <ChevronUp 
                  class="w-3 h-3 -mb-1" 
                  :class="{ 'text-blue-600': sortKey === header.key && sortOrder === 'asc' }" 
                />
                <ChevronDown 
                  class="w-3 h-3" 
                  :class="{ 'text-blue-600': sortKey === header.key && sortOrder === 'desc' }" 
                />
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        <!-- Loading State -->
        <tr v-if="isLoading">
          <td :colspan="headers.length">
            <BaseLoading label="Buscando registros..." />
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-else-if="items.length === 0" class="h-64 text-center">
          <td :colspan="headers.length" class="px-6 py-4">
            <div class="flex flex-col items-center justify-center gap-2">
              <span class="text-slate-400 font-medium text-lg"
                >Nenhum registro encontrado</span
              >
              <p class="text-sm text-slate-300">Tente ajustar seus critérios de busca.</p>
            </div>
          </td>
        </tr>

        <!-- Data State -->
        <template v-for="(item, index) in items" :key="index">
          <tr
            class="hover:bg-slate-50 transition-colors group cursor-pointer"
            @click="$emit('row-click', item)"
          >
            <td
              v-for="header in headers"
              :key="header.key"
              class="px-6 py-4 text-sm text-slate-600 font-medium group-hover:text-slate-900 border-b border-slate-50"
              :class="header.class"
            >
              <slot :name="`cell-${header.key}`" :item="item" :index="index">
                {{ (item as any)[header.key] }}
              </slot>
            </td>
          </tr>
          <slot name="row-after" :item="item" :index="index"></slot>
        </template>
      </tbody>
    </table>
  </div>
  </div>
</template>
