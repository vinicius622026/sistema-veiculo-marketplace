/// <reference types="jest" />
import { getInitials, getStatusColor, truncate } from '@/utils/helpers'

describe('Helpers', () => {
  describe('getInitials', () => {
    it('deve extrair iniciais do nome', () => {
      expect(getInitials('João Silva')).toBe('JS')
    })

    it('deve retornar ? para undefined', () => {
      expect(getInitials(undefined)).toBe('?')
    })

    it('deve limitar a 2 caracteres', () => {
      expect(getInitials('João Pedro Silva')).toBe('JP')
    })
  })

  describe('getStatusColor', () => {
    it('deve retornar cor correta para status', () => {
      expect(getStatusColor('ativa')).toBe('bg-green-100 text-green-800')
      expect(getStatusColor('cancelada')).toBe('bg-red-100 text-red-800')
    })

    it('deve retornar cor padrão para status desconhecido', () => {
      expect(getStatusColor('desconhecido')).toBe('bg-gray-100 text-gray-800')
    })
  })

  describe('truncate', () => {
    it('deve truncar texto longo', () => {
      const texto = 'A'.repeat(150)
      const resultado = truncate(texto, 100)
      expect(resultado).toHaveLength(103)
    })

    it('deve manter texto curto', () => {
      expect(truncate('Curto', 100)).toBe('Curto')
    })
  })
})
