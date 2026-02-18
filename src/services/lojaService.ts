import { supabase } from './supabaseClient'
import { Revenda as Loja } from '@/types'

export async function criarLoja(dados: any): Promise<Loja> {
  try {
    const { data, error } = await supabase
      .from('lojas')
      .insert([dados])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao criar loja:', error)
    throw new Error('Erro ao criar loja. Tente novamente.')
  }
}

export async function buscarLojaPorOwner(ownerId: string): Promise<Loja | null> {
  try {
    const { data, error } = await supabase
      .from('lojas')
      .select('*')
      .eq('owner_id', ownerId)
      .single()

    if (error && (error as any).code !== 'PGRST116') throw error
    return data || null
  } catch (error) {
    console.error('Erro ao buscar loja:', error)
    return null
  }
}

export async function buscarLoja(id: string): Promise<Loja | null> {
  try {
    const { data, error } = await supabase
      .from('lojas')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao buscar loja:', error)
    return null
  }
}

export async function listarLojas(): Promise<Loja[]> {
  try {
    const { data, error } = await supabase
      .from('lojas')
      .select('*')
      .eq('ativo', true)
      .eq('verificada', true)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao listar lojas:', error)
    return []
  }
}

export async function atualizarLoja(id: string, dados: Partial<Loja>): Promise<Loja> {
  try {
    const { data, error } = await supabase
      .from('lojas')
      .update(dados)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao atualizar loja:', error)
    throw new Error('Erro ao atualizar loja. Tente novamente.')
  }
}
