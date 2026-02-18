import { supabase } from './supabaseClient'
import { Veiculo } from '@/types'

export async function criarVeiculo(lojaId: string, dados: any): Promise<Veiculo> {
  try {
    const { data, error } = await supabase
      .from('veiculos_estoque')
      .insert([{ loja_id: lojaId, ...dados }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao criar veículo:', error)
    throw new Error('Erro ao criar veículo. Tente novamente.')
  }
}

export async function listarVeiculosPorLoja(lojaId: string): Promise<Veiculo[]> {
  try {
    const { data, error } = await supabase
      .from('veiculos_estoque')
      .select('*')
      .eq('loja_id', lojaId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao listar veículos:', error)
    return []
  }
}

export async function buscarVeiculo(id: string): Promise<Veiculo | null> {
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

export async function atualizarVeiculo(id: string, dados: Partial<Veiculo>): Promise<Veiculo> {
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

export async function deletarVeiculo(id: string): Promise<boolean> {
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

  async getVeiculoById(id: string): Promise<Veiculo | null> {
    return buscarVeiculo(id)
  }

  async createVeiculo(data: any): Promise<Veiculo> {
    const lojaId = data?.loja_id ?? data?.lojaId
    if (!lojaId) {
      throw new Error('Loja obrigatória para criar veículo.')
    }

    return criarVeiculo(lojaId, data)
  }

  async updateVeiculo(id: string, data: Partial<Veiculo>): Promise<Veiculo> {
    return atualizarVeiculo(id, data)
  }

  async deleteVeiculo(id: string): Promise<boolean> {
    return deletarVeiculo(id)
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

export default new VeiculoService()
