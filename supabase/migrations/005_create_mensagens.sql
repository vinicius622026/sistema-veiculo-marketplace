CREATE TABLE IF NOT EXISTS mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anuncio_id UUID NOT NULL REFERENCES veiculo_anuncio(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id),
  sender_nome TEXT NOT NULL,
  sender_telefone TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  lida BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE mensagens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public send messages" ON mensagens FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone view messages" ON mensagens FOR SELECT USING (true);

CREATE INDEX idx_anuncio_id ON mensagens(anuncio_id);
CREATE INDEX idx_created_at ON mensagens(created_at DESC);
