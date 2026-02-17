CREATE TABLE IF NOT EXISTS negociacao_transacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  negociacao_id UUID UNIQUE REFERENCES negociacao_lojas(id),
  revenda_vendedora_id UUID NOT NULL REFERENCES revendas(id),
  revenda_compradora_id UUID NOT NULL REFERENCES revendas(id),
  veiculo_id UUID NOT NULL REFERENCES veiculo_estoque(id),
  valor_final DECIMAL(12,2) NOT NULL,
  comissao_marketplace DECIMAL(12,2),
  status TEXT CHECK (status IN ('em_processamento', 'completa', 'cancelada')) DEFAULT 'em_processamento',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

ALTER TABLE negociacao_transacoes ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_revenda_vendedora ON negociacao_transacoes(revenda_vendedora_id);
CREATE INDEX idx_revenda_compradora ON negociacao_transacoes(revenda_compradora_id);
