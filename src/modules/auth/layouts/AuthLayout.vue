<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
    <!-- Efeito de fundo decorativo suave -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/50 blur-[120px] rounded-full"></div>
      <div class="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-100/50 blur-[120px] rounded-full"></div>
    </div>

    <div class="w-full max-w-md relative z-10">
      <!-- Logo / Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
            <span class="font-bold text-xl">R</span>
          </div>
          <h1 class="font-serif font-bold text-3xl text-slate-900 tracking-tight">
            RemuneData
          </h1>
        </div>
        <p class="text-slate-500 font-medium">Transparência e inteligência em dados públicos</p>
      </div>

      <!-- Card principal (Seguindo padrão BaseCard) -->
      <div class="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-200/50">
        <router-view v-slot="{ Component }">
          <transition
            name="fade-slide"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
      
      <!-- Footer simplificado -->
      <p class="text-center mt-8 text-xs text-slate-400 font-medium uppercase tracking-widest">
        Portal da Transparência DF • v0.1.0
      </p>
    </div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
