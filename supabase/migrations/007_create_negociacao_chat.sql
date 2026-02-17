CREATE TABLE IF NOT EXISTS negociacao_chat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  negociacao_id UUID NOT NULL REFERENCES negociacao_lojas(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  sender_revenda_id UUID NOT NULL REFERENCES revendas(id),
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE negociacao_chat ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Revendas view own chat" ON negociacao_chat FOR SELECT USING (
  negociacao_id IN (
    SELECT id FROM negociacao_lojas WHERE
    revenda_origem_id IN (SELECT id FROM revendas WHERE owner_id = auth.uid()) OR
    revenda_destino_id IN (SELECT id FROM revendas WHERE owner_id = auth.uid())
  )
);

CREATE INDEX idx_negociacao_id ON negociacao_chat(negociacao_id);
