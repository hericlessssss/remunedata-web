<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LayoutDashboard, Search, Database, Menu, X, LogOut, User, Crown, Zap } from 'lucide-vue-next'
import { useAuthStore } from '@/core/auth/authStore'
import { useSubscriptionStore } from '@/modules/subscriptions/store/subscriptionStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const subStore = useSubscriptionStore()
const isSidebarOpen = ref(false)

// Fecha a sidebar ao mudar de rota no mobile
watch(() => route.path, () => {
  isSidebarOpen.value = false
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const handleLogout = async () => {
  await authStore.signOut()
  router.push({ name: 'login' })
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
          <div class="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
            <span class="font-bold text-lg">R</span>
          </div>
          <h1 class="font-serif font-bold text-xl text-slate-800 tracking-tight">RemuneData</h1>
        </div>
        <button class="lg:hidden text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-50 transition-colors" @click="isSidebarOpen = false">
          <X class="w-5 h-5" />
        </button>
      </div>

      <nav class="flex-1 p-4 flex flex-col gap-2">
        <RouterLink
          to="/dashboard"
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-all duration-200 group"
          active-class="bg-slate-900! text-white! font-semibold shadow-lg shadow-slate-900/10"
        >
          <LayoutDashboard class="w-5 h-5 group-hover:scale-110 transition-transform" />
          Dashboard
        </RouterLink>
        <RouterLink
          to="/remuneration"
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-all duration-200 group"
          active-class="bg-slate-900! text-white! font-semibold shadow-lg shadow-slate-900/10"
        >
          <Search class="w-5 h-5 group-hover:scale-110 transition-transform" />
          Consulta
        </RouterLink>
        <RouterLink
          to="/executions"
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-all duration-200 group"
          active-class="bg-slate-900! text-white! font-semibold shadow-lg shadow-slate-900/10"
        >
          <Database class="w-5 h-5 group-hover:scale-110 transition-transform" />
          Execuções
        </RouterLink>

        <!-- Premium Upsell / Status in Sidebar -->
        <div class="mt-4 px-4">
          <RouterLink 
            v-if="!subStore.isActive"
            to="/subscriptions/plans"
            class="flex flex-col gap-2 p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all group"
          >
            <div class="flex items-center gap-2">
              <Zap class="w-4 h-4 text-yellow-300 fill-current" />
              <span class="text-xs font-black uppercase tracking-widest">Seja Premium</span>
            </div>
            <p class="text-[10px] leading-tight text-blue-100 font-medium opacity-90">Libere a consulta pública e filtros ilimitados agora.</p>
          </RouterLink>
          <div 
            v-else
            class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100"
          >
            <div class="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Crown class="w-4 h-4 transition-transform hover:rotate-12" />
            </div>
            <div>
              <p class="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Plano Ativo</p>
              <p class="text-xs font-bold text-slate-900 leading-none">{{ subStore.currentPlan }}</p>
            </div>
          </div>
        </div>
      </nav>

      <div class="p-4 border-t border-slate-100 mb-2">
        <p class="text-[10px] text-slate-400 font-mono text-center uppercase tracking-widest font-medium">
          v0.3.0 - Beta
        </p>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-x-hidden transition-all duration-300 lg:ml-64">
      <!-- Navbar/Header -->
      <header
        class="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-xs"
      >
        <div class="flex items-center gap-4">
          <button
            class="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
            @click="toggleSidebar"
          >
            <Menu class="w-6 h-6" />
          </button>
          <div class="hidden sm:block text-xs text-slate-400 font-semibold uppercase tracking-wider">
            DF / Portal da Transparência
          </div>
        </div>

        <div class="flex items-center gap-4">
          <!-- Premium Badge Hook -->
          <RouterLink 
            v-if="!subStore.isActive"
            to="/subscriptions/plans"
            class="hidden md:flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Zap class="w-3 h-3 fill-current text-yellow-400" />
            Fazer Upgrade
          </RouterLink>

          <!-- User Info & Logout -->
          <div v-if="authStore.user" class="flex items-center gap-3 pl-4 border-l border-slate-100">
            <div class="hidden md:block text-right">
              <p class="text-xs font-semibold text-slate-800 leading-none mb-1 flex items-center justify-end gap-1">
                {{ authStore.user.email?.split('@')[0] }}
                <Crown v-if="subStore.isActive" class="w-3 h-3 text-blue-500" />
              </p>
              <p class="text-[10px] text-slate-400 leading-none">{{ authStore.user.email }}</p>
            </div>
            <div class="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 ring-4 ring-white shadow-sm overflow-hidden">
              <User class="w-4 h-4" />
            </div>
            <button
              class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Sair"
              @click="handleLogout"
            >
              <LogOut class="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <!-- View Content -->
      <section class="p-4 lg:p-8 max-w-7xl w-full mx-auto">
        <RouterView />
      </section>
    </main>
  </div>
</template>
