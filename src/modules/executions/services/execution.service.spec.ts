import { describe, it, expect, vi, beforeEach } from 'vitest'
import httpClient from '@/core/http/client'
import { ExecutionService } from './execution.service'

vi.mock('@/core/http/client', () => ({
  default: {
    get: vi.fn(),
  },
}))

describe('ExecutionService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches executions paginated', async () => {
    const mockData = {
      items: [{ id: 1, status: 'SUCCESS' }],
      total: 1,
      page: 1,
      size: 20,
      pages: 1,
    }
    vi.mocked(httpClient.get).mockResolvedValue({ data: mockData })

    const result = await ExecutionService.getAll(1)

    expect(httpClient.get).toHaveBeenCalledWith('/execution/', {
      params: { page: 1, size: 20 },
    })
    expect(result).toEqual(mockData)
  })
})
