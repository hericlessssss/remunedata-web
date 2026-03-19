import httpClient from '@/core/http/client'
import type { Execution, PaginationResponse } from '@/core/types/api'

export const ExecutionService = {
  async getAll(page = 1, size = 20): Promise<PaginationResponse<Execution>> {
    const { data } = await httpClient.get<PaginationResponse<Execution>>('executions/', {
      params: { page, size },
    })
    return data
  },

  async triggerSync(ano: number): Promise<Execution> {
    const { data } = await httpClient.post<Execution>('executions/', null, {
      params: { ano },
    })
    return data
  },
}
