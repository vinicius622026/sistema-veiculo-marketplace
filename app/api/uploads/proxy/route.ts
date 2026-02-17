import { NextResponse } from 'next/server'
import supabaseAdmin from '../../../../src/lib/supabaseAdmin'
import crypto from 'crypto'

const SIGNING_SECRET = process.env.UPLOAD_SIGNING_SECRET || ''

function verifyToken(token: string, path: string, contentType: string) {
  if (!SIGNING_SECRET) return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [sig, expStr] = parts
  const expires = Number(expStr)
  if (Number.isNaN(expires) || Math.floor(Date.now() / 1000) > expires) return false
  const payload = `${path}:${contentType}:${expires}`
  const hmac = crypto.createHmac('sha256', SIGNING_SECRET).update(payload).digest()
  const expected = hmac.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return expected === sig
}

export async function POST(req: Request) {
  try {
    const path = req.headers.get('x-upload-path') || ''
    const token = req.headers.get('x-upload-token') || ''
    const contentType = req.headers.get('content-type') || 'application/octet-stream'
    if (!path || !token) return NextResponse.json({ error: 'missing headers' }, { status: 400 })
    if (!verifyToken(token, path, contentType)) return NextResponse.json({ error: 'invalid or expired token' }, { status: 403 })

    const buf = Buffer.from(await req.arrayBuffer())
    if (buf.length === 0) return NextResponse.json({ error: 'empty body' }, { status: 400 })

    // bucket is first segment of path
    const bucket = path.split('/')[0]
    // remove leading "bucket/" prefix from object key when uploading to that bucket
    let key = path
    const prefix = `${bucket}/`
    if (key.startsWith(prefix)) key = key.slice(prefix.length)

    const { error } = await supabaseAdmin.storage.from(bucket).upload(key, buf, { contentType })
    if (error) return NextResponse.json({ error: error.message || 'upload failed' }, { status: 500 })

    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(key)
    return NextResponse.json({ publicUrl: data.publicUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'proxy upload error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
