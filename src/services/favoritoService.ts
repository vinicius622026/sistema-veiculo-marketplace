import { supabase } from './supabaseClient'

export async function adicionarFavorito(userId: string, anuncioId: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('favoritos')
      .insert([{ user_id: userId, anuncio_id: anuncioId }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error)
    throw new Error('Erro ao adicionar favorito')
  }
}

export async function removerFavorito(userId: string, anuncioId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('user_id', userId)
      .eq('anuncio_id', anuncioId)

    if (error) throw error
  } catch (error) {
    console.error('Erro ao remover favorito:', error)
    throw new Error('Erro ao remover favorito')
  }
}

export async function listarFavoritos(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('favoritos')
      .select('anuncio_id')
      .eq('user_id', userId)

    if (error) throw error
    return data?.map((f: any) => f.anuncio_id) || []
  } catch (error) {
    console.error('Erro ao listar favoritos:', error)
    return []
  }
}

export async function isFavorito(userId: string, anuncioId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('favoritos')
      .select('id')
      .eq('user_id', userId)
      .eq('anuncio_id', anuncioId)
      .single()

    if (error && (error as any).code !== 'PGRST116') throw error
    return !!data
  } catch (error) {
    console.error('Erro ao verificar favorito:', error)
    return false
  }
}
