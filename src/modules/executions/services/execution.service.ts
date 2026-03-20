import httpClient from '@/core/http/client'
import type { Execution, PaginationResponse } from '@/core/types/api'

export const ExecutionService = {
  async getAll(page = 1, size = 20): Promise<PaginationResponse<Execution>> {
    const { data } = await httpClient.get<any>('executions/', {
      params: { page, size },
    })

    // Suporta tanto array direto quanto objeto envelopado { value: [], Count: n }
    const items = Array.isArray(data) ? data : (data.value || [])
    const total = data.Count || items.length

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
    const { data } = await httpClient.get<Execution>(`executions/${id}/`)
    return data
  },
}
