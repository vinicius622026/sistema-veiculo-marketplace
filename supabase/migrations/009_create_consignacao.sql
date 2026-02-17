CREATE TABLE IF NOT EXISTS consignacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  revenda_consignante_id UUID NOT NULL REFERENCES revendas(id) ON DELETE CASCADE,
  revenda_consignataria_id UUID NOT NULL REFERENCES revendas(id) ON DELETE CASCADE,
  veiculo_id UUID NOT NULL REFERENCES veiculo_estoque(id) ON DELETE CASCADE,
  percentual_comissao DECIMAL(5,2) NOT NULL DEFAULT 5.00,
  status TEXT CHECK (status IN ('proposta', 'ativa', 'pausada', 'cancelada')) DEFAULT 'proposta',
  criado_por UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

ALTER TABLE consignacao ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS anuncio_consignado (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consignacao_id UUID NOT NULL UNIQUE REFERENCES consignacao(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  preco_venda DECIMAL(12,2) NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE anuncio_consignado ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_consignacao_id ON consignacao(revenda_consignante_id);
CREATE INDEX idx_status ON consignacao(status);
