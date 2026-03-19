<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { LayoutDashboard, Search, Database, Menu, X } from 'lucide-vue-next'

const route = useRoute()
const isSidebarOpen = ref(false)

// Fecha a sidebar ao mudar de rota no mobile
watch(() => route.path, () => {
  isSidebarOpen.value = false
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex">
    <!-- Sidebar Overlay Mobile -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
      @click="isSidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside
      class="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 shadow-sm z-50 transition-transform duration-300 lg:translate-x-0"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="p-6 border-b border-slate-100 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white">
            <span class="font-bold text-lg">R</span>
          </div>
          <h1 class="font-serif font-bold text-xl text-slate-800">RemuneData</h1>
        </div>
        <button class="lg:hidden text-slate-400 hover:text-slate-600" @click="isSidebarOpen = false">
          <X class="w-5 h-5" />
        </button>
      </div>

      <nav class="flex-1 p-4 flex flex-col gap-2">
        <RouterLink
          to="/dashboard"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          active-class="bg-slate-100! text-slate-900! font-semibold"
        >
          <LayoutDashboard class="w-5 h-5" />
          Dashboard
        </RouterLink>
        <RouterLink
          to="/remuneration"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          active-class="bg-slate-100! text-slate-900! font-semibold"
        >
          <Search class="w-5 h-5" />
          Consulta
        </RouterLink>
        <RouterLink
          to="/executions"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          active-class="bg-slate-100! text-slate-900! font-semibold"
        >
          <Database class="w-5 h-5" />
          Execuções
        </RouterLink>
      </nav>

      <div class="p-4 border-t border-slate-100 mb-2">
        <p class="text-[10px] text-slate-400 font-mono text-center uppercase tracking-widest">
          v0.1.0 - Alpha
        </p>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-x-hidden transition-all duration-300 lg:ml-64">
      <!-- Navbar/Header -->
      <header
        class="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-sm"
      >
        <div class="flex items-center gap-4">
          <button
            class="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
            @click="toggleSidebar"
          >
            <Menu class="w-6 h-6" />
          </button>
          <div class="hidden sm:block text-sm text-slate-500 font-medium">
            DF / Portal da Transparência
          </div>
        </div>

        <div class="flex items-center gap-4">
          <span
            class="text-[10px] sm:text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold uppercase tracking-wider"
          >
            Sistema Online
          </span>
        </div>
      </header>

      <!-- View Content -->
      <section class="p-4 lg:p-8 max-w-7xl w-full mx-auto">
        <RouterView />
      </section>
    </main>
  </div>
</template>
