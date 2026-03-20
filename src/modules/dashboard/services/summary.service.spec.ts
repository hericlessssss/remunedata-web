import { describe, it, expect, vi } from 'vitest'
import httpClient from '@/core/http/client'
import { SummaryService } from './summary.service'

vi.mock('@/core/http/client', () => ({
  default: {
    get: vi.fn(),
  },
}))

describe('SummaryService', () => {
  it('fetches summary successfully', async () => {
    const mockData = {
      total_servidores: 25402,
      total_gasto_bruto: 1250400300.5,
      media_salarial: 11500.2,
      ano_referencia: 2025,
      top_orgaos: [],
    }
    vi.mocked(httpClient.get).mockResolvedValue({ data: mockData })

    const result = await SummaryService.getSummary()

    expect(httpClient.get).toHaveBeenCalledWith('remuneration/summary')
    expect(result).toEqual(mockData)
  })

  it('throws error when request fails', async () => {
    vi.mocked(httpClient.get).mockRejectedValue(new Error('Network Error'))

    await expect(SummaryService.getSummary()).rejects.toThrow('Network Error')
  })
})
