import { useState, useCallback } from 'react'
import { BuscaGeo, AnuncioComDistancia } from '@/types/localizacao'
import { calcularDistancia } from './useGeolocalizacao'
import { supabase } from '@/services/supabaseClient'

export function useBuscaGeo() {
  const [resultados, setResultados] = useState<AnuncioComDistancia[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const buscar = useCallback(async (parametros: BuscaGeo) => {
    setLoading(true)
    setErro(null)

    try {
      // Consulta mínima: assume tabela veiculo_anuncio com relacionamento veiculo_estoque
      const { data, error } = await supabase
        .from('veiculo_anuncio')
        .select(`
          id,
          titulo,
          preco,
          cidade,
          estado,
          combustivel,
          created_at,
          veiculo_estoque( km, latitude, longitude )
        `)
        .eq('ativo', true)

      if (error) throw error

      let anuncios: any[] = (data as any[]) || []

      // Filtro por estado
      if (parametros.estado) {
        anuncios = anuncios.filter(a => a.estado === parametros.estado)
      }

      // Filtro por cidade (substring)
      if (parametros.cidade) {
        const c = parametros.cidade.toLowerCase()
        anuncios = anuncios.filter(a => (a.cidade || '').toLowerCase().includes(c))
      }

      // Filtro por raio
      if (parametros.latitude && parametros.longitude && parametros.raio) {
        anuncios = anuncios.filter(anuncio => {
          const estoque = anuncio.veiculo_estoque
          if (!estoque || estoque.latitude == null) return false
          const distancia = calcularDistancia(parametros.latitude!, parametros.longitude!, estoque.latitude, estoque.longitude)
          anuncio.distancia_usuario = distancia
          return distancia <= parametros.raio!
        })
      } else if (parametros.latitude && parametros.longitude) {
        anuncios = anuncios.map(anuncio => {
          const estoque = anuncio.veiculo_estoque
          if (estoque && estoque.latitude != null) {
            anuncio.distancia_usuario = calcularDistancia(parametros.latitude!, parametros.longitude!, estoque.latitude, estoque.longitude)
          }
          return anuncio
        })
      }

      // Ordenar por distância se disponível
      if (parametros.latitude && parametros.longitude) {
        anuncios.sort((a, b) => (a.distancia_usuario || 0) - (b.distancia_usuario || 0))
      }

      setResultados(anuncios as AnuncioComDistancia[])
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro na busca'
      setErro(mensagem)
    } finally {
      setLoading(false)
    }
  }, [])

  return { resultados, loading, erro, buscar }
}
