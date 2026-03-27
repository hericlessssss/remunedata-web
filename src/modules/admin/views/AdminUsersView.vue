<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { 
  Search, 
  Key, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  History,
  AlertCircle
} from 'lucide-vue-next'
import { AdminService, type AdminUser } from '../services/admin.service'
import BaseButton from '@/shared/ui/BaseButton.vue'

const users = ref<AdminUser[]>([])
const totalUsers = ref(0)
const currentPage = ref(1)
const itemsPerPage = 10
const loading = ref(true)
const search = ref('')
const filterStatus = ref<'all' | 'active' | 'expired'>('all')

// Modal de Reset de Senha
const isResetModalOpen = ref(false)
const selectedUser = ref<AdminUser | null>(null)
const confirmEmail = ref('')
const isResetting = ref(false)

const fetchUsers = async () => {
  loading.value = true
  try {
    const data = await AdminService.getUsers(currentPage.value, itemsPerPage)
    users.value = data.items
    totalUsers.value = data.total
  } catch {
    // eslint-disable-next-line no-console
    console.error('Erro ao buscar usuários.')
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  if (!selectedUser.value || confirmEmail.value !== selectedUser.value.email) return
  
  isResetting.value = true
  try {
    await AdminService.resetPassword(selectedUser.value.id)
    window.alert('Link de recuperação enviado com sucesso!')
    isResetModalOpen.value = false
  } catch {
    window.alert('Erro ao processar solicitação.')
  } finally {
    isResetting.value = false
  }
}

const openResetModal = (user: AdminUser) => {
  selectedUser.value = user
  confirmEmail.value = ''
  isResetModalOpen.value = true
}

onMounted(fetchUsers)

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const matchesSearch = u.email.toLowerCase().includes(search.value.toLowerCase()) || u.id.includes(search.value)
    const matchesStatus = filterStatus.value === 'all' || u.status === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    expired: 'bg-red-500/10 text-red-400 border-red-500/20',
    canceled: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  }
  return styles[status] || styles.canceled
}

const formatDate = (date: string | null) => {
  if (!date) return 'Nunca'
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(date))
}
</script>

<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-4xl font-black text-white tracking-tighter uppercase italic">Gestão de <span class="text-blue-500">Usuários</span></h1>
        <p class="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Total de {{ totalUsers }} contas registradas</p>
      </div>

      <div class="flex items-center gap-3">
        <div class="relative group">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-white transition-colors" />
          <input 
            v-model="search"
            type="text" 
            placeholder="Buscar por e-mail ou ID..."
            class="pl-11 pr-4 py-3 bg-white/5 border border-white/5 rounded-2xl text-sm w-72 focus:bg-white/10 focus:border-white/10 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-white placeholder:font-bold placeholder:text-slate-600"
          />
        </div>
        
        <select 
          v-model="filterStatus"
          class="bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-sm font-bold text-slate-400 outline-none focus:bg-white/10 transition-all cursor-pointer"
        >
          <option value="all">Todos Status</option>
          <option value="active">Ativos</option>
          <option value="expired">Expirados</option>
        </select>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
      <div v-if="loading" class="p-20 flex flex-col items-center justify-center gap-4">
        <div class="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p class="text-slate-500 font-black uppercase tracking-widest text-xs">Carregando base de usuários...</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-white/5 bg-white/[0.02]">
              <th class="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Identificador / E-mail</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Plano Atual</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Expira em</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr v-for="user in filteredUsers" :key="user.id" class="group hover:bg-white/[0.02] transition-colors">
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center font-black text-xs text-white shadow-inner">
                    {{ user.email.substring(0, 2).toUpperCase() }}
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-black text-white leading-none mb-1">{{ user.email }}</span>
                    <span class="text-[10px] font-bold text-slate-500 uppercase tracking-tighter opacity-50">{{ user.id }}</span>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-2">
                  <ShieldCheck v-if="user.plan_name" class="w-4 h-4 text-blue-500" />
                  <span class="text-xs font-black text-slate-300">{{ user.plan_name || 'Nenhum' }}</span>
                </div>
              </td>
              <td class="px-8 py-6">
                <span 
                  class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border"
                  :class="getStatusBadge(user.status)"
                >
                  {{ user.status }}
                </span>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-2 text-slate-400">
                  <History class="w-3.5 h-3.5 opacity-50" />
                  <span class="text-xs font-bold">{{ formatDate(user.expires_at) }}</span>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-3">
                  <button 
                    class="p-2.5 rounded-xl bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all border border-white/5 group/btn"
                    title="Resetar Senha"
                    @click="openResetModal(user)"
                  >
                    <Key class="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button class="p-2.5 rounded-xl bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                    <MoreHorizontal class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-8 py-6 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Mostrando {{ filteredUsers.length }} de {{ totalUsers }} resultados
        </p>
        <div class="flex items-center gap-2">
          <button 
            class="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white disabled:opacity-30 disabled:hover:text-slate-500 transition-all"
            :disabled="currentPage === 1"
            @click="currentPage--; fetchUsers()"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
          <div class="px-4 py-2 bg-white/10 rounded-xl text-xs font-black text-white border border-white/10">
            {{ currentPage }}
          </div>
          <button 
            class="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white disabled:opacity-30 disabled:hover:text-slate-500 transition-all"
            :disabled="currentPage * itemsPerPage >= totalUsers"
            @click="currentPage++; fetchUsers()"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Reset Password Modal -->
    <Teleport to="body">
      <div v-if="isResetModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div 
          class="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300"
          @click="isResetModalOpen = false"
        ></div>
        
        <div class="relative bg-slate-900 border border-white/10 rounded-[3rem] p-12 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
          <div class="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20">
            <Key class="w-8 h-8 text-blue-500" />
          </div>
          
          <h2 class="text-3xl font-black text-white tracking-tighter mb-4 leading-none">Confirmar Reset?</h2>
          <p class="text-slate-400 text-sm font-bold leading-relaxed mb-8">
            Para garantir a segurança, digite o e-mail do usuário abaixo (<span class="text-white italic">{{ selectedUser?.email }}</span>) para confirmar o disparo do link de recuperação.
          </p>

          <div class="space-y-6">
            <input 
              v-model="confirmEmail"
              type="text" 
              placeholder="Digite o e-mail para confirmar"
              class="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm outline-none focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 transition-all text-white placeholder:text-slate-600 font-bold"
            />

            <div class="grid grid-cols-2 gap-4">
              <BaseButton variant="outline" class="w-full" @click="isResetModalOpen = false">Cancelar</BaseButton>
              <BaseButton 
                variant="gradient" 
                class="w-full" 
                :disabled="confirmEmail !== selectedUser?.email || isResetting"
                :loading="isResetting"
                @click="handleResetPassword"
              >
                Confirmar
              </BaseButton>
            </div>
          </div>

          <div class="mt-8 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start gap-4">
            <AlertCircle class="w-5 h-5 text-amber-500 shrink-0" />
            <p class="text-[10px] text-amber-500/80 font-bold leading-tight uppercase tracking-tighter">
              Essa ação enviará um e-mail de segurança para o endereço cadastrado. O usuário perderá o acesso atual se redefinir a senha.
            </p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
