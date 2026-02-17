#!/usr/bin/env bash
set -euo pipefail

# scripts/set-github-secrets.sh
# Usa o CLI `gh` para criar/atualizar secrets do repositório.
# Exemplo de uso:
# export DATABASE_URL="..."
# export NEXT_PUBLIC_SUPABASE_URL="..."
# export NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
# export SUPABASE_SERVICE_ROLE_KEY="..."
# export NEXT_PUBLIC_BASE_URL="https://seu-dominio"
# export VERCEL_TOKEN="..." (opcional)
# then: ./scripts/set-github-secrets.sh

REQUIRED=(
  DATABASE_URL
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
)

OPTIONAL=(
  NEXT_PUBLIC_BASE_URL
  VERCEL_TOKEN
  VERCEL_ORG_ID
  VERCEL_PROJECT_ID
  VERCEL_SCOPE
  UPLOAD_SIGNING_SECRET
)

if ! command -v gh >/dev/null 2>&1; then
  echo "erro: CLI 'gh' não encontrado. Instale em https://cli.github.com/"
  echo "Ou defina os secrets manualmente nas Settings → Secrets do repositório."
  exit 1
fi

# Carrega variáveis de .env e .env.local (se existirem)
load_env_file() {
  local f="$1"
  if [ -f "$f" ]; then
    echo "carregando variáveis de $f"
    while IFS= read -r line || [ -n "$line" ]; do
      # pula comentários e linhas vazias
      [[ "$line" =~ ^[[:space:]]*# ]] && continue
      [[ -z "$line" ]] && continue
      # exporta apenas linhas no formato KEY=VALUE
      if [[ "$line" =~ ^[A-Za-z_][A-Za-z0-9_]*= ]]; then
        export "$line"
      fi
    done < "$f"
  fi
}

load_env_file ".env"
load_env_file ".env.local"

set_secret() {
  local name="$1"
  local value="$2"
  if [ -z "$value" ]; then
    echo "pulando $name (vazio)"
    return
  fi
  echo "definindo secret: $name"
  printf '%s' "$value" | gh secret set "$name"
}

for name in "${REQUIRED[@]}"; do
  val="${!name:-}"
  if [ -z "$val" ]; then
    echo "erro: variável de ambiente $name não definida. Defina-a e rode o script novamente." >&2
    exit 1
  fi
done

for name in "${REQUIRED[@]}"; do
  set_secret "$name" "${!name}"
done

for name in "${OPTIONAL[@]}"; do
  set_secret "$name" "${!name:-}"
done

echo "Todos os secrets requeridos foram criados/atualizados com sucesso."
