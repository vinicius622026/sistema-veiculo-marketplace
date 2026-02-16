const { PrismaClient } = require('@prisma/client')
const supabaseAdmin = require('../src/lib/supabaseAdmin').default
const prisma = new PrismaClient()

async function extractBucketAndPath(publicUrl) {
  try {
    const url = new URL(publicUrl)
    const parts = url.pathname.split('/').filter(Boolean)
    const publicIndex = parts.indexOf('public')
    if (publicIndex >= 0 && parts.length > publicIndex + 1) {
      const bucket = parts[publicIndex + 1]
      const path = parts.slice(publicIndex + 2).join('/')
      return { bucket, path }
    }
  } catch (e) {}
  return null
}

;(async () => {
  console.log('Iniciando verificação de imagens órfãs...')
  const anuncios = await prisma.anuncio.findMany({ select: { foto_url: true, thumbnail_url: true } })
  const referenced = new Set()
  for (const a of anuncios) {
    if (a.foto_url) {
      const info = await extractBucketAndPath(a.foto_url)
      if (info) referenced.add(`${info.bucket}/${info.path}`)
    }
    if (a.thumbnail_url) {
      const info = await extractBucketAndPath(a.thumbnail_url)
      if (info) referenced.add(`${info.bucket}/${info.path}`)
    }
  }

  // For each bucket referenced, list objects and remove orphans
  const buckets = ['anuncios']
  for (const bucket of buckets) {
    console.log('Listando bucket', bucket)
    const { data, error } = await supabaseAdmin.storage.from(bucket).list('', { limit: 1000, offset: 0, sortBy: { column: 'name', order: 'asc' } })
    if (error) {
      console.error('Erro listando bucket', bucket, error.message)
      continue
    }
    // data contains files and possibly folders; handle files
    const toRemove = []
    for (const item of data) {
      const key = `${bucket}/${item.name}`
      if (!referenced.has(key)) toRemove.push(item.name)
    }
    if (toRemove.length) {
      console.log('Removendo', toRemove.length, 'arquivos órfãos do bucket', bucket)
      const { error: remErr } = await supabaseAdmin.storage.from(bucket).remove(toRemove)
      if (remErr) console.error('Erro ao remover:', remErr.message)
      else console.log('Removidos com sucesso')
    } else {
      console.log('Nenhum órfão encontrado em', bucket)
    }
  }

  await prisma.$disconnect()
  console.log('Finalizado')
})().catch((e) => { console.error(e); process.exit(1) })
