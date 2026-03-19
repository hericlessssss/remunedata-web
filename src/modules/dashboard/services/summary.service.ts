import httpClient from '@/core/http/client'
import type { Summary } from '@/core/types/api'

export const SummaryService = {
  async getSummary(): Promise<Summary> {
    const { data } = await httpClient.get<Summary>('remuneration/summary')
    return data
  },
}
