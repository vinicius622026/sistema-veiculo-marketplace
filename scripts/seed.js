#!/usr/bin/env node
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create or ensure user
  const userEmail = process.env.SEED_USER_EMAIL || 'seed+admin@local.test'
  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: { full_name: 'Seed Admin' },
    create: {
      email: userEmail,
      full_name: 'Seed Admin',
      tipo_usuario: 'revenda'
    }
  })
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
