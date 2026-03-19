import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useRemunerationSearch } from './useRemunerationSearch'

// Mocks
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useRoute: () => ({
    query: {},
  }),
}))

vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn(() => ({
    data: { value: null },
    isLoading: { value: false },
    isError: { value: false },
  })),
}))

vi.mock('../services/remuneration.service', () => ({
  RemunerationService: {
    search: vi.fn(),
  },
}))

describe('useRemunerationSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with default filters', () => {
    const { filters } = useRemunerationSearch()
    expect(filters.value.nome).toBe('')
    expect(filters.value.page).toBe(1)
  })

  it('updates page when calling setPage', () => {
    const { filters, setPage } = useRemunerationSearch()
    setPage(2)
    expect(filters.value.page).toBe(2)
  })

  it('clears filters correctly', () => {
    const { filters, clearFilters } = useRemunerationSearch()
    filters.value.nome = 'Teste'
    filters.value.cargo = 'Analista'
    clearFilters()
    expect(filters.value.nome).toBe('')
    expect(filters.value.cargo).toBe('')
    expect(filters.value.page).toBe(1)
  })
})
