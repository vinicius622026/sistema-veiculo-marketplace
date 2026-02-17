#!/usr/bin/env ts-node

import { execSync } from 'node:child_process'

function run(command: string) {
  try {
    const output = execSync(command, { stdio: 'pipe', encoding: 'utf-8' })
    return { ok: true, output }
  } catch (error: any) {
    return {
      ok: false,
      output: error?.stdout?.toString?.() || '',
      error: error?.stderr?.toString?.() || error?.message || 'Erro desconhecido',
    }
  }
}

function section(title: string) {
  console.log(`\n${'='.repeat(70)}`)
  console.log(`📌 ${title}`)
  console.log('='.repeat(70))
}

section('RELATÓRIO DE ERROS - QA')

section('TypeScript (tsc --noEmit)')
const ts = run('npx tsc --noEmit')
console.log(ts.ok ? '✅ Sem erros de tipo' : '❌ Erros de tipo encontrados')
if (!ts.ok) {
  console.log(ts.output || ts.error)
}

section('Build (next build)')
const build = run('pnpm build')
console.log(build.ok ? '✅ Build concluído' : '❌ Falha no build')
if (!build.ok) {
  console.log(build.output || build.error)
}

section('Resumo final')
if (ts.ok && build.ok) {
  console.log('✅ Nenhum erro crítico encontrado (type-check + build)')
  process.exit(0)
}

console.log('⚠️ Foram encontrados erros. Corrija e execute novamente: pnpm run report:errors')
process.exit(1)
