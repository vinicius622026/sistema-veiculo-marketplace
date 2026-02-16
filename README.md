# Sistema Veículo Marketplace - Setup rápido

Passos rápidos para iniciar o projeto localmente (pnpm):

Pré-requisitos
- Node.js instalado (recomendado >= 18)
- pnpm instalado (corepack ou `npm i -g pnpm`)
- Banco Postgres acessível (ou Supabase)

1) Instalar dependências

```bash
pnpm install
```

2) Criar arquivo de ambiente

Crie um arquivo `.env` na raiz com as variáveis mínimas:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# (opcional) SUPABASE_SERVICE_ROLE_KEY=...
```

3) Gerar/gerir banco (Prisma)

Se você usa migrações (recomendado):

```bash
pnpm exec prisma migrate deploy
```

Se não houver migrações e quiser aplicar o `schema.prisma` direto (teste/dev):

```bash
pnpm exec prisma db push
```

Já foi executado `pnpm exec prisma generate`, mas caso precise rodar manualmente:

```bash
pnpm exec prisma generate
```

4) Rodar em desenvolvimento (Next.js)

Se o projeto tiver script `dev` (Next.js):

```bash
pnpm run dev
```

5) Notas rápidas
- Configure as variáveis do Supabase no painel e no `.env`.
- Para deploy, configure `DATABASE_URL` e chaves do Supabase no provedor.
- Se quiser que eu crie exemplos de scripts `dev`, `build` e `start` no `package.json`, me avise.

---
Feito de forma simples — se quiser, eu adiciono um `.env.example` e scripts no `package.json`.
