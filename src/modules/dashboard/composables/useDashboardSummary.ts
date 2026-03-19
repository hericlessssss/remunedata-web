import { useQuery } from '@tanstack/vue-query'
import { SummaryService } from '../services/summary.service'

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => SummaryService.getSummary(),
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  })
}
