# 🧪 Guia de Execução de Testes

## 1) Validação estrutural e ambiente
```bash
pnpm run validate
```

## 2) Testes unitários + integração (Jest)
```bash
pnpm run test
pnpm run test:watch
pnpm run test:coverage
```

## 3) E2E com Cypress
```bash
pnpm run e2e
pnpm run e2e:run
```

## 4) Type-check, lint e build
```bash
pnpm run type-check
pnpm run lint
pnpm run build
```

## 5) Relatório rápido de erros
```bash
pnpm run report:errors
```

## 6) Fluxo completo recomendado
```bash
pnpm run validate
pnpm run test
pnpm run type-check
pnpm run lint
pnpm run build
pnpm run e2e:run
```

Se todos passarem ✅, o sistema está pronto para próximo estágio (homologação/deploy).
