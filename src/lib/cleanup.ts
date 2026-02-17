import supabaseAdmin from './supabaseAdmin'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

export async function runCleanup(buckets: string[] = ['anuncios'], pageSize = 1000) {
  const anuncios = await (prisma as any).anuncio.findMany({ select: { foto_url: true, thumbnail_url: true } })
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

  const removed: string[] = []
  for (const bucket of buckets) {
    let offset = 0
    while (true) {
      const { data, error } = await supabaseAdmin.storage.from(bucket).list('', { limit: pageSize, offset })
      if (error) break
      if (!data || data.length === 0) break
      const toRemove: string[] = []
      for (const item of data) {
        const key = `${bucket}/${item.name}`
        if (!referenced.has(key)) toRemove.push(item.name)
      }
      if (toRemove.length) {
        const { error: remErr } = await supabaseAdmin.storage.from(bucket).remove(toRemove)
        if (!remErr) removed.push(...toRemove.map(n => `${bucket}/${n}`))
      }
      if (data.length < pageSize) break
      offset += data.length
    }
  }

  return removed
}
