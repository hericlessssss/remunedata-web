<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Search, X, Check } from 'lucide-vue-next'

interface Props {
  modelValue?: string
  options: string[]
  placeholder?: string
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Selecione uma opção...',
  label: '',
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const searchQuery = ref('')
const containerRef = ref<HTMLElement | null>(null)

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  const query = searchQuery.value.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  
  return props.options.filter(opt => 
    opt.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .includes(query)
  )
})

function selectOption(option: string) {
  emit('update:modelValue', option)
  emit('change', option)
  isOpen.value = false
  searchQuery.value = ''
}

function clearSelection() {
  emit('update:modelValue', '')
  emit('change', '')
  searchQuery.value = ''
}

function handleClickOutside(event: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div ref="containerRef" class="space-y-1 relative">
    <label v-if="label" class="text-xs font-bold text-slate-400 uppercase ml-1">{{ label }}</label>
    
    <div 
      class="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-4 pr-10 text-sm font-medium cursor-pointer flex items-center justify-between min-h-[40px] transition-all"
      :class="isOpen ? 'ring-2 ring-slate-400 border-slate-300' : 'hover:border-slate-300'"
      @click="isOpen = !isOpen"
    >
      <span v-if="modelValue" class="text-slate-900 truncate">{{ modelValue }}</span>
      <span v-else class="text-slate-400">{{ placeholder }}</span>
      
      <div class="absolute right-2 flex items-center gap-1">
        <button 
          v-if="modelValue" 
          class="p-1 hover:bg-slate-200 rounded-md text-slate-400 transition-colors"
          @click.stop="clearSelection"
        >
          <X class="w-3.5 h-3.5" />
        </button>
        <ChevronDown 
          class="w-4 h-4 text-slate-400 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        />
      </div>
    </div>

    <!-- Dropdown -->
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div 
        v-if="isOpen"
        class="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div class="p-2 border-b border-slate-50 bg-slate-50/50">
          <div class="relative">
            <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Pesquisar..."
              class="w-full pl-8 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 font-medium"
              @click.stop
            />
          </div>
        </div>

        <ul class="max-h-60 overflow-y-auto py-1 custom-scrollbar">
          <li 
            v-for="option in filteredOptions" 
            :key="option"
            class="px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between group"
            :class="modelValue === option ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'"
            @click="selectOption(option)"
          >
            <span class="truncate">{{ option }}</span>
            <Check v-if="modelValue === option" class="w-4 h-4 text-white" />
          </li>
          <li v-if="filteredOptions.length === 0" class="px-4 py-8 text-center text-xs text-slate-400 italic">
            Nenhuma opção encontrada
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
