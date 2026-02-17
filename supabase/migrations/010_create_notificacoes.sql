CREATE TABLE IF NOT EXISTS historico_notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  revenda_id UUID NOT NULL REFERENCES revendas(id),
  tipo TEXT CHECK (tipo IN ('email', 'sms', 'push')),
  assunto TEXT,
  corpo TEXT,
  destinatario TEXT,
  status TEXT CHECK (status IN ('enviado', 'falha', 'pendente')) DEFAULT 'pendente',
  created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE historico_notificacoes ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_revenda_id ON historico_notificacoes(revenda_id);
