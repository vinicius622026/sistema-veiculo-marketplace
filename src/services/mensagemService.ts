import { supabase } from './supabaseClient'

export async function enviarMensagem(dados: any): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('mensagens')
      .insert([{ ...dados, lida: false }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    throw new Error('Erro ao enviar mensagem. Tente novamente.')
  }
}

export async function listarMensagens(anuncioId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('mensagens')
      .select('*')
      .eq('anuncio_id', anuncioId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao listar mensagens:', error)
    return []
  }
}

export async function marcarComoLida(anuncioId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('mensagens')
      .update({ lida: true })
      .eq('anuncio_id', anuncioId)
      .eq('lida', false)

    if (error) throw error
  } catch (error) {
    console.error('Erro ao marcar como lida:', error)
  }
}
