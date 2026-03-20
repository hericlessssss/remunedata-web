import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { useQuery } from '@tanstack/vue-query'
import ExecutionMonthlyProgress from './ExecutionMonthlyProgress.vue'
import { ExecutionService } from '../services/execution.service'

// Mock dependencies
vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn(),
}))

vi.mock('../services/execution.service', () => ({
  ExecutionService: {
    getById: vi.fn(),
  },
}))

describe('ExecutionMonthlyProgress.vue', () => {
  const mockExecutionId = 1
  const mockParentTotal = 1400000

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders monthly record counts correctly without "estimation" inflation', async () => {
    // Mock data where a month has 750 records but the parent total is 1.4M
    const mockMonthlyExecutions = [
      { mes_referencia: '01', status: 'success', registros_coletados: 750 },
      { mes_referencia: '02', status: 'running', registros_coletados: 750, id: 102 },
      { mes_referencia: '03', status: 'pending', registros_coletados: 0 },
    ]

    vi.mocked(useQuery).mockReturnValue({
      data: {
        id: mockExecutionId,
        monthly_executions: mockMonthlyExecutions,
      },
      isLoading: false,
    } as any)

    const wrapper = mount(ExecutionMonthlyProgress, {
      props: {
        executionId: mockExecutionId,
        status: 'running',
        parentTotal: mockParentTotal,
      },
      global: {
        stubs: {
          RefreshCw: true,
          CheckCircle2: true,
          XCircle: true,
        },
      },
    })

    // Currently, the "running" month (02) might be inflated to 1,399,250 
    // because of the logic: parentTotal (1.4M) - other success months (750)
    // We want it to show exactly 750 as returned by the API during NITRO engine execution.
    
    // In the new UI, "Mês" and "02" are in separate spans, so text() might be "Mês02"
    const month02Card = wrapper.findAll('.group').find(c => c.text().includes('Mês02'))
    
    // Debug if not found
    if (!month02Card) {
      console.log('Available cards:', wrapper.findAll('.group').map(c => c.text()))
    }

    expect(month02Card?.text()).toContain('750')
    expect(month02Card?.text()).toContain('Registros Coletados')
    expect(month02Card?.text()).not.toContain('1.399.250')
  })

  it('renders status icons correctly', async () => {
    const mockMonthlyExecutions = [
      { mes_referencia: '01', status: 'success', registros_coletados: 100 },
      { mes_referencia: '02', status: 'running', registros_coletados: 50 },
      { mes_referencia: '03', status: 'pending', registros_coletados: 0 },
    ]

    vi.mocked(useQuery).mockReturnValue({
      data: {
        id: mockExecutionId,
        monthly_executions: mockMonthlyExecutions,
      },
      isLoading: false,
    } as any)

    const wrapper = mount(ExecutionMonthlyProgress, {
      props: {
        executionId: mockExecutionId,
        status: 'running',
        parentTotal: 150,
      },
      global: {
        stubs: {
          RefreshCw: true,
          CheckCircle2: true,
          XCircle: true,
          Clock: true,
          Activity: true,
        },
      },
    })

    // Check for "Concluído" label and success background class
    expect(wrapper.text()).toContain('Concluído')
    expect(wrapper.find('.bg-emerald-50').exists()).toBe(true)
    
    // Check for "Processando" label and running background class
    expect(wrapper.text()).toContain('Processando')
    expect(wrapper.find('.bg-sky-50').exists()).toBe(true)
  })
})
