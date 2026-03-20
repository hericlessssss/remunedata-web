import httpClient from '@/core/http/client'
import type { Execution, PaginationResponse } from '@/core/types/api'

export const ExecutionService = {
  async getAll(page = 1, size = 20): Promise<PaginationResponse<Execution>> {
    const { data } = await httpClient.get<Execution[]>('executions/', {
      params: { page, size },
    })

    // A API retorna um array direto, o frontend espera PaginationResponse
    return {
      items: data,
      total: data.length,
      page,
      size,
      pages: Math.ceil(data.length / size),
    }
  },

  async triggerSync(ano: number, force = false): Promise<Execution> {
    const { data } = await httpClient.post<Execution>('executions/', null, {
      params: { ano, force },
    })
    return data
  },

  async getById(id: number): Promise<Execution> {
    const { data } = await httpClient.get<Execution>(`executions/${id}/`)
    return data
  },
}
