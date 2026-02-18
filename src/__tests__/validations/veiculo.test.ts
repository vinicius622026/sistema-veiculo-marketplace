/// <reference types="jest" />
import { criarVeiculoSchema } from '@/validations/veiculo'

const jExpect: any = expect

describe('Validações Veículo', () => {
  it('deve validar veículo correto', () => {
    const dados = {
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2023,
      valor: 95000,
      km: 10000,
      combustivel: 'Gasolina',
      cor: 'Branco',
      placa: 'ABC-1234',
      chassi: '12345678901234567',
    }

    const resultado = criarVeiculoSchema.safeParse(dados)
    jExpect(resultado.success).toBe(true)
  })

  it('deve rejeitar marca vazia', () => {
    const dados = {
      marca: 'T',
      modelo: 'Corolla',
      ano: 2023,
      valor: 95000,
      km: 10000,
      combustivel: 'Gasolina',
      cor: 'Branco',
      placa: 'ABC-1234',
      chassi: '12345678901234567',
    }

    const resultado = criarVeiculoSchema.safeParse(dados)
    jExpect(resultado.success).toBe(false)
  })

  it('deve rejeitar placa inválida', () => {
    const dados = {
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2023,
      valor: 95000,
      km: 10000,
      combustivel: 'Gasolina',
      cor: 'Branco',
      placa: 'INVALIDA',
      chassi: '12345678901234567',
    }

    const resultado = criarVeiculoSchema.safeParse(dados)
    jExpect(resultado.success).toBe(false)
  })

  it('deve rejeitar chassi com menos de 17 caracteres', () => {
    const dados = {
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2023,
      valor: 95000,
      km: 10000,
      combustivel: 'Gasolina',
      cor: 'Branco',
      placa: 'ABC-1234',
      chassi: '123',
    }

    const resultado = criarVeiculoSchema.safeParse(dados)
    jExpect(resultado.success).toBe(false)
  })
})
