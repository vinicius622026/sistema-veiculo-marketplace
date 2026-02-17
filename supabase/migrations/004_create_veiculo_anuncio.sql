CREATE TABLE IF NOT EXISTS veiculo_anuncio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estoque_id UUID NOT NULL REFERENCES veiculo_estoque(id) ON DELETE CASCADE,
  revenda_id UUID NOT NULL REFERENCES revendas(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  preco DECIMAL(12,2) NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  visitas INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  telefone_contato TEXT,
  whatsapp TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

ALTER TABLE veiculo_anuncio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view active listings" ON veiculo_anuncio FOR SELECT USING (ativo = true);

CREATE INDEX idx_estado_cidade ON veiculo_anuncio(estado, cidade);
CREATE INDEX idx_ativo ON veiculo_anuncio(ativo);
CREATE INDEX idx_preco ON veiculo_anuncio(preco);
CREATE INDEX idx_created_at ON veiculo_anuncio(created_at DESC);
