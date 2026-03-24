<script setup lang="ts">
interface Props {
  width?: string
  height?: string
  rounded?: string
  class?: string
}

withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '20px',
  rounded: 'rounded-md',
  class: '',
})
</script>

<template>
  <div 
    class="bg-slate-200 animate-pulse" 
    :class="[rounded, $props.class]"
    :style="{ width, height }"
  ></div>
</template>
