import httpClient from '@/core/http/client'
import type { Execution, PaginationResponse } from '@/core/types/api'

export const ExecutionService = {
  async getAll(page = 1, size = 20): Promise<PaginationResponse<Execution>> {
    interface ExecutionListResponse {
      value?: Execution[]
      Count?: number
    }
    const { data } = await httpClient.get<Execution[] | ExecutionListResponse>('executions/', {
      params: { page, size },
    })

    const items = Array.isArray(data) ? data : (data.value || [])
    const total = (!Array.isArray(data) && data.Count) ? data.Count : items.length

    return {
      items,
      total,
      page,
      size,
      pages: Math.ceil(total / size),
    }
  },

  async triggerSync(ano: number, force = false): Promise<Execution> {
    const { data } = await httpClient.post<Execution>('executions/', null, {
      params: { ano, force },
    })
    return data
  },

  async getById(id: number): Promise<Execution> {
    const { data } = await httpClient.get<Execution>(`executions/${id}`)
    return data
  },
}
