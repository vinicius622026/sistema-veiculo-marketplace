CREATE TABLE IF NOT EXISTS veiculo_estoque (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  revenda_id UUID NOT NULL REFERENCES revendas(id) ON DELETE CASCADE,
  placa TEXT UNIQUE NOT NULL,
  chassi TEXT UNIQUE NOT NULL,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  ano INTEGER NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  km INTEGER,
  combustivel TEXT,
  cor TEXT,
  status TEXT CHECK (status IN ('disponivel', 'vendido', 'manutencao', 'reservado')) DEFAULT 'disponivel',
  descricao TEXT,
  fotos TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

ALTER TABLE veiculo_estoque ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Revenda view own stock or public" ON veiculo_estoque FOR SELECT 
USING (
  revenda_id IN (SELECT id FROM revendas WHERE owner_id = auth.uid())
  OR status = 'disponivel'
);

CREATE INDEX idx_revenda_id ON veiculo_estoque(revenda_id);
CREATE INDEX idx_placa ON veiculo_estoque(placa);
CREATE INDEX idx_status ON veiculo_estoque(status);
CREATE INDEX idx_marca_modelo ON veiculo_estoque(marca, modelo);
