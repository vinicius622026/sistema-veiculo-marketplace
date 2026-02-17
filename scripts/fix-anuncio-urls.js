#!/usr/bin/env node
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Procurando anúncios com URLs duplicadas...')
  const anuncios = await prisma.anuncio.findMany({
    where: {
      OR: [
        { foto_url: { contains: '/anuncios/anuncios/' } },
        { thumbnail_url: { contains: '/anuncios/anuncios/' } },
      ],
    },
  })

  if (!anuncios.length) {
    console.log('Nenhum registro encontrado.')
    await prisma.$disconnect()
    return
  }

  for (const a of anuncios) {
    const updates = {}
    if (a.foto_url && a.foto_url.includes('/anuncios/anuncios/')) {
      updates.foto_url = a.foto_url.replace('/anuncios/anuncios/', '/anuncios/')
    }
    if (a.thumbnail_url && a.thumbnail_url.includes('/anuncios/anuncios/')) {
      updates.thumbnail_url = a.thumbnail_url.replace('/anuncios/anuncios/', '/anuncios/')
    }
    if (Object.keys(updates).length) {
      await prisma.anuncio.update({ where: { id: a.id }, data: updates })
      console.log(`Atualizado anuncio ${a.id}:`, updates)
    }
  }

  console.log('Correção concluída.')
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error('Erro:', e)
  try { await prisma.$disconnect() } catch (e) {}
  process.exit(1)
})
