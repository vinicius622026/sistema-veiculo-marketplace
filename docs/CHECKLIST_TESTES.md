# ✅ Checklist de Testes e Validação

## Setup
- [ ] `pnpm install`
- [ ] `.env.local` configurado
- [ ] Banco acessível (`DATABASE_URL`)
- [ ] App rodando em `http://localhost:3000`

## Estrutura
- [ ] Rotas App Router (`app/`) carregam sem `500`
- [ ] APIs principais (`/api/anuncios`, `/api/revendas`) respondem
- [ ] Validações Zod existentes em `src/validations`

## Unitário (Jest)
- [ ] `pnpm run test`
- [ ] `pnpm run test:coverage`
- [ ] Testes de `formatters`, `helpers`, `validations` passando

## Integração API
- [ ] Teste de GET `/api/anuncios` passando
- [ ] Teste de POST sem auth retornando `401`
- [ ] Teste de validação inválida retornando `400`

## E2E (Cypress)
- [ ] `pnpm run e2e:run`
- [ ] Fluxo base de auth (`/login`, `/signup`)
- [ ] Fluxo marketplace/anúncios (`/anuncios`)
- [ ] Fluxo dashboard/estoque sem erro crítico

## Qualidade
- [ ] `pnpm run type-check`
- [ ] `pnpm run build`
- [ ] `pnpm run validate`
- [ ] `pnpm run report:errors`

## Pré-deploy
- [ ] Variáveis reais de produção configuradas
- [ ] Migrações aplicadas (`prisma migrate deploy`)
- [ ] Build validado em ambiente de produção
