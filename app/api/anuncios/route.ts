import { NextResponse } from 'next/server'
import { prisma } from '../../../src/lib/prisma'
import supabaseAdmin from '../../../src/lib/supabaseAdmin'

function extractBucketAndPath(publicUrl: string) {
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

async function getUserFromAuthHeader(req: Request) {
  const auth = req.headers.get('authorization')
  if (!auth) return null
  const token = auth.replace('Bearer ', '')
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data.user) return null
  return data.user
}

export async function GET() {
  try {
    const anuncios = await prisma.anuncio.findMany({
      orderBy: { created_at: 'desc' },
      include: { veiculo: true },
    })
    return NextResponse.json(anuncios)
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao buscar anúncios' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const user = await getUserFromAuthHeader(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  try {
    // basic validation
    if (!body.revenda_id) return NextResponse.json({ error: 'revenda_id is required' }, { status: 400 })
    if (!body.titulo) return NextResponse.json({ error: 'titulo is required' }, { status: 400 })
    if (typeof body.preco !== 'number' || body.preco <= 0) return NextResponse.json({ error: 'preco must be a positive number' }, { status: 400 })

    // authorization: only owner of revenda can create anuncios
    const revenda = await prisma.revenda.findUnique({ where: { id: body.revenda_id } })
    if (!revenda) return NextResponse.json({ error: 'Revenda not found' }, { status: 404 })
    if (revenda.owner_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const anuncio = await prisma.anuncio.create({ data: {
      estoque_id: body.estoque_id || '',
      revenda_id: body.revenda_id,
      titulo: body.titulo,
      descricao: body.descricao || null,
      preco: body.preco,
      cidade: body.cidade || '',
      estado: body.estado || '',
      visitas: 0,
      ativo: body.ativo ?? true,
      foto_url: body.foto || null,
      thumbnail_url: body.thumbnail || null,
    }})
    return NextResponse.json(anuncio)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao criar anúncio'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const user = await getUserFromAuthHeader(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  try {
    const existing = await prisma.anuncio.findUnique({ where: { id: body.id } })
    if (!existing) return NextResponse.json({ error: 'Anúncio não encontrado' }, { status: 404 })
    const revenda = await prisma.revenda.findUnique({ where: { id: existing.revenda_id } })
    if (!revenda) return NextResponse.json({ error: 'Revenda relacionada não encontrada' }, { status: 404 })
    if (revenda.owner_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const updateData: any = { ...body }
    delete updateData.id
    const anuncio = await prisma.anuncio.update({ where: { id: body.id }, data: updateData })
    return NextResponse.json(anuncio)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao atualizar anúncio'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const user = await getUserFromAuthHeader(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  try {
    const existing = await prisma.anuncio.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Anúncio não encontrado' }, { status: 404 })
    const revenda = await prisma.revenda.findUnique({ where: { id: existing.revenda_id } })
    if (!revenda) return NextResponse.json({ error: 'Revenda relacionada não encontrada' }, { status: 404 })
    if (revenda.owner_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // delete images from storage if present
    const toDelete: Array<{ bucket: string, path: string }> = []
    if ((existing as any).foto_url) {
      const info = extractBucketAndPath((existing as any).foto_url)
      if (info) toDelete.push(info)
    }
    if ((existing as any).thumbnail_url) {
      const info = extractBucketAndPath((existing as any).thumbnail_url)
      if (info) toDelete.push(info)
    }
    for (const item of toDelete) {
      try {
        await supabaseAdmin.storage.from(item.bucket).remove([item.path])
      } catch (e) { /* continue */ }
    }

    await prisma.anuncio.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao deletar anúncio'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
