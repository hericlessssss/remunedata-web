<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck
} from 'lucide-vue-next'
import { AdminService, type AdminStats } from '../services/admin.service'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { 
  GridComponent, 
  TooltipComponent, 
  LegendComponent,
  TitleComponent 
} from 'echarts/components'

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
])

const stats = ref<AdminStats | null>(null)
const loading = ref(true)

const chartOption = ref({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    textStyle: { color: '#f8fafc' },
    axisPointer: { type: 'line', lineStyle: { color: '#334155' } }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    axisLine: { lineStyle: { color: '#334155' } },
    axisLabel: { color: '#94a3b8', fontSize: 10 }
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    axisLabel: { color: '#94a3b8', fontSize: 10 }
  },
  series: [
    {
      name: 'Faturamento',
      type: 'line',
      smooth: true,
      data: [120, 132, 101, 134, 90, 230, 210],
      itemStyle: { color: '#3b82f6' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(59, 130, 246, 0.2)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0)' }
          ]
        }
      }
    }
  ]
})

onMounted(async () => {
  try {
    stats.value = await AdminService.getStats()
  } catch {
    window.alert('Falha ao carregar métricas.')
  } finally {
    loading.value = false
  }
})

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
</script>

<template>
  <div class="space-y-12">
    <!-- Header -->
    <div class="flex flex-col gap-2">
      <h1 class="text-4xl font-black text-white tracking-tighter uppercase italic">Insights <span class="text-blue-500">Financeiros</span></h1>
      <p class="text-slate-500 font-bold uppercase tracking-widest text-xs">Visão geral do ecossistema RemuneData</p>
    </div>

    <!-- Cards Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Faturamento Total -->
      <div class="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 group hover:border-white/10 transition-all hover:translate-y-[-4px] shadow-2xl">
        <div class="flex justify-between items-start mb-6">
          <div class="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
            <TrendingUp class="w-6 h-6" />
          </div>
          <div class="flex items-center gap-1 text-emerald-400 text-xs font-black bg-emerald-400/10 px-2 py-1 rounded-lg">
            <ArrowUpRight class="w-3 h-3" />
            12.5%
          </div>
        </div>
        <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 ml-1 leading-none">Total Acumulado</p>
        <h3 v-if="stats" class="text-3xl font-black text-white tracking-tighter">{{ formatCurrency(stats.total_revenue) }}</h3>
        <div v-else class="h-9 w-32 bg-slate-800 animate-pulse rounded-lg"></div>
      </div>

      <!-- Faturamento Mensal -->
      <div class="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 group hover:border-white/10 transition-all hover:translate-y-[-4px] shadow-2xl">
        <div class="flex justify-between items-start mb-6">
          <div class="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
            <DollarSign class="w-6 h-6" />
          </div>
          <div class="flex items-center gap-1 text-emerald-400 text-xs font-black bg-emerald-400/10 px-2 py-1 rounded-lg">
            <ArrowUpRight class="w-3 h-3" />
            +R$ 2k
          </div>
        </div>
        <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 ml-1 leading-none">Mensal (Setembro)</p>
        <h3 v-if="stats" class="text-3xl font-black text-white tracking-tighter">{{ formatCurrency(stats.monthly_revenue) }}</h3>
        <div v-else class="h-9 w-32 bg-slate-800 animate-pulse rounded-lg"></div>
      </div>

      <!-- Assinaturas Ativas -->
      <div class="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 group hover:border-white/10 transition-all hover:translate-y-[-4px] shadow-2xl">
        <div class="flex justify-between items-start mb-6">
          <div class="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
            <Users class="w-6 h-6" />
          </div>
          <div class="flex items-center gap-1 text-amber-400 text-xs font-black bg-amber-400/10 px-2 py-1 rounded-lg">
            <TrendingUp class="w-3 h-3" />
            Stable
          </div>
        </div>
        <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 ml-1 leading-none">Usuários Pagantes</p>
        <h3 v-if="stats" class="text-3xl font-black text-white tracking-tighter">{{ stats.active_subscriptions }}</h3>
        <div v-else class="h-9 w-20 bg-slate-800 animate-pulse rounded-lg"></div>
      </div>

      <!-- Total de Usuários -->
      <div class="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 group hover:border-white/10 transition-all hover:translate-y-[-4px] shadow-2xl">
        <div class="flex justify-between items-start mb-6">
          <div class="p-3 bg-slate-500/10 rounded-2xl text-slate-400 font-bold">
            <CreditCard class="w-6 h-6" />
          </div>
          <div class="flex items-center gap-1 text-red-400 text-xs font-black bg-red-400/10 px-2 py-1 rounded-lg">
            <ArrowDownRight class="w-3 h-3" />
            0.5%
          </div>
        </div>
        <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 ml-1 leading-none">Base de Dados Total</p>
        <h3 v-if="stats" class="text-3xl font-black text-white tracking-tighter">{{ stats.total_users }}</h3>
        <div v-else class="h-9 w-20 bg-slate-800 animate-pulse rounded-lg"></div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Chart -->
      <div class="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative group">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-2xl font-black text-white leading-none mb-1">Tendência de Receita</h3>
            <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">Performance semanal em Reais</p>
          </div>
          <div class="flex gap-2">
            <button class="px-4 py-2 bg-white/5 text-xs font-bold rounded-xl text-white hover:bg-white/10 transition-all border border-white/5">Exportar CSV</button>
          </div>
        </div>
        
        <div class="h-[400px] w-full">
          <v-chart class="chart" :option="chartOption" autoresize />
        </div>
      </div>

      <!-- Side Card -->
      <div class="bg-gradient-to-br from-blue-600/80 to-purple-800/80 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl flex flex-col justify-between overflow-hidden relative border border-white/10 group">
        <!-- Shine Effect -->
        <div class="absolute -top-12 -right-12 w-48 h-48 bg-white/10 blur-3xl rounded-full"></div>
        <div class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

        <div class="relative z-10">
          <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
            <ShieldCheck class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-3xl font-black text-white tracking-tighter leading-tight mb-4 uppercase italic">Admin<br/>Premium Data</h3>
          <p class="text-white/60 text-sm font-bold leading-relaxed mb-8">
            Você está acessando a camada de inteligência proprietária. Todos os dados são criptografados de ponta a ponta.
          </p>
        </div>

        <div class="relative z-10 p-6 bg-black/20 rounded-3xl border border-white/5 backdrop-blur-md">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-10 h-10 rounded-full bg-blue-400 border-2 border-white/20"></div>
            <div>
              <p class="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none">Operador</p>
              <p class="text-sm font-black text-white">Administrador Master</p>
            </div>
          </div>
          <div class="h-1 bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-white w-2/3"></div>
          </div>
          <p class="text-[8px] text-white/30 mt-2 font-bold uppercase tracking-widest">Sessão Segura ativa por 12:45m</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart {
  height: 100%;
}
</style>
