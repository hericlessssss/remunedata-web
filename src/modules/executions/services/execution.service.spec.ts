import { describe, it, expect, vi, beforeEach } from 'vitest'
import httpClient from '@/core/http/client'
import { ExecutionService } from './execution.service'

vi.mock('@/core/http/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('ExecutionService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches executions paginated', async () => {
    const mockItems = [{ id: 1, status: 'SUCCESS' }]
    const expectedResult = {
      items: mockItems,
      total: 1,
      page: 1,
      size: 20,
      pages: 1,
    }
    vi.mocked(httpClient.get).mockResolvedValue({ data: mockItems })

    const result = await ExecutionService.getAll(1)

    expect(httpClient.get).toHaveBeenCalledWith('executions/', {
      params: { page: 1, size: 20 },
    })
    expect(result).toEqual(expectedResult)
  })

  it('triggers a manual synchronization', async () => {
    const mockExecution = { id: 123, status: 'running' }
    vi.mocked(httpClient.post).mockResolvedValueOnce({ data: mockExecution })

    const result = await ExecutionService.triggerSync(2025)

    expect(httpClient.post).toHaveBeenCalledWith('executions/', null, {
      params: { ano: 2025, force: false },
    })
    expect(result).toEqual(mockExecution)
  })
})
