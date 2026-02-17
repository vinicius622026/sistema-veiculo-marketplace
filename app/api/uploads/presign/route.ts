import { NextResponse } from 'next/server'
import fs from 'fs'
import crypto from 'crypto'
import supabaseAdmin from '../../../../src/lib/supabaseAdmin'

const SIGNING_SECRET = process.env.UPLOAD_SIGNING_SECRET || ''
const UPLOAD_TTL = 60 * 5 // 5 minutes

function base64url(buf: Buffer) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function getUserFromAuthHeader(req: Request) {
  const auth = req.headers.get('authorization')
  if (!auth) return null
  const token = auth.replace('Bearer ', '')
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data.user) return null
  return data.user
}

export async function POST(req: Request) {
  try { fs.appendFileSync('/tmp/presign-debug.log', `ENTRY ${new Date().toISOString()}\n`) } catch (e) {}
  if (!SIGNING_SECRET) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  try {
    // require authenticated user (inside try so errors surface as JSON)
    try { fs.appendFileSync('/tmp/presign-debug.log', `CHECK AUTH ${new Date().toISOString()}\n`) } catch (e) {}
    const user = await getUserFromAuthHeader(req)
    if (!user) {
      try { fs.appendFileSync('/tmp/presign-debug.log', `NO USER\n`) } catch (e) {}
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await req.json()
    try { fs.appendFileSync('/tmp/presign-debug.log', `BODY PARSED\n`) } catch (e) {}
    const { fileName, folder = 'anuncios', contentType } = body
    if (!fileName || !contentType) return NextResponse.json({ error: 'fileName and contentType required' }, { status: 400 })

    const baseName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9_.-]/g, '_')}`
    const path = `${folder}/${baseName}`
    const expires = Math.floor(Date.now() / 1000) + UPLOAD_TTL
    const payload = `${path}:${contentType}:${expires}`
    const hmac = crypto.createHmac('sha256', SIGNING_SECRET).update(payload).digest()
    const token = base64url(hmac) + '.' + expires

    // client should upload to /api/uploads/proxy with headers x-upload-path and x-upload-token
    return NextResponse.json({ uploadProxy: '/api/uploads/proxy', path, token, expires })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao gerar presign'
    try { fs.appendFileSync('/tmp/presign-debug.log', `ERROR: ${message}\n${err instanceof Error ? err.stack : ''}\n`) } catch (e) {}
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
