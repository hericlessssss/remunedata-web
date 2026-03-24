import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { useQuery } from '@tanstack/vue-query'
import ExecutionMonthlyProgress from './ExecutionMonthlyProgress.vue'

// Mock dependencies
vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn(),
}))

vi.mock('../services/execution.service', () => ({
  ExecutionService: {
    getById: vi.fn(),
    retryMonth: vi.fn(),
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
    } as unknown as ReturnType<typeof useQuery>)

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
          Clock: true,
          Activity: true,
        },
      },
    })

    // In the new UI, "Mês" and "02" are in separate spans, so text() might be "Mês02"
    const month02Card = wrapper.findAll('.group').find(c => c.text().includes('Mês02'))
    
    expect(month02Card).toBeDefined()
    expect(month02Card?.text()).toContain('750')
    expect(month02Card?.text()).toContain('Registros')
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
    } as unknown as ReturnType<typeof useQuery>)

    const wrapper = mount(ExecutionMonthlyProgress, {
      props: {
        executionId: mockExecutionId,
        status: 'running',
        parentTotal: 150,
      },
      global: {
        stubs: {
          RefreshCw: { template: '<div class="refresh-cw animate-spin" />' },
          CheckCircle2: { template: '<div class="check-circle" />' },
          XCircle: { template: '<div class="x-circle" />' },
          Clock: { template: '<div class="clock" />' },
          Activity: true,
        },
      },
    })

    // Check for "Concluído" label and success background class
    expect(wrapper.text()).toContain('Concluído')
    expect(wrapper.find('.bg-slate-50').exists()).toBe(true)
    
    // Check for "Processando" label and running background class
    expect(wrapper.text()).toContain('Processando')
    expect(wrapper.find('.bg-slate-900').exists()).toBe(true)
  })

  it('renders retry button for months with error status and triggers retry action', async () => {
    const mockMonthlyExecutions = [
      { mes_referencia: '01', status: 'error', registros_coletados: 100 },
    ]

    vi.mocked(useQuery).mockReturnValue({
      data: {
        id: mockExecutionId,
        monthly_executions: mockMonthlyExecutions,
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useQuery>)

    const wrapper = mount(ExecutionMonthlyProgress, {
      props: {
        executionId: mockExecutionId,
        status: 'error',
        parentTotal: 100,
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

    // Check for retry button
    const retryButton = wrapper.find('button.retry-button')
    expect(retryButton.exists()).toBe(true)

    const { ExecutionService } = await import('../services/execution.service')
    vi.mocked(ExecutionService.retryMonth).mockResolvedValueOnce()

    await retryButton.trigger('click')

    expect(ExecutionService.retryMonth).toHaveBeenCalledWith(mockExecutionId, '01')
  })
})
