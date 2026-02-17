#!/usr/bin/env node
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { createClient } = require('@supabase/supabase-js')

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

async function runCleanup(buckets = ['anuncios'], pageSize = 1000) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('Missing Supabase env vars')
    process.exit(1)
  }
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

  const anuncios = await prisma.anuncio.findMany({ select: { foto_url: true, thumbnail_url: true } })
  const referenced = new Set()
  for (const a of anuncios) {
    if (a.foto_url) {
      const info = extractBucketAndPath(a.foto_url)
      if (info) referenced.add(`${info.bucket}/${info.path}`)
    }
    if (a.thumbnail_url) {
      const info = extractBucketAndPath(a.thumbnail_url)
      if (info) referenced.add(`${info.bucket}/${info.path}`)
    }
  }

  const removed = []
  for (const bucket of buckets) {
    let offset = 0
    while (true) {
      const { data, error } = await supabase.storage.from(bucket).list('', { limit: pageSize, offset })
      if (error) {
        console.error('Error listing bucket', bucket, error.message || error)
        break
      }
      if (!data || data.length === 0) break
      const toRemove = []
      for (const item of data) {
        const key = `${bucket}/${item.name}`
        if (!referenced.has(key)) toRemove.push(item.name)
      }
      if (toRemove.length) {
        const { error: remErr } = await supabase.storage.from(bucket).remove(toRemove)
        if (remErr) console.error('Error removing', toRemove, remErr.message || remErr)
        else removed.push(...toRemove.map(n => `${bucket}/${n}`))
      }
      if (data.length < pageSize) break
      offset += data.length
    }
  }
  return removed
}

async function main() {
  console.log('Starting cleanup...')
  try {
    const removed = await runCleanup()
    console.log('Removed files:', removed)
  } catch (e) {
    console.error('Cleanup error:', e.message || e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
