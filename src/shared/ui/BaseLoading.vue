<script setup lang="ts">
interface Props {
  fullScreen?: boolean
  label?: string
}

withDefaults(defineProps<Props>(), {
  fullScreen: false,
  label: 'Carregando dados...'
})
</script>

<template>
  <div
    :class="[
      'flex flex-col items-center justify-center gap-4 transition-all duration-300',
      fullScreen ? 'fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm' : 'h-full w-full min-h-[300px]'
    ]"
  >
    <div class="relative">
      <!-- Círculo externo (track) -->
      <div class="w-16 h-16 border-4 border-slate-100 rounded-full"></div>
      <!-- Círculo animado (spinner) -->
      <div class="absolute top-0 left-0 w-16 h-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      
      <!-- Efeito de pulsação no centro -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
    </div>
    
    <p v-if="label" class="text-slate-500 font-medium animate-pulse text-sm">
      {{ label }}
    </p>
  </div>
</template>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 0.8s linear infinite;
}
</style>
