import { NextResponse } from 'next/server'
import supabaseAdmin from '../../../../src/lib/supabaseAdmin'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const CLEANUP_SECRET = process.env.CLEANUP_SECRET || ''

function extractBucketAndPath(publicUrl: string) {
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

export async function POST(req: Request) {
  const auth = req.headers.get('x-cleanup-secret')
  if (!CLEANUP_SECRET || auth !== CLEANUP_SECRET) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  try {
    const anuncios = await prisma.anuncio.findMany({ select: { foto_url: true, thumbnail_url: true } })
    const referenced = new Set<string>()
    for (const a of anuncios) {
      if ((a as any).foto_url) {
        const info = extractBucketAndPath((a as any).foto_url)
        if (info) referenced.add(`${info.bucket}/${info.path}`)
      }
      if ((a as any).thumbnail_url) {
        const info = extractBucketAndPath((a as any).thumbnail_url)
        if (info) referenced.add(`${info.bucket}/${info.path}`)
      }
    }

    const buckets = ['anuncios']
    const removed: string[] = []
    for (const bucket of buckets) {
      const { data, error } = await supabaseAdmin.storage.from(bucket).list('', { limit: 1000 })
      if (error) continue
      const toRemove: string[] = []
      for (const item of data) {
        const key = `${bucket}/${item.name}`
        if (!referenced.has(key)) toRemove.push(item.name)
      }
      if (toRemove.length) {
        await supabaseAdmin.storage.from(bucket).remove(toRemove)
        removed.push(...toRemove.map(n => `${bucket}/${n}`))
      }
    }

    return NextResponse.json({ ok: true, removed })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro' 
    return NextResponse.json({ error: message }, { status: 500 })
  } finally { await prisma.$disconnect() }
}
