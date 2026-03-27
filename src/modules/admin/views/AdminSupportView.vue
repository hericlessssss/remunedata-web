<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { 
  Search, 
  MessageSquare, 
  Send, 
  User, 
  CheckCircle2,
  Clock,
  MoreVertical,
  ChevronLeft
} from 'lucide-vue-next'
import { AdminService, type SupportConversation, type SupportMessage } from '../services/admin.service'
import BaseButton from '@/shared/ui/BaseButton.vue'

const conversations = ref<SupportConversation[]>([])
const selectedUserId = ref<string | null>(null)
const selectedUserEmail = ref('')
const messages = ref<SupportMessage[]>([])
const newMessage = ref('')
const loadingConversations = ref(true)
const loadingMessages = ref(false)
const search = ref('')
const scrollContainer = ref<HTMLElement | null>(null)

const fetchConversations = async () => {
  loadingConversations.value = true
  try {
    conversations.value = await AdminService.getConversations()
  } catch {
    // eslint-disable-next-line no-console
    console.error('Erro ao buscar conversas.')
  } finally {
    loadingConversations.value = false
  }
}

const selectConversation = async (conv: SupportConversation) => {
  selectedUserId.value = conv.user_id
  selectedUserEmail.value = conv.email
  loadingMessages.value = true
  
  try {
    messages.value = await AdminService.getHistory(conv.user_id)
    await nextTick()
    scrollToBottom()
  } catch {
    // eslint-disable-next-line no-console
    console.error('Erro ao buscar histórico.')
  } finally {
    loadingMessages.value = false
  }
}

const sendMessage = async () => {
  if (!selectedUserId.value || !newMessage.value.trim()) return

  const content = newMessage.value
  newMessage.value = ''

  try {
    const msg = await AdminService.reply(selectedUserId.value, content)
    messages.value.push(msg)
    await nextTick()
    scrollToBottom()
  } catch {
    window.alert('Erro ao enviar mensagem.')
  }
}

const scrollToBottom = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  }
}

onMounted(fetchConversations)

watch(messages, () => {
  nextTick(scrollToBottom)
}, { deep: true })

const formatTime = (date: string) => {
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(date))
}

const filteredConversations = computed(() => {
  return conversations.value.filter(c => 
    c.email.toLowerCase().includes(search.value.toLowerCase()) || 
    c.last_message.toLowerCase().includes(search.value.toLowerCase())
  )
})

import { computed } from 'vue'
</script>

<template>
  <div class="h-[calc(100vh-8rem)] flex gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <!-- Conversations List -->
    <div class="w-96 flex flex-col bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl shrink-0">
      <div class="p-8 border-b border-white/5 bg-white/[0.02]">
        <h2 class="text-2xl font-black text-white tracking-tighter mb-6 flex items-center gap-3 italic">
          Inbox <span class="text-blue-500">Suporte</span>
        </h2>
        
        <div class="relative group">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-white transition-colors" />
          <input 
            v-model="search"
            type="text" 
            placeholder="Buscar conversa..."
            class="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/5 rounded-2xl text-sm focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-white placeholder:text-slate-600 font-bold"
          />
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        <div v-if="loadingConversations" class="p-8 flex flex-col items-center gap-4">
          <div class="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sincronizando chats...</p>
        </div>

        <button 
          v-for="conv in filteredConversations" 
          :key="conv.user_id"
          class="w-full flex items-center gap-4 p-4 rounded-3xl transition-all text-left border border-transparent group"
          :class="[
            selectedUserId === conv.user_id 
              ? 'bg-gradient-to-br from-blue-600/90 to-purple-800/90 shadow-xl border-white/10' 
              : 'hover:bg-white/5'
          ]"
          @click="selectConversation(conv)"
        >
          <div class="relative">
            <div class="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-sm text-white shadow-inner">
              {{ conv.email.substring(0, 2).toUpperCase() }}
            </div>
            <div v-if="conv.unread_count > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-black text-white border-2 border-slate-900 animate-pulse">
              {{ conv.unread_count }}
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-center mb-1">
              <p class="text-[12px] font-black tracking-tight truncate" :class="selectedUserId === conv.user_id ? 'text-white' : 'text-slate-200'">{{ conv.email }}</p>
              <span class="text-[8px] font-bold uppercase tracking-widest opacity-50">{{ formatTime(conv.updated_at) }}</span>
            </div>
            <p class="text-[11px] font-medium truncate" :class="selectedUserId === conv.user_id ? 'text-white/70' : 'text-slate-500'">{{ conv.last_message }}</p>
          </div>
        </button>
      </div>
    </div>

    <!-- Chat Window -->
    <div class="flex-1 flex flex-col bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
      <template v-if="selectedUserId">
        <!-- Chat Header -->
        <div class="px-10 h-24 flex items-center justify-between border-b border-white/5 bg-white/[0.02] relative z-10 shadow-lg">
          <div class="flex items-center gap-4">
            <BaseButton variant="ghost" size="sm" class="md:hidden" @click="selectedUserId = null">
              <ChevronLeft class="w-5 h-5" />
            </BaseButton>
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <User class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-black text-white leading-none mb-1">{{ selectedUserEmail }}</h3>
              <div class="flex items-center gap-1.5">
                <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span class="text-[8px] font-black uppercase tracking-widest text-emerald-500">Cliente Online</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button class="p-2 text-slate-500 hover:text-white transition-colors"><MoreVertical class="w-5 h-5" /></button>
          </div>
        </div>

        <!-- Messages Area -->
        <div 
          ref="scrollContainer"
          class="flex-1 overflow-y-auto px-10 py-12 space-y-8 custom-scrollbar bg-slate-950/20"
        >
          <div v-if="loadingMessages" class="h-full flex flex-col items-center justify-center gap-4">
            <div class="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recuperando histórico histórico...</p>
          </div>

          <template v-else>
            <div 
              v-for="msg in messages" 
              :key="msg.id"
              class="flex"
              :class="[msg.is_from_admin ? 'justify-end' : 'justify-start']"
            >
              <div 
                class="max-w-[70%] space-y-2 group"
                :class="[msg.is_from_admin ? 'items-end' : 'items-start']"
              >
                <!-- Timestamp Top -->
                <div class="flex items-center gap-2 mb-1" :class="[msg.is_from_admin ? 'flex-row-reverse' : 'flex-row']">
                  <span class="text-[8px] font-black uppercase text-slate-600 opacity-60 group-hover:opacity-100 transition-opacity">{{ formatTime(msg.created_at) }}</span>
                </div>

                <!-- Bubble -->
                <div 
                  class="px-6 py-4 rounded-[2rem] text-sm font-bold shadow-2xl relative"
                  :class="[
                    msg.is_from_admin 
                      ? 'bg-white text-slate-900 rounded-tr-none' 
                      : 'bg-slate-800 text-slate-100 border border-white/5 rounded-tl-none'
                  ]"
                >
                  {{ msg.content }}
                  
                  <!-- Read Check (Admin only) -->
                  <div v-if="msg.is_from_admin" class="absolute -bottom-5 right-2 flex items-center gap-1 opacity-50">
                    <CheckCircle2 v-if="msg.is_read" class="w-3 h-3 text-blue-500" />
                    <Clock v-else class="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Input Area -->
        <div class="p-10 border-t border-white/5 bg-white/[0.02]">
          <form class="flex gap-4" @submit.prevent="sendMessage">
            <div class="flex-1 relative group">
              <input 
                v-model="newMessage"
                type="text" 
                placeholder="Escreva sua resposta..."
                class="w-full pl-6 pr-14 py-4 bg-white/5 border border-white/5 rounded-3xl text-sm outline-none focus:bg-white/10 focus:ring-8 focus:ring-blue-500/5 transition-all text-white font-bold placeholder:text-slate-600"
              />
              <button 
                type="submit"
                class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl bg-white text-slate-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-xl"
                :disabled="!newMessage.trim()"
              >
                <Send class="w-4 h-4" />
              </button>
            </div>
          </form>
          <p class="mt-4 text-[8px] font-black text-slate-600 uppercase tracking-widest text-center opacity-50">Atalho: Enter para enviar</p>
        </div>
      </template>

      <!-- Empty State -->
      <div v-else class="h-full flex flex-col items-center justify-center p-12 text-center">
        <div class="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
          <MessageSquare class="w-10 h-10 text-slate-700" />
        </div>
        <h3 class="text-3xl font-black text-white tracking-tighter mb-2">Central de <span class="text-blue-500">Comunicação</span></h3>
        <p class="text-slate-500 text-sm font-bold max-w-sm leading-relaxed mb-8 uppercase tracking-tighter">
          Selecione uma conversa ao lado para iniciar o atendimento. Todas as mensagens são registradas para auditoria.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
