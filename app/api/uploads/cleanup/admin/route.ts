import { NextResponse } from 'next/server'
import { runCleanup } from '../../../../../src/lib/cleanup'
import fs from 'fs'
import path from 'path'

const LOG_PATH = path.resolve(process.cwd(), 'var')
const LOG_FILE = path.join(LOG_PATH, 'cleanup-history.log')
const CLEANUP_SECRET = process.env.CLEANUP_SECRET || ''

export async function POST(req: Request) {
  const auth = req.headers.get('x-cleanup-secret')
  if (!CLEANUP_SECRET || auth !== CLEANUP_SECRET) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  try {
    const removed = await runCleanup(['anuncios'])
    if (!fs.existsSync(LOG_PATH)) fs.mkdirSync(LOG_PATH, { recursive: true })
    const entry = { at: new Date().toISOString(), removed }
    fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n')
    return NextResponse.json({ ok: true, entry })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
