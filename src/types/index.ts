export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Loja = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Veiculo = {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  preco: number;
  lojaId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Anuncio = {
  id: number;
  veiculoId: number;
  descricao: string;
  preco: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Favorito = {
  id: number;
  usuarioId: number;
  anuncioId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Mensagem = {
  id: number;
  de: string;
  para: string;
  conteudo: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PaginationResponse<T> = {
  total: number;
  page: number;
  pageSize: number;
  data: T[];
};

export type AdminStats = {
  totalAnuncios: number;
  totalUsuarios: number;
  totalVendas: number;
};

export type DesignConfig = {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
};