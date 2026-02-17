CREATE TABLE IF NOT EXISTS revendas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL UNIQUE,
  cnpj TEXT UNIQUE NOT NULL,
  endereco TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email_contato TEXT,
  website TEXT,
  logo_url TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

ALTER TABLE revendas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view active revendas" ON revendas FOR SELECT USING (ativo = true OR owner_id = auth.uid());

CREATE INDEX idx_owner_id ON revendas(owner_id);
CREATE INDEX idx_cnpj ON revendas(cnpj);
