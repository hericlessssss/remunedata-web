<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  title: string
  value?: string | number
  description?: string
  icon?: Component
}

defineProps<Props>()
</script>

<template>
  <div
    class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
  >
    <div class="flex items-start justify-between mb-2">
      <div class="flex-1 min-w-0">
        <h3 class="text-sm font-medium text-slate-500 uppercase tracking-wider truncate">{{ title }}</h3>
        <slot>
          <p v-if="value !== undefined" class="text-2xl font-bold text-slate-900 mt-1 truncate">{{ value }}</p>
        </slot>
      </div>
      <div v-if="icon" class="p-2 bg-slate-50 rounded-lg text-slate-600 flex-shrink-0 ml-4">
        <component :is="icon" class="w-5 h-5" />
      </div>
    </div>
    <div v-if="description" class="text-sm text-slate-500">
      {{ description }}
    </div>
    <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-slate-100">
      <slot name="footer" />
    </div>
  </div>
</template>
