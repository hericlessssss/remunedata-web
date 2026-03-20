import httpClient from '@/core/http/client'
import type { Remuneration, PaginationResponse, Execution } from '@/core/types/api'

export interface SearchFilters {
  nome?: string
  cpf?: string
  ano?: number
  mes?: string
  cargo?: string
  orgao?: string
  page?: number
  size?: number
  ordering?: string
}

export const RemunerationService = {
  async search(filters: SearchFilters): Promise<PaginationResponse<Remuneration>> {
    const { data } = await httpClient.get<PaginationResponse<Remuneration>>('remuneration/', {
      params: filters,
    })
    return data
  },

  async getById(id: number): Promise<Remuneration> {
    const { data } = await httpClient.get<Remuneration>(`remuneration/${id}/`)
    return data
  },

  async getByAttributes(filters: Partial<SearchFilters>): Promise<Remuneration> {
    const { data } = await httpClient.get<PaginationResponse<Remuneration>>('remuneration/', {
      params: { ...filters, size: 1 },
    })
    if (data.items.length === 0) throw new Error('Registro não encontrado')
    return data.items[0]
  },

  async getHistory(cpf: string): Promise<Remuneration[]> {
    const { data } = await httpClient.get<PaginationResponse<Remuneration>>('remuneration/', {
      params: { cpf, size: 100 },
    })
    return data.items
  },

  async getLatestExecutionId(): Promise<number | null> {
    const { data } = await httpClient.get<Execution[]>('executions/')
    if (data && data.length > 0) {
      return data[0].id
    }
    return null
  },

  async getExportUrl(type: 'xlsx' | 'csv'): Promise<string> {
    const baseUrl = httpClient.defaults.baseURL || ''
    const executionId = await this.getLatestExecutionId()
    
    if (!executionId) {
      throw new Error('Nenhuma execução encontrada para exportação')
    }

    return `${baseUrl}executions/${executionId}/export?format=${type}`
  },
}
