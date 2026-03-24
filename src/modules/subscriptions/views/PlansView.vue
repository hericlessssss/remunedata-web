<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Rocket, Star, ShieldCheck, ArrowRight } from 'lucide-vue-next'

const route = useRoute()
import PlansGrid from '../components/PlansGrid.vue'
import CheckoutForm from '../components/CheckoutForm.vue'
import { SubscriptionService, type Plan } from '../services/subscription.service'
import { useAuthStore } from '@/core/auth/authStore'
import { useSubscriptionStore } from '../store/subscriptionStore'

const authStore = useAuthStore()
const subStore = useSubscriptionStore()

const selectedPlan = ref<Plan | null>(null)
const isCheckingOut = ref(false)
const error = ref('')

const isForbidden = computed(() => route.query.redirect === 'forbidden')

const handlePlanSelect = (plan: Plan) => {
  if (!authStore.user) {
    // Redireciona para login se não estiver autenticado
    window.location.href = `/auth/login?redirect=/subscriptions/plans`
    return
  }
  selectedPlan.value = plan
}

const handleCheckoutSubmit = async (formData: { name: string, tax_id: string, cellphone: string }) => {
  if (!selectedPlan.value || !authStore.user) return

  isCheckingOut.value = true
  error.value = ''

  try {
    const { checkout_url } = await SubscriptionService.createCheckout({
      plan_slug: selectedPlan.value.slug,
      name: formData.name,
      email: authStore.user.email || '',
      cellphone: formData.cellphone.replace(/\D/g, ''),
      tax_id: formData.tax_id.replace(/\D/g, ''),
    })

    // Redireciona para o AbacatePay
    window.location.href = checkout_url
  } catch (err: unknown) {
    const axiosError = err as { response?: { data?: { detail?: string } } }
    error.value = axiosError.response?.data?.detail || 'Erro ao iniciar checkout. Tente novamente.'
    isCheckingOut.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 pt-12 pb-24 px-4 overflow-hidden relative">
    <!-- Decoração de Fundo -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full -z-10"></div>
    
    <!-- Cabeçalho -->
    <div class="max-w-4xl mx-auto text-center mb-16 px-4">
      <div v-if="isForbidden" class="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium animate-in slide-in-from-top-2 duration-300">
        🔒 <span class="font-bold">Acesso Restrito:</span> Você precisa de uma assinatura ativa para visualizar os dados de remuneração.
      </div>
      
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
        <Star class="w-3 h-3 fill-current" />
        Upgrade sua experiência
      </div>
      <h1 class="text-4xl md:text-6xl font-black text-slate-900 font-serif tracking-tight mb-6">
        Escolha o plano ideal para <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 italic">sua jornada.</span>
      </h1>
      <p class="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
        Acesso ilimitado à ferramenta mais poderosa de transparência do Distrito Federal.
        Simples, seguro e transparente.
      </p>
    </div>

    <!-- Modais / Views Condicionais -->
    <div class="flex justify-center items-start min-h-[500px]">
      <!-- Estado: Já Assinante -->
      <div v-if="subStore.isActive" class="max-w-md w-full bg-white rounded-3xl p-10 border border-slate-200 text-center shadow-xl animate-in zoom-in-95 duration-500">
        <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck class="w-10 h-10" />
        </div>
        <h2 class="text-2xl font-bold text-slate-900 mb-2">Assinatura Ativa!</h2>
        <p class="text-slate-500 mb-8">
          Você já possui o plano <span class="font-bold text-slate-900">{{ subStore.currentPlan }}</span> ativo. 
          Aproveite o acesso ilimitado aos dados.
        </p>
        <RouterLink to="/dashboard">
          <BaseButton class="w-full py-4 rounded-xl">Ir para o Dashboard</BaseButton>
        </RouterLink>
      </div>

      <div v-else-if="!selectedPlan" class="w-full animate-in slide-in-from-bottom-4 duration-500">
        <PlansGrid @select="handlePlanSelect" />
      </div>

      <div v-else class="w-full flex justify-center animate-in zoom-in-95 duration-300">
        <CheckoutForm 
          :plan-name="selectedPlan.name"
          :loading="isCheckingOut"
          @submit="handleCheckoutSubmit"
          @cancel="selectedPlan = null"
        />
      </div>
    </div>

    <!-- Rodapé Informativo -->
    <div class="max-w-6xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-slate-200 pt-12">
      <div class="flex flex-col items-center text-center px-4">
        <div class="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 mb-4">
          <ShieldCheck class="w-6 h-6" />
        </div>
        <h4 class="font-bold text-slate-900 mb-2">Checkout Seguro</h4>
        <p class="text-sm text-slate-500">Pagamentos criptografados processados via AbacatePay com total segurança.</p>
      </div>
      <div class="flex flex-col items-center text-center px-4">
        <div class="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 mb-4">
          <Rocket class="w-6 h-6" />
        </div>
        <h4 class="font-bold text-slate-900 mb-2">Acesso Instantâneo</h4>
        <p class="text-sm text-slate-500">Após a confirmação do pagamento (PIX ou Cartão), seu acesso é liberado na hora.</p>
      </div>
      <div class="flex flex-col items-center text-center px-4">
        <div class="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 mb-4">
          <ArrowRight class="w-6 h-6" />
        </div>
        <h4 class="font-bold text-slate-900 mb-2">Cancelamento Fácil</h4>
        <p class="text-sm text-slate-500">Sem pegadinhas ou multas. Cancele sua renovação quando quiser diretamente no painel.</p>
      </div>
    </div>
  </div>
</template>
