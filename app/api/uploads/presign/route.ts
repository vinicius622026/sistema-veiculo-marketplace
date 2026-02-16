import { NextResponse } from 'next/server'
import crypto from 'crypto'

const SIGNING_SECRET = process.env.UPLOAD_SIGNING_SECRET || ''
const UPLOAD_TTL = 60 * 5 // 5 minutes

function base64url(buf: Buffer) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export async function POST(req: Request) {
  if (!SIGNING_SECRET) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  try {
    const body = await req.json()
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
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
