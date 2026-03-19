<script setup lang="ts" generic="T">
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
  <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse" aria-label="Tabela de dados">
        <thead class="bg-slate-50/50 border-b border-slate-100">
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"
            :class="header.class"
          >
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        <!-- Loading State -->
        <template v-if="isLoading">
          <tr v-for="i in 8" :key="i" class="animate-pulse">
            <td v-for="header in headers" :key="header.key" class="px-6 py-4">
              <div class="h-4 bg-slate-100 rounded w-full"></div>
            </td>
          </tr>
        </template>

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
        <tr
          v-for="(item, index) in items"
          v-else
          :key="index"
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
      </tbody>
    </table>
  </div>
  </div>
</template>
