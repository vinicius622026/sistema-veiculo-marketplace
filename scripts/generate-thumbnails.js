#!/usr/bin/env node
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { createClient } = require('@supabase/supabase-js')
const sharp = require('sharp')

const prisma = new PrismaClient()

function extractBucketAndPath(publicUrl) {
  try {
    const url = new URL(publicUrl)
    const parts = url.pathname.split('/').filter(Boolean)
    const publicIndex = parts.indexOf('public')
    if (publicIndex >= 0 && parts.length > publicIndex + 1) {
      const bucket = parts[publicIndex + 1]
      const path = parts.slice(publicIndex + 2).join('/')
      return { bucket, path }
    }
  } catch (e) { }
  return null
}

async function main() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('Missing Supabase env vars NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

  const anuncios = await prisma.anuncio.findMany({ where: { foto_url: { not: null }, thumbnail_url: null } })
  if (!anuncios.length) {
    console.log('Nenhum anuncio sem thumbnail encontrado.')
    await prisma.$disconnect()
    return
  }

  for (const a of anuncios) {
    try {
      if (!a.foto_url) continue
      const info = extractBucketAndPath(a.foto_url)
      if (!info) {
        console.warn(`Não foi possível extrair bucket/path de ${a.foto_url}`)
        continue
      }
      const { bucket, path } = info

      // download original
      const res = await fetch(a.foto_url)
      if (!res.ok) {
        console.warn(`Falha ao baixar ${a.foto_url}: ${res.status}`)
        continue
      }
      const buf = Buffer.from(await res.arrayBuffer())

      // generate thumbnail (max width 800, auto height)
      const thumbBuf = await sharp(buf).resize({ width: 800 }).toBuffer()

      // create thumbnail key
      const base = path.split('/').pop() || `anuncio-${a.id}.png`
      const thumbKey = `thumbnails/${base}`

      // upload to same bucket
      const { error: uploadErr } = await supabase.storage.from(bucket).upload(thumbKey, thumbBuf, { contentType: 'image/png', upsert: true })
      if (uploadErr) {
        console.warn(`Erro upload thumbnail para ${bucket}/${thumbKey}:`, uploadErr.message || uploadErr)
        continue
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(thumbKey)
      const thumbnailUrl = data.publicUrl

      await prisma.anuncio.update({ where: { id: a.id }, data: { thumbnail_url: thumbnailUrl } })
      console.log(`Gerado thumbnail para anuncio ${a.id}: ${thumbnailUrl}`)
    } catch (e) {
      console.error('Erro processando anuncio', a.id, e.message || e)
    }
  }

  await prisma.$disconnect()
}

main().catch(async (e) => { console.error(e); try { await prisma.$disconnect() } catch {} ; process.exit(1) })
