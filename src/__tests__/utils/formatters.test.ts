import { formatCurrency, formatPhone, formatDocument, formatDate } from '@/utils/formatters'

describe('Formatters', () => {
  describe('formatCurrency', () => {
    it('deve formatar número como moeda brasileira', () => {
      expect(formatCurrency(1000)).toBe('R$ 1.000,00')
    })

    it('deve retornar R$ 0,00 para undefined', () => {
      expect(formatCurrency(undefined)).toBe('R$ 0,00')
    })

    it('deve formatar valores decimais', () => {
      expect(formatCurrency(1000.5)).toBe('R$ 1.000,50')
    })
  })

  describe('formatPhone', () => {
    it('deve formatar telefone brasileiro', () => {
      expect(formatPhone('11999999999')).toBe('(11) 99999-9999')
    })

    it('deve retornar - para undefined', () => {
      expect(formatPhone(undefined)).toBe('-')
    })
  })

  describe('formatDocument', () => {
    it('deve formatar CPF', () => {
      expect(formatDocument('12345678901')).toBe('123.456.789-01')
    })

    it('deve formatar CNPJ', () => {
      expect(formatDocument('12345678901234')).toBe('12.345.678/9012-34')
    })
  })

  describe('formatDate', () => {
    it('deve formatar data no padrão pt-BR', () => {
      expect(formatDate('2024-01-15T12:00:00.000Z')).toMatch(/^\d{2}\/\d{2}\/\d{4}$/)
    })

    it('deve retornar - para undefined', () => {
      expect(formatDate(undefined)).toBe('-')
    })
  })
})
