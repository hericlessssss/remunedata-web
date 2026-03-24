<script setup lang="ts">
import { ArrowRight, CheckCircle2, Zap, Shield, ChevronRight, X } from 'lucide-vue-next'
import BaseButton from '@/shared/ui/BaseButton.vue'
</script>

<template>
  <div class="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
    <!-- Navigation -->
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
            <span class="font-bold text-lg leading-none">R</span>
          </div>
          <span class="font-serif font-bold text-xl tracking-tight">RemuneData</span>
        </div>
        <div class="flex items-center gap-6">
          <RouterLink to="/auth/login" class="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
            Entrar
          </RouterLink>
          <RouterLink :to="{ name: 'signup', query: { redirect: '/subscriptions/plans' } }">
            <BaseButton class="bg-slate-900 text-white hover:bg-slate-800 px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10">
              Começar Agora
            </BaseButton>
          </RouterLink>
        </div>
      </div>
    </nav>

    <!-- Hero Section Content -->
    <header class="relative pt-24 pb-32 px-6 overflow-hidden">
      <div class="max-w-4xl mx-auto text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 class="text-6xl md:text-8xl font-black font-serif tracking-tighter leading-[0.9] text-slate-900">
          Dados públicos, <br />
          <span class="italic text-slate-400 font-medium">inteligência privada.</span>
        </h1>
        <p class="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Navegue pelos dados de remuneração do Distrito Federal com a velocidade e clareza que o portal oficial não oferece.
        </p>
        <div class="flex flex-col sm:flex-row items-center gap-6 justify-center">
          <RouterLink :to="{ name: 'signup', query: { redirect: '/subscriptions/plans' } }">
            <BaseButton class="bg-slate-900 text-white w-full sm:w-auto px-12 py-5 text-xl font-bold rounded-2xl flex items-center gap-2 group shadow-2xl shadow-slate-900/20 hover:scale-105 transition-all">
              Criar Conta Grátis
              <ArrowRight class="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </BaseButton>
          </RouterLink>
          <p class="text-sm text-slate-400 font-medium italic">Fácil, rápido e 100% transparente.</p>
        </div>
      </div>
    </header>

    <!-- Comparison Section -->
    <section class="py-32 px-6 bg-slate-50">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-20">
          <h2 class="text-3xl md:text-5xl font-bold font-serif mb-6">Por que o RemuneData?</h2>
          <p class="text-slate-500 font-medium italic">"A transparência deve ser fácil, não um labirinto."</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Coluna 1: Portal Oficial -->
          <div class="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5 flex flex-col items-center text-center space-y-8 group hover:border-slate-200 transition-all duration-500">
            <div class="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform">
              <Shield class="w-8 h-8" />
            </div>
            <div>
              <h3 class="font-bold text-slate-400 uppercase tracking-[0.2em] text-[10px] mb-2">Portal Oficial</h3>
              <p class="font-serif font-bold text-2xl text-slate-800">Transparência Estática</p>
            </div>
            <ul class="space-y-4 w-full text-left">
              <li class="flex items-start gap-3 text-slate-400 text-sm">
                <X class="w-5 h-5 text-slate-200 flex-shrink-0" />
                Interface lenta e navegação confusa.
              </li>
              <li class="flex items-start gap-3 text-slate-400 text-sm">
                <X class="w-5 h-5 text-slate-200 flex-shrink-0" />
                Buscas complexas e falta de clareza.
              </li>
              <li class="flex items-start gap-3 text-slate-400 text-sm">
                <X class="w-5 h-5 text-slate-200 flex-shrink-0" />
                Dificuldade em visualizar tendências.
              </li>
            </ul>
          </div>

          <!-- Coluna 2: RemuneData -->
          <div class="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl shadow-slate-900/20 flex flex-col items-center text-center space-y-8 group hover:scale-[1.02] transition-all duration-500 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-slate-800 rounded-full -mr-16 -mt-16 blur-3xl opacity-20"></div>
            <div class="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform shadow-lg shadow-white/10">
              <Zap class="w-8 h-8 fill-current" />
            </div>
            <div>
              <h3 class="font-bold text-slate-500 uppercase tracking-[0.2em] text-[10px] mb-2">RemuneData Pro</h3>
              <p class="font-serif font-bold text-2xl text-white">Inteligência Ativa</p>
            </div>
            <ul class="space-y-4 w-full text-left relative z-10">
              <li class="flex items-start gap-3 text-slate-300 font-medium text-sm">
                <CheckCircle2 class="w-5 h-5 text-white flex-shrink-0" />
                Busca instantânea e filtros dinâmicos.
              </li>
              <li class="flex items-start gap-3 text-slate-300 font-medium text-sm">
                <CheckCircle2 class="w-5 h-5 text-white flex-shrink-0" />
                Dashboard analítico consolidado.
              </li>
              <li class="flex items-start gap-3 text-slate-300 font-medium text-sm">
                <CheckCircle2 class="w-5 h-5 text-white flex-shrink-0" />
                Histórico e evolução em tempo real.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Footer -->
    <footer class="py-32 px-6 border-t border-slate-100 text-center">
      <div class="max-w-3xl mx-auto space-y-12">
        <h2 class="text-4xl md:text-7xl font-black font-serif tracking-tighter leading-tight">Pronto para ter clareza total?</h2>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-8">
          <RouterLink :to="{ name: 'signup', query: { redirect: '/subscriptions/plans' } }">
            <BaseButton class="bg-slate-900 text-white px-14 py-6 text-2xl font-bold rounded-[2rem] shadow-2xl hover:scale-105 transition-all">
              Começar Agora
            </BaseButton>
          </RouterLink>
          <RouterLink to="/auth/login" class="flex items-center gap-2 font-bold text-slate-600 hover:text-slate-900 group text-lg transition-colors">
            Já tenho conta
            <ChevronRight class="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </RouterLink>
        </div>
        <div class="pt-24 text-[10px] uppercase font-black tracking-[0.3em] text-slate-300">
          RemuneData &copy; 2026 / Transparência Elevada ao Próximo Nível
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700;800;900&display=swap');

:deep(h1), :deep(h2), :deep(h3), :deep(h4), nav span {
  font-family: 'Instrument Serif', serif;
}

body {
  font-family: 'Inter', sans-serif;
}
</style>
