import { NextResponse } from 'next/server'
import supabaseAdmin from '../../../src/lib/supabaseAdmin'
import sharp from 'sharp'

const MAX_BYTES = 5 * 1024 * 1024 // 5MB

function extractBucketAndPath(publicUrl: string) {
  // supabase public url format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
  try {
    const url = new URL(publicUrl)
    const parts = url.pathname.split('/').filter(Boolean)
    // find 'public' then bucket and rest
    const publicIndex = parts.indexOf('public')
    if (publicIndex >= 0 && parts.length > publicIndex + 1) {
      const bucket = parts[publicIndex + 1]
      const path = parts.slice(publicIndex + 2).join('/')
      return { bucket, path }
    }
  } catch (e) { /* ignore */ }
  return null
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { fileName, contentType, base64, folder = 'anuncios' } = body
    if (!fileName || !base64 || !contentType) return NextResponse.json({ error: 'fileName, contentType and base64 are required' }, { status: 400 })

    // decode base64
    const matches = base64.match(/^data:(.+);base64,(.*)$/)
    const buffer = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(base64, 'base64')

    // validate size and type
    if (buffer.length > MAX_BYTES) return NextResponse.json({ error: 'file too large (max 5MB)' }, { status: 400 })
    if (!contentType.startsWith('image/')) return NextResponse.json({ error: 'only image uploads are allowed' }, { status: 400 })

    const baseName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9_.-]/g, '_')}`
    const mainPath = `${folder}/${baseName}`

    // Optionally resize main image to width 1600 if larger
    const mainBuffer = await sharp(buffer).resize({ width: 1600, withoutEnlargement: true }).toBuffer()

    const { error: uploadError } = await supabaseAdmin.storage.from(folder).upload(mainPath, mainBuffer, { contentType })
    if (uploadError) return NextResponse.json({ error: uploadError.message || 'Upload failed' }, { status: 500 })

    // generate thumbnail
    const thumbBuffer = await sharp(buffer).resize(400, 300, { fit: 'cover' }).toBuffer()
    const thumbPath = `${folder}/thumbnails/${baseName}`
    const { error: thumbError } = await supabaseAdmin.storage.from(folder).upload(thumbPath, thumbBuffer, { contentType })
    if (thumbError) return NextResponse.json({ error: thumbError.message || 'Thumbnail upload failed' }, { status: 500 })

    const { data: mainData } = supabaseAdmin.storage.from(folder).getPublicUrl(mainPath)
    const { data: thumbData } = supabaseAdmin.storage.from(folder).getPublicUrl(thumbPath)
    return NextResponse.json({ publicUrl: mainData.publicUrl, thumbnailUrl: thumbData.publicUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro no upload'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
