<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { SubscriptionService } from '../services/subscription.service'
import PlanCard from './PlanCard.vue'
import BaseSkeleton from '@/shared/ui/BaseSkeleton.vue'

const { data: plans, isLoading } = useQuery({
  queryKey: ['plans'],
  queryFn: () => SubscriptionService.getPlans(),
  staleTime: 1000 * 60 * 60, // 1 hora
})

defineEmits(['select'])
</script>

<template>
  <div class="w-full max-w-7xl mx-auto px-4">
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div v-for="i in 3" :key="i" class="p-8 rounded-[2.5rem] bg-white border border-slate-100 space-y-8 shadow-sm">
        <div class="space-y-3">
          <BaseSkeleton height="12px" width="30%" rounded="rounded-full" />
          <BaseSkeleton height="32px" width="60%" />
          <BaseSkeleton height="16px" width="80%" />
        </div>
        <BaseSkeleton height="48px" width="50%" />
        <div class="space-y-4">
          <BaseSkeleton v-for="j in 4" :key="j" height="12px" width="90%" rounded="rounded-full" />
        </div>
        <BaseSkeleton height="64px" rounded="rounded-2xl" />
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
      <PlanCard
        v-for="plan in plans"
        :key="plan.slug"
        :plan="plan"
        :is-featured="plan.slug === 'profissional'"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>
