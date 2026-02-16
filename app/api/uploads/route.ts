import { NextResponse } from 'next/server'
import supabaseAdmin from '../../../src/lib/supabaseAdmin'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { fileName, contentType, base64, folder = 'anuncios' } = body
    if (!fileName || !base64 || !contentType) return NextResponse.json({ error: 'fileName, contentType and base64 are required' }, { status: 400 })

    // decode base64
    const matches = base64.match(/^data:(.+);base64,(.*)$/)
    const buffer = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(base64, 'base64')
    const path = `${folder}/${Date.now()}_${fileName}`

    const { error: uploadError } = await supabaseAdmin.storage.from(folder).upload(path, buffer, { contentType })
    if (uploadError) return NextResponse.json({ error: uploadError.message || 'Upload failed' }, { status: 500 })

    const { data } = supabaseAdmin.storage.from(folder).getPublicUrl(path)
    return NextResponse.json({ publicUrl: data.publicUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro no upload'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
