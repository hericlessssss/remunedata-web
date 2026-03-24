import { useQuery } from '@tanstack/vue-query'
import { SummaryService } from '../services/summary.service'

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => SummaryService.getSummary(),
    staleTime: 1000 * 60 * 15, // 15 minutos de cache (SWR)
    refetchInterval: 1000 * 60 * 15, // Atualização silenciosa a cada 15 min
    placeholderData: (previousData) => previousData,
  })
}
