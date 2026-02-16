import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import supabaseAdmin from '../../../../../src/lib/supabaseAdmin'
import { prisma } from '../../../../../src/lib/prisma'

const LOG_FILE = path.resolve(process.cwd(), 'var', 'cleanup-history.log')

async function getUserFromAuthHeader(req: Request) {
  const auth = req.headers.get('authorization')
  if (!auth) return null
  const token = auth.replace('Bearer ', '')
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data.user) return null
  return data.user
}

export async function GET(req: Request) {
  const user = await getUserFromAuthHeader(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (!dbUser) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if ((dbUser as any).role !== 'admin' && (dbUser as any).tipo_usuario !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    if (!fs.existsSync(LOG_FILE)) return NextResponse.json({ entries: [] })
    const content = fs.readFileSync(LOG_FILE, 'utf-8')
    const lines = content.split('\n').filter(Boolean)
    const entries = lines.map(line => {
      try { return JSON.parse(line) } catch (e) { return { raw: line } }
    })
    return NextResponse.json({ entries })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
