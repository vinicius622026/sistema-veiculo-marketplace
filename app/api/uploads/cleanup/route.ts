import { NextResponse } from 'next/server'
import { runCleanup } from '../../../../src/lib/cleanup'
import supabaseAdmin from '../../../../src/lib/supabaseAdmin'

async function getUserFromAuthHeader(req: Request) {
  const auth = req.headers.get('authorization')
  if (!auth) return null
  const token = auth.replace('Bearer ', '')
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data.user) return null
  return data.user
}

export async function POST(req: Request) {
  // require logged admin via Supabase
  const user = await getUserFromAuthHeader(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const meta = (user as any).user_metadata || {}
  if (meta.role !== 'admin' && meta.tipo_usuario !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  try {
    const removed = await runCleanup(['anuncios'])
    return NextResponse.json({ ok: true, removed })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
