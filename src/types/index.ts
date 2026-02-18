export interface User {
  id: string
  email: string
  full_name: string
  tipo_usuario: 'comprador' | 'vendedor' | 'admin'
  avatar_url?: string
  telefone?: string
  documento?: string
  revenda_id?: string
  created_at: string
}

export interface Revenda {
  id: string
  owner_id: string
  nome: string
  cnpj: string
  endereco: string
  cidade: string
  estado: string
  telefone: string
  email_contato?: string
  website?: string
  logo_url?: string
  capa_url?: string
  verificada?: boolean
  descricao?: string
  whatsapp?: string
  ativo: boolean
  created_at: string
}

export interface Veiculo {
  id: string
  revenda_id: string
  placa: string
  chassi: string
  marca: string
  modelo: string
  ano: number
  valor: number
  km: number
  combustivel?: string
  cor?: string
  status: 'disponivel' | 'vendido' | 'manutencao' | 'reservado'
  descricao?: string
  fotos?: string[]
  created_at: string
}

export interface Anuncio {
  id: string
  estoque_id: string
  revenda_id: string
  titulo: string
  descricao?: string
  preco: number
  cidade: string
  estado: string
  visitas: number
  veiculo?: Veiculo
  loja?: Revenda
  imagens_urls?: string[]
  destaque?: boolean
  preco_venda?: number
  ativo: boolean
  created_at: string
}


// Additional optional fields used by UI components
export interface AnuncioUI extends Anuncio {
  veiculo?: Veiculo
  loja?: Revenda
  imagens_urls?: string[]
  destaque?: boolean
  preco_venda?: number
}

// Alias for store/loja used across components
export type Loja = Revenda

export interface Negociacao {
  id: string
  revenda_origem_id: string
  revenda_destino_id: string
  veiculo_id: string
  tipo_operacao: 'venda' | 'troca' | 'consignacao'
  valor_solicitado: number
  valor_oferecido?: number
  status: string
  created_at: string
}

export interface Consignacao {
  id: string
  revenda_consignante_id: string
  revenda_consignataria_id: string
  veiculo_id: string
  percentual_comissao: number
  status: 'proposta' | 'ativa' | 'pausada' | 'encerrada' | 'cancelada'
  created_at: string
}

export interface Transacao {
  id: string
  negociacao_id?: string
  revenda_vendedora_id: string
  revenda_compradora_id: string
  veiculo_id: string
  valor_final: number
  comissao_marketplace: number
  status_pagamento: 'aguardando' | 'pago' | 'parcial' | 'cancelado'
  created_at: string
}
