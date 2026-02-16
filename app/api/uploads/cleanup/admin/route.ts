import { NextResponse } from 'next/server'
import { runCleanup } from '../../../../../src/lib/cleanup'
import fs from 'fs'
import path from 'path'
import supabaseAdmin from '../../../../../src/lib/supabaseAdmin'

const LOG_PATH = path.resolve(process.cwd(), 'var')
const LOG_FILE = path.join(LOG_PATH, 'cleanup-history.log')

async function getUserFromAuthHeader(req: Request) {
  const auth = req.headers.get('authorization')
  if (!auth) return null
  const token = auth.replace('Bearer ', '')
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data.user) return null
  return data.user
}

export async function POST(req: Request) {
  const user = await getUserFromAuthHeader(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const meta = (user as any).user_metadata || {}
  if (meta.role !== 'admin' && meta.tipo_usuario !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  try {
    const removed = await runCleanup(['anuncios'])
    if (!fs.existsSync(LOG_PATH)) fs.mkdirSync(LOG_PATH, { recursive: true })
    const entry = { at: new Date().toISOString(), removed, by: user.id }
    fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n')
    return NextResponse.json({ ok: true, entry })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
