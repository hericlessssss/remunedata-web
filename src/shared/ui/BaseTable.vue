<script setup lang="ts" generic="T">
import BaseLoading from './BaseLoading.vue'

interface Props {
  items: T[]
  headers: { key: string; label: string; class?: string }[]
  isLoading?: boolean
}

defineProps<Props>()
defineEmits<{
  (e: 'row-click', item: T): void
}>()
</script>

<template>
  <div class="space-y-4">
    <!-- Desktop Table -->
    <div class="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse" aria-label="Tabela de dados">
          <thead class="bg-slate-50/50 border-b border-slate-100">
          <tr>
            <th
              v-for="header in headers"
              :key="header.key"
              class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider h-12"
              :class="header.class"
            >
              <div class="flex items-center gap-1.5">
                <slot :name="`header-${header.key}`" :header="header">
                  {{ header.label }}
                </slot>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-100">
          <!-- Loading State (Desktop) -->
          <tr v-if="isLoading" class="h-64">
            <td :colspan="headers.length">
              <BaseLoading label="Buscando registros..." />
            </td>
          </tr>
  
          <!-- Empty State (Desktop) -->
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
  
          <!-- Data State (Desktop) -->
          <template v-for="(item, index) in items" v-else :key="index">
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

  <!-- Mobile Cards -->
  <div class="md:hidden space-y-4">
    <!-- Loading State (Mobile) -->
    <div v-if="isLoading" class="flex flex-col gap-4">
      <div v-for="i in 3" :key="i" class="bg-white p-4 rounded-xl border border-slate-200 animate-pulse h-32"></div>
    </div>

    <!-- Empty State (Mobile) -->
    <div v-else-if="items.length === 0" class="bg-white p-12 rounded-xl border border-slate-200 text-center">
      <span class="text-slate-400 font-medium">Nenhum registro encontrado</span>
    </div>

    <!-- Data State (Mobile) -->
    <div 
      v-for="(item, index) in items" 
      v-else 
      :key="index"
      class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm active:bg-slate-50 transition-colors"
      @click="$emit('row-click', item)"
    >
      <div class="flex flex-col gap-3">
        <div v-for="header in headers" :key="header.key" class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ header.label }}</label>
          <div class="text-sm text-slate-900 font-medium font-serif">
            <slot :name="`cell-${header.key}`" :item="item" :index="index">
              {{ (item as any)[header.key] }}
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
