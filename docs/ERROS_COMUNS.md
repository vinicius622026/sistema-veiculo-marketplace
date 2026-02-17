# 🐛 Guia de Erros Comuns e Soluções

## 1) `NEXT_PUBLIC_SUPABASE_URL` ausente
**Causa:** `.env.local` sem variáveis obrigatórias.

**Solução:**
1. Crie/edite `.env.local`.
2. Defina `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL`.
3. Reinicie o servidor (`pnpm run dev`).

---

## 2) `ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND`
**Causa:** terminal abriu em diretório sem `package.json`.

**Solução:**
1. Entre no diretório correto do projeto.
2. Rode `pnpm install` e depois `pnpm run dev`.

---

## 3) Erro de `Link` no Next (`Invalid <Link> with <a> child`)
**Causa:** sintaxe antiga de `Link`.

**Solução:**
- Troque de:
```tsx
<Link href="/"><a>Home</a></Link>
```
- Para:
```tsx
<Link href="/">Home</Link>
```

---

## 4) `Unauthorized` em APIs
**Causa:** rota protegida exige `Authorization: Bearer <token>`.

**Solução:**
- Faça login e envie o token no header.
- Valide sessão antes de chamar APIs de escrita.

---

## 5) `500` em rota dinâmica (`/api/mensagens/:id`)
**Causa:** ID inválido (não UUID).

**Solução:**
- Envie UUID válido.
- Em caso de erro de validação, retornar `400` (não `500`).

---

## 6) `404` para assets (ex.: `/placeholder-car.png`)
**Causa:** arquivo estático inexistente.

**Solução:**
- Adicione arquivo em `public/` ou ajuste referência.

---

## 7) Build falha por tipo/lint
**Causa:** inconsistências em TS ou regras de lint.

**Solução:**
```bash
pnpm run type-check
pnpm run lint
pnpm run build
```

---

## 8) Cypress não conecta em `localhost:3000`
**Causa:** app não está ativa, porta errada ou `baseUrl` incorreta.

**Solução:**
1. Suba o app (`pnpm run dev`).
2. Verifique `cypress.config.ts` (`baseUrl`).
3. Teste `curl -I http://localhost:3000`.
