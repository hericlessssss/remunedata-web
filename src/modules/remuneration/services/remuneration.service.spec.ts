import { describe, it, expect, vi, beforeEach } from 'vitest'
import httpClient from '@/core/http/client'
import { RemunerationService } from './remuneration.service'

vi.mock('@/core/http/client', () => ({
  default: {
    get: vi.fn(),
  },
}))

describe('RemunerationService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('searches remunerations correctly', async () => {
    const filters = { nome: 'Alice', page: 1 }
    const mockData = { items: [], total: 0 }
    vi.mocked(httpClient.get).mockResolvedValue({ data: mockData })

    const result = await RemunerationService.search(filters)

    expect(httpClient.get).toHaveBeenCalledWith('remuneration/', {
      params: filters,
    })
    expect(result).toEqual(mockData)
  })

  it('fetches record by id', async () => {
    const mockData = { id: 123, nome: 'Alice' }
    vi.mocked(httpClient.get).mockResolvedValue({ data: mockData })

    const result = await RemunerationService.getById(123)

    expect(httpClient.get).toHaveBeenCalledWith('remuneration/123/')
    expect(result).toEqual(mockData)
  })

  it('fetches salary history by cpf', async () => {
    const mockItems = [{ mes: '01/2025', valor_liquido: 5000 }]
    const mockData = { items: mockItems }
    vi.mocked(httpClient.get).mockResolvedValue({ data: mockData })

    const result = await RemunerationService.getHistory('12345678901')

    expect(httpClient.get).toHaveBeenCalledWith('remuneration/', {
      params: { cpf: '12345678901', size: 100 },
    })
    expect(result).toEqual(mockItems)
  })

  it('fetches record by attributes', async () => {
    const mockRecord = { id: 1, nome: 'Alice' }
    vi.mocked(httpClient.get).mockResolvedValue({ data: { items: [mockRecord] } })

    const result = await RemunerationService.getByAttributes({ nome: 'Alice' })

    expect(httpClient.get).toHaveBeenCalledWith('remuneration/', {
      params: { nome: 'Alice', size: 1 },
    })
    expect(result).toEqual(mockRecord)
  })
})
