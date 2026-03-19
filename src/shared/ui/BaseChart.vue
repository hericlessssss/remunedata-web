<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PieChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'

// Registrar componentes do ECharts
use([
  CanvasRenderer,
  BarChart,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

interface Props {
  options: any
  height?: string | number
}

withDefaults(defineProps<Props>(), {
  height: '350px',
})
</script>

<template>
  <div :style="{ height: typeof height === 'number' ? `${height}px` : height }" class="w-full">
    <VChart :option="options" autoresize class="chart" />
  </div>
</template>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
