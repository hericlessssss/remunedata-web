<script setup lang="ts">
import { computed } from 'vue'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  class?: ClassValue
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  class: '',
  disabled: false,
  type: 'button',
})

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const variantStyles = {
  primary: 'bg-slate-800 text-white hover:bg-slate-700 active:bg-slate-900',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300',
  outline: 'border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-900',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-800',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

const baseStyles =
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50'

const classes = computed(() => {
  return cn(baseStyles, variantStyles[props.variant], sizeStyles[props.size], props.class)
})
</script>

<template>
  <button :type="type" :disabled="disabled" :class="classes" @click="$emit('click', $event)">
    <slot />
  </button>
</template>
