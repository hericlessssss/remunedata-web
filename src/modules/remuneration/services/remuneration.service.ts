import httpClient from '@/core/http/client'
import type { Remuneration, PaginationResponse } from '@/core/types/api'

export interface SearchFilters {
  nome?: string
  cpf?: string
  ano?: number
  mes?: string
  cargo?: string
  orgao?: string
  page?: number
  size?: number
}

export const RemunerationService = {
  async search(filters: SearchFilters): Promise<PaginationResponse<Remuneration>> {
    const { data } = await httpClient.get<PaginationResponse<Remuneration>>('/remuneration/', {
      params: filters,
    })
    return data
  },
}
