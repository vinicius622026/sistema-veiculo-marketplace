#!/usr/bin/env bash
set -euo pipefail

echo "Applying migrations locally"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL is not set. Export it and re-run." >&2
  exit 1
fi

MIGRATIONS_DIR="supabase/migrations"

if command -v psql >/dev/null 2>&1 && [ -d "$MIGRATIONS_DIR" ]; then
  echo "psql found — applying SQL files from $MIGRATIONS_DIR"
  for f in $(ls "$MIGRATIONS_DIR"/*.sql 2>/dev/null | sort); do
    echo "-- applying $f"
    psql "$DATABASE_URL" -f "$f"
  done
  echo "All SQL migrations applied via psql."
else
  echo "psql not available or no SQL migrations found — falling back to Prisma DB sync"
  if command -v pnpm >/dev/null 2>&1; then
    pnpm prisma db push
  else
    echo "pnpm not available — please run 'pnpm prisma db push' manually." >&2
    exit 1
  fi
fi

echo "Running seed (if present)"
if [ -f "scripts/seed.js" ]; then
  if command -v pnpm >/dev/null 2>&1; then
    pnpm run seed
  else
    node scripts/seed.js
  fi
else
  echo "No seed script found at scripts/seed.js — skipping seed."
fi

echo "Migrations + seed finished."
