CREATE TABLE IF NOT EXISTS negociacao_lojas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  revenda_origem_id UUID NOT NULL REFERENCES revendas(id),
  revenda_destino_id UUID NOT NULL REFERENCES revendas(id),
  veiculo_id UUID NOT NULL REFERENCES veiculo_estoque(id),
  tipo_operacao TEXT CHECK (tipo_operacao IN ('venda', 'troca', 'consignacao')) DEFAULT 'venda',
  valor_solicitado DECIMAL(12,2),
  valor_oferecido DECIMAL(12,2),
  status TEXT CHECK (status IN ('aguardando_resposta', 'em_analise', 'em_negociacao', 'cancelada', 'completa')) DEFAULT 'aguardando_resposta',
  observacoes TEXT,
  criado_por UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

ALTER TABLE negociacao_lojas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Revendas view own negotiations" ON negociacao_lojas FOR SELECT USING (
  revenda_origem_id IN (SELECT id FROM revendas WHERE owner_id = auth.uid()) OR
  revenda_destino_id IN (SELECT id FROM revendas WHERE owner_id = auth.uid())
);

CREATE INDEX idx_revenda_origem ON negociacao_lojas(revenda_origem_id);
CREATE INDEX idx_revenda_destino ON negociacao_lojas(revenda_destino_id);
CREATE INDEX idx_status ON negociacao_lojas(status);
