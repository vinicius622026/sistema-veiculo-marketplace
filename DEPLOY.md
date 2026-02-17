**Deploy & Environment Variables**

Resumo rápido: nunca commit suas chaves reais. Use `.env.example` no repositório e configure as variáveis sensíveis no provedor/secret manager.

- **Chaves essenciais**
  - `DATABASE_URL` — string de conexão com o banco (Postgres/SQL).
  - `NEXT_PUBLIC_SUPABASE_URL` — URL do projeto Supabase (prefixo `NEXT_PUBLIC_` para cliente).
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — chave anônima (pública, usada no cliente).
  - `SUPABASE_SERVICE_ROLE_KEY` — chave de serviço (somente server-side!).
  - `NEXT_PUBLIC_BASE_URL`, `PORT`, `NODE_ENV`, `SENTRY_DSN`, etc. (opcionais)

1) Vercel (recomendado para Next.js)
  - Abra o projeto em Vercel → Settings → Environment Variables.
  - Adicione as variáveis listadas acima. Marque `SUPABASE_SERVICE_ROLE_KEY` como `Environment: Production`/`Preview` mas NUNCA exponha ao cliente.
  - Deploy: Vercel usará as variáveis no build/runtime automaticamente.

2) Netlify
  - Site settings → Build & deploy → Environment → Environment variables.
  - Adicione as mesmas variáveis.

3) Docker (compose)
  - Exemplo `docker-compose.yml` snippet:

```yaml
services:
  web:
    build: .
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    ports:
      - "3000:3000"
```

4) Kubernetes (Secret)
  - Crie um Secret e referencie no Deployment:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-env
type: Opaque
data:
  DATABASE_URL: <base64>
  NEXT_PUBLIC_SUPABASE_URL: <base64>
  NEXT_PUBLIC_SUPABASE_ANON_KEY: <base64>
  SUPABASE_SERVICE_ROLE_KEY: <base64>
```

5) GitHub Actions (CI)
  - Adicione segredos em repo Settings → Secrets. No workflow use `secrets.SUPABASE_SERVICE_ROLE_KEY`.

6) Local (desenvolvimento)
  - Copie `.env.example` → `.env` e preencha localmente. **NUNCA** commit `.env` com chaves reais.

Comandos úteis:

```bash
# criar local env
cp .env.example .env
editor .env

# rodar localmente
pnpm install
pnpm run dev
```

Boas práticas:
- Use secret manager do provedor (Vercel/Netlify/GCP/AWS) para produção.
- Rotacione `SUPABASE_SERVICE_ROLE_KEY` se vazar; minimize seu uso em clientes.
- Mantenha `NEXT_PUBLIC_*` apenas para chaves que podem ser públicas.
