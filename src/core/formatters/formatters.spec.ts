import { describe, it, expect } from 'vitest'
import { formatCurrency } from './currency'
import { formatCompetence, formatDate } from './date'

describe('Formatters', () => {
  describe('formatCurrency', () => {
    it('formats numbers correctly to BRL', () => {
      expect(formatCurrency(1250.5)).toContain('1.250,50')
      expect(formatCurrency('1250.5')).toContain('1.250,50')
    })

    it('returns default for invalid input', () => {
      expect(formatCurrency('invalid')).toContain('0,00')
    })
  })

  describe('formatCompetence', () => {
    it('formats month and year correctly', () => {
      expect(formatCompetence('01', 2025)).toBe('Jan/2025')
      expect(formatCompetence(12, '2025')).toBe('Dez/2025')
    })
  })

  describe('formatDate', () => {
    it('formats iso date correctly', () => {
      const date = '2025-01-15T10:00:00Z'
      expect(formatDate(date)).toContain('15/01/2025')
    })
  })
})
