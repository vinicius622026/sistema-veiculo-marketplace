#!/usr/bin/env ts-node

import fs from 'node:fs'
import path from 'node:path'

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
}

type Color = keyof typeof colors

function log(msg: string, color: Color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`)
}

function exists(relPath: string) {
  return fs.existsSync(path.join(process.cwd(), relPath))
}

function validateStructure() {
  log('\n🔍 Validando estrutura do projeto...\n', 'blue')

  const requiredFiles = [
    'src/utils/formatters.ts',
    'src/utils/helpers.ts',
    'src/services/supabaseClient.ts',
    'src/components/Layout/Header.tsx',
    'app/page.tsx',
    'app/login/page.tsx',
    'app/signup/page.tsx',
    'app/anuncios/page.tsx',
    'app/dashboard/page.tsx',
    'app/api/anuncios/route.ts',
    'app/api/revendas/route.ts',
    'src/validations/veiculo.ts',
    '.env.local',
    'tsconfig.json',
    'cypress.config.ts',
    'jest.config.js',
  ]

  let missing = 0
  for (const file of requiredFiles) {
    if (exists(file)) {
      log(`✓ ${file}`, 'green')
    } else {
      log(`✗ ${file}`, 'red')
      missing++
    }
  }

  const hasNextConfig = exists('next.config.ts') || exists('next.config.js') || exists('next.config.mjs')
  if (hasNextConfig) {
    log('✓ next.config.(ts|js|mjs)', 'green')
  } else {
    log('⚠ next.config não encontrado (usando configuração padrão do Next)', 'yellow')
  }

  return missing === 0
}

function validateDependencies() {
  log('\n📦 Validando dependências...\n', 'blue')
  const pkgPath = path.join(process.cwd(), 'package.json')
  if (!fs.existsSync(pkgPath)) {
    log('✗ package.json não encontrado', 'red')
    return false
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  const requiredDeps = [
    'next',
    'react',
    'react-dom',
    'typescript',
    '@supabase/supabase-js',
    'zod',
    'cypress',
    'jest',
  ]

  let allOk = true
  for (const dep of requiredDeps) {
    const found = pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]
    if (found) {
      log(`✓ ${dep}`, 'green')
    } else {
      log(`✗ ${dep} não instalado`, 'red')
      allOk = false
    }
  }

  return allOk
}

function validateEnv() {
  log('\n🔐 Validando variáveis de ambiente...\n', 'blue')

  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) {
    log('✗ .env.local não encontrado', 'red')
    return false
  }

  const envContent = fs.readFileSync(envPath, 'utf-8')
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_APP_URL',
  ]

  let allPresent = true
  for (const variable of requiredVars) {
    const regex = new RegExp(`^${variable}=.+`, 'm')
    if (regex.test(envContent)) {
      log(`✓ ${variable}`, 'green')
    } else {
      log(`✗ ${variable} faltando ou vazio`, 'red')
      allPresent = false
    }
  }

  return allPresent
}

function validateTypeScript() {
  log('\n📘 Validando TypeScript...\n', 'blue')

  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json')
  if (!fs.existsSync(tsconfigPath)) {
    log('✗ tsconfig.json não encontrado', 'red')
    return false
  }

  try {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'))
    if (tsconfig.compilerOptions?.paths?.['@/*']) {
      log('✓ Alias @/* configurado', 'green')
    } else {
      log('⚠ Alias @/* não encontrado', 'yellow')
    }
    return true
  } catch {
    log('✗ tsconfig.json inválido', 'red')
    return false
  }
}

async function runValidations() {
  log('\n' + '='.repeat(60), 'blue')
  log('🧪 VALIDAÇÃO DO PROJETO', 'blue')
  log('='.repeat(60), 'blue')

  const checks = [
    { name: 'Estrutura', fn: validateStructure },
    { name: 'Dependências', fn: validateDependencies },
    { name: 'Variáveis de Ambiente', fn: validateEnv },
    { name: 'TypeScript', fn: validateTypeScript },
  ]

  const results = checks.map((check) => ({
    name: check.name,
    success: check.fn(),
  }))

  log('\n' + '='.repeat(60), 'blue')
  log('📋 RESUMO', 'blue')
  log('='.repeat(60), 'blue')

  const allSuccess = results.every((r) => r.success)
  const successCount = results.filter((r) => r.success).length

  for (const result of results) {
    const status = result.success ? '✓' : '✗'
    log(`${status} ${result.name}`, result.success ? 'green' : 'red')
  }

  log(`\n${successCount}/${results.length} validações OK`, allSuccess ? 'green' : 'yellow')

  if (!allSuccess) {
    log('\n⚠️ Algumas validações falharam. Verifique os itens acima.', 'yellow')
    process.exit(1)
  }

  log('\n✅ Todas as validações passaram!', 'green')
}

runValidations()
