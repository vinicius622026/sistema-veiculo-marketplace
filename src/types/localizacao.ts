export interface Coordenadas {
  latitude: number
  longitude: number
}

export interface Cidade {
  id: string
  nome: string
  estado: string
  latitude: number
  longitude: number
  populacao: number
  regiao: 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul'
}

export interface Estado {
  id: string
  nome: string
  sigla: string
  regiao: 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul'
  latitude: number
  longitude: number
}

export interface Regiao {
  id: string
  nome: 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul'
  estados: Estado[]
}

export interface BuscaGeo {
  latitude?: number
  longitude?: number
  raio?: number // em km
  cidade?: string
  estado?: string
  regiao?: string
  marca?: string
  modelo?: string
  precoMin?: number
  precoMax?: number
}

export interface AnuncioComDistancia {
  id: string
  titulo: string
  preco: number
  km_carro: number
  combustivel: string
  cidade: string
  estado: string
  latitude: number
  longitude: number
  distancia_usuario?: number // em km
  created_at: string
}

export default null
