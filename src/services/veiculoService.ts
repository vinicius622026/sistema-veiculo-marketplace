import { supabase } from './supabaseClient'

export const veiculoService = {
  async getAll() {
    const { data, error } = await supabase.from('veiculos').select('*')
    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase.from('veiculos').select('*').eq('id', id).single()
    if (error) throw error
    return data
  },

  async getByLojaId(lojaId: string) {
    const { data, error } = await supabase.from('veiculos').select('*').eq('loja_id', lojaId)
    if (error) throw error
    return data
  },

  async create(veiculo: any) {
    const { data, error } = await supabase.from('veiculos').insert([veiculo]).select()
    if (error) throw error
    return data[0]
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('veiculos')
      .update(updates)
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  },

  async delete(id: string) {
    const { error } = await supabase.from('veiculos').delete().eq('id', id)
    if (error) throw error
  },

  async search(filters: any) {
    let query = supabase.from('veiculos').select('*')

    if (filters.marca) query = query.ilike('marca', `%${filters.marca}%`)
    if (filters.modelo) query = query.ilike('modelo', `%${filters.modelo}%`)
    if (filters.ano) query = query.eq('ano', filters.ano)
    if (filters.minPreco) query = query.gte('valor', filters.minPreco)
    if (filters.maxPreco) query = query.lte('valor', filters.maxPreco)

    const { data, error } = await query
    if (error) throw error
    return data
  },
}