#!/usr/bin/env node
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { createClient } = require('@supabase/supabase-js')
const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create or ensure user (optionally create in Supabase Auth)
  const userEmail = process.env.SEED_USER_EMAIL || 'seed+admin@local.test'
  const seedPassword = process.env.SEED_USER_PASSWORD || 'Gratida1'
  let supabaseUserId = null

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE

  if (supabaseUrl && serviceKey) {
    try {
      const supabaseAdmin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
      console.log('Creating user in Supabase Auth (admin)...')
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: userEmail,
        password: seedPassword,
        email_confirm: true
      })
      if (error) {
        console.warn('Supabase admin createUser error:', error.message || error)
      } else if (data && data.user) {
        supabaseUserId = data.user.id
        console.log('Created Supabase auth user:', supabaseUserId)
      }
    } catch (e) {
      console.warn('Supabase admin create failed:', e.message || e)
    }
  }

  // If we created an auth user, try to sign in (requires anon key) and save tokens for E2E
  if (supabaseUserId) {
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
    if (anonKey && supabaseUrl) {
      try {
        const client = createClient(supabaseUrl, anonKey)
        console.log('Signing in created user to obtain session tokens...')
        const { data: signData, error: signErr } = await client.auth.signInWithPassword({
          email: userEmail,
          password: seedPassword
        })
        if (signErr) {
          console.warn('Sign-in failed:', signErr.message || signErr)
        } else if (signData && signData.session) {
          const out = {
            user: signData.user,
            session: signData.session
          }
          const fs = require('fs')
          const tmpPath = '/tmp/create-seed-auth.json'
          fs.writeFileSync(tmpPath, JSON.stringify(out, null, 2))
          console.log('Saved auth session to', tmpPath)
        } else {
          console.log('Sign-in returned no session data')
        }
      } catch (e) {
        console.warn('Error during sign-in:', e.message || e)
      }
    } else {
      console.log('Anon key not available; skipping sign-in/token save. You can set NEXT_PUBLIC_SUPABASE_ANON_KEY to enable this.')
    }
  }

  let user
  if (supabaseUserId) {
    user = await prisma.user.upsert({
      where: { id: supabaseUserId },
      update: { email: userEmail, full_name: 'Seed Admin' },
      create: {
        id: supabaseUserId,
        email: userEmail,
        full_name: 'Seed Admin',
        tipo_usuario: 'revenda'
      }
    })
  } else {
    user = await prisma.user.upsert({
      where: { email: userEmail },
      update: { full_name: 'Seed Admin' },
      create: {
        email: userEmail,
        full_name: 'Seed Admin',
        tipo_usuario: 'revenda'
      }
    })
  }
  console.log('Ensured user:', user.email, user.id)

  // Ensure a revenda for this user
  const revendaNome = 'Seed Revenda'
  let revenda = await prisma.revenda.findFirst({ where: { nome: revendaNome, owner_id: user.id } })
  if (!revenda) {
    revenda = await prisma.revenda.create({
      data: {
        owner_id: user.id,
        nome: revendaNome,
        cnpj: '00.000.000/0000-00',
        endereco: 'Rua Seed, 123',
        cidade: 'Cidade Seed',
        estado: 'ST',
        telefone: '0000-0000',
        email_contato: userEmail,
      }
    })
    console.log('Created revenda:', revenda.id)
  } else {
    console.log('Found existing revenda:', revenda.id)
  }

  // Create a vehicle
  const veiculo = await prisma.veiculo.create({
    data: {
      revenda_id: revenda.id,
      placa: 'ABC-0000',
      chassi: 'CHASSI-1234567890',
      marca: 'SeedMotors',
      modelo: 'Seed 1.0',
      ano: 2022,
      valor: 35000.0,
      km: 12000,
      status: 'disponivel'
    }
  })
  console.log('Created veiculo:', veiculo.id)

  // Create an anuncio
  const anuncio = await prisma.anuncio.create({
    data: {
      estoque_id: veiculo.id,
      revenda_id: revenda.id,
      titulo: 'Seed Anúncio - Veículo 1',
      descricao: 'Anúncio seed criado automaticamente',
      preco: 35000.0,
      cidade: revenda.cidade,
      estado: revenda.estado,
      foto_url: null
    }
  })
  console.log('Created anuncio:', anuncio.id)

  console.log('Seed finished.')
}

main()
  .catch((e) => {
    console.error('Seed error', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
