import { ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { ExecutionService } from '../services/execution.service'

export function useExecutions() {
  const page = ref(1)

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['executions', 'list', page],
    queryFn: () => ExecutionService.getAll(page.value),
    refetchInterval: (query) => {
      const hasRunning = query.state.data?.items.some(
        (i) => i.status.toLowerCase() === 'running' || i.status.toLowerCase() === 'pending'
      )
      return hasRunning ? 5000 : false
    },
  })

  return {
    page,
    data,
    isLoading,
    isError,
    error,
    refetch,
  }
}
