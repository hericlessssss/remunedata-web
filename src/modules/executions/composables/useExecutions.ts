import { ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { ExecutionService } from '../services/execution.service'

export function useExecutions() {
  const page = ref(1)

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['executions', 'list', page],
    queryFn: () => ExecutionService.getAll(page.value),
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
