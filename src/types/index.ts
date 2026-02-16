// Autenticação
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

// Revendas
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
  ativo: boolean
  created_at: string
}

// Veículos
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

// Anúncios
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
  ativo: boolean
  created_at: string
}

// Negociações
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

// Consignações
export interface Consignacao {
  id: string
  revenda_consignante_id: string
  revenda_consignataria_id: string
  veiculo_id: string
  percentual_comissao: number
  status: 'proposta' | 'ativa' | 'pausada' | 'encerrada' | 'cancelada'
  created_at: string
}

// Transações
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
