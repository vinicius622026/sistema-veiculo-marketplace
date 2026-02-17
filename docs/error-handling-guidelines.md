**Guia de Mapeamento e Correção de Erros**

Objetivo: estabelecer uma diretriz central para sempre mapear erros, registrar a solução aplicada e replicar a correção em todos os locais que possam sofrer do mesmo problema.

- **Passo 1 — Capturar o erro**: registrar mensagem completa, stack trace, endpoint/arquivo e condições de reprodução (passos, payloads, ambiente, variáveis de ambiente).
- **Passo 2 — Identificar causa-raiz**: diferenciar sintoma vs causa; reproduzir localmente; isolar módulos envolvidos (bundler, postcss, Prisma, Supabase, etc.).
- **Passo 3 — Criar patch corretivo mínimo**: aplicar a menor mudança que resolve a causa-raiz (ex.: adicionar `postcss.config.js`, marcar componente `use client`, ajustar validação de payload, criar fallback seguro).
- **Passo 4 — Buscar ocorrências semelhantes**: usar busca no repositório (grep/file search) por padrões relevantes (ex.: `@apply`, `onClick`, `foreign key`, `supabase.auth.getUser`) e analisar se o mesmo problema pode ocorrer.
- **Passo 5 — Replicar a solução**: aplicar a correção nos outros pontos encontrados — prefira mudanças de infraestrutura/config (ex.: configuração Tailwind/PostCSS) em vez de fixes pontuais quando possível.
- **Passo 6 — Testar E2E e unitário**: rodar fluxo que reproduzia o erro e testes relacionados; adicionar testes ou smoke checks que previnam regressão.
- **Passo 7 — Registrar o incidente e a solução**: criar um breve registro no changelog/issue com: erro, causa-raiz, arquivos alterados, comandos para reproduzir e verificar.
- **Passo 8 — Automatizar prevenção**: quando possível, adicionar lint rules, CI checks ou testes que capturem o padrão (ex.: proibir `@apply` mal resolvido sem config, exigir `use client` em componentes interativos).

Exemplos práticos (casos recentes no repositório):
- Tailwind `@apply` / utilidade desconhecida: solução aplicada — adicionar `tailwind.config.js` + `postcss.config.js`; alternativa: substituir `@apply` por CSS direto se imediata correção necessária. Buscar outros arquivos com `@apply`.
- Event handlers em componentes Server: solução aplicada — marcar componentes com `"use client"` ou mover handlers para componentes cliente; buscar `onClick`, `onSubmit`, `onChange` globalmente.
- Prisma FK `foreign key constraint failed`: solução aplicada — garantir que registros parentes existam antes (criar `Veiculo` a partir do payload) ou validar/rejeitar a requisição com mensagem clara; buscar endpoints/criações que possam omitir IDs.

Checklist rápido para PRs corretivas:
- [ ] Log do erro anexado à PR
- [ ] Causa-raiz descrita
- [ ] Mudança mínima aplicada
- [ ] Verificação manual/E2E realizada
- [ ] Buscas e correções replicadas onde aplicável
- [ ] Testes/CI adicionados (se possível)

Manutenção: mantenha este documento atualizado sempre que um novo padrão de erro for identificado e solucionado.
