import { supabase } from './supabaseClient'
import { Veiculo } from '@/types'

class VeiculoService {
  async getAllVeiculos(): Promise<Veiculo[]> {
    try {
      const { data, error } = await supabase
        .from('veiculos_estoque')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao listar veículos:', error)
      return []
    }
  }

  async getVeiculosPorLoja(lojaId: string): Promise<Veiculo[]> {
    try {
      const { data, error } = await supabase
        .from('veiculos_estoque')
        .select('*')
        .eq('loja_id', lojaId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao listar veículos por loja:', error)
      return []
    }
  }

  async getVeiculoById(id: string): Promise<Veiculo | null> {
    try {
      const { data, error } = await supabase
        .from('veiculos_estoque')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao buscar veículo:', error)
      return null
    }
  }

  async createVeiculo(payload: any): Promise<Veiculo> {
    const lojaId = payload?.loja_id ?? payload?.lojaId
    if (!lojaId) throw new Error('Loja obrigatória para criar veículo.')

    try {
      const { data, error } = await supabase
        .from('veiculos_estoque')
        .insert([{ loja_id: lojaId, ...payload }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao criar veículo:', error)
      throw new Error('Erro ao criar veículo. Tente novamente.')
    }
  }

  async updateVeiculo(id: string, dados: Partial<Veiculo>): Promise<Veiculo> {
    try {
      const { data, error } = await supabase
        .from('veiculos_estoque')
        .update(dados)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error)
      throw new Error('Erro ao atualizar veículo. Tente novamente.')
    }
  }

  async deleteVeiculo(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('veiculos_estoque')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Erro ao deletar veículo:', error)
      throw new Error('Erro ao deletar veículo. Tente novamente.')
    }
  }

  async searchVeiculos(query: string): Promise<Veiculo[]> {
    const termo = query?.trim()
    if (!termo) return []

    try {
      const { data, error } = await supabase
        .from('veiculos_estoque')
        .select('*')
        .or(`marca.ilike.%${termo}%,modelo.ilike.%${termo}%,versao.ilike.%${termo}%`)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar veículos:', error)
      return []
    }
  }
}

const veiculoService = new VeiculoService()

// Backwards-compatible named exports (wrappers)
export const criarVeiculo = (lojaId: string, dados: any) => veiculoService.createVeiculo({ loja_id: lojaId, ...dados })
export const listarVeiculosPorLoja = (lojaId: string) => veiculoService.getVeiculosPorLoja(lojaId)
export const buscarVeiculo = (id: string) => veiculoService.getVeiculoById(id)
export const atualizarVeiculo = (id: string, dados: Partial<Veiculo>) => veiculoService.updateVeiculo(id, dados)
export const deletarVeiculo = (id: string) => veiculoService.deleteVeiculo(id)

export default veiculoService
