import { supabase } from './supabaseClient'

class AvaliacaoService {
  async getAvaliacoes(veiculoId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select('*')
        .eq('veiculo_id', veiculoId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error)
      return []
    }
  }

  async createAvaliacao(payload: any): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .insert([payload])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao criar avaliação:', error)
      throw new Error('Erro ao criar avaliação. Tente novamente.')
    }
  }

  async updateAvaliacao(id: string, payload: any): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .update(payload)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error)
      throw new Error('Erro ao atualizar avaliação. Tente novamente.')
    }
  }

  async deleteAvaliacao(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('avaliacoes')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Erro ao deletar avaliação:', error)
      throw new Error('Erro ao deletar avaliação. Tente novamente.')
    }
  }

  async getAverageRating(veiculoId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select('rating')
        .eq('veiculo_id', veiculoId)

      if (error) throw error
      const ratings = (data || []).map((r: any) => Number(r.rating)).filter((n: number) => !Number.isNaN(n))
      if (ratings.length === 0) return 0
      const sum = ratings.reduce((s: number, v: number) => s + v, 0)
      return sum / ratings.length
    } catch (error) {
      console.error('Erro ao calcular média de avaliações:', error)
      return 0
    }
  }
}

const avaliacaoService = new AvaliacaoService()

export const getAvaliacoes = (veiculoId: string) => avaliacaoService.getAvaliacoes(veiculoId)
export const createAvaliacao = (payload: any) => avaliacaoService.createAvaliacao(payload)
export const updateAvaliacao = (id: string, payload: any) => avaliacaoService.updateAvaliacao(id, payload)
export const deleteAvaliacao = (id: string) => avaliacaoService.deleteAvaliacao(id)
export const getAverageRating = (veiculoId: string) => avaliacaoService.getAverageRating(veiculoId)

export default avaliacaoService
class AvaliacaoService {
    getAvaliacoes(veiculoId: string) { }
    createAvaliacao(data: any) { }
    updateAvaliacao(id: string, data: any) { }
    deleteAvaliacao(id: string) { }
    getAverageRating(veiculoId: string) { }
}

export default new AvaliacaoService();