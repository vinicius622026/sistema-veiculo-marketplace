import { NextResponse } from 'next/server'
import { prisma } from '../../../src/lib/prisma'
import supabaseAdmin from '../../../src/lib/supabaseAdmin'

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

  const items = await prisma.favorito.findMany({
    where: { user_id: user.id },
    select: { anuncio_id: true },
  })

  return NextResponse.json({ items: items.map((i) => i.anuncio_id) })
}

export async function POST(req: Request) {
  const user = await getUserFromAuthHeader(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const anuncioId = body?.anuncio_id
  if (!anuncioId) return NextResponse.json({ error: 'anuncio_id is required' }, { status: 400 })

  const existing = await prisma.favorito.findFirst({ where: { user_id: user.id, anuncio_id: anuncioId } })
  if (!existing) {
    await prisma.favorito.create({ data: { user_id: user.id, anuncio_id: anuncioId } })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const user = await getUserFromAuthHeader(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const anuncioId = searchParams.get('anuncio_id')
  if (!anuncioId) return NextResponse.json({ error: 'anuncio_id is required' }, { status: 400 })

  await prisma.favorito.deleteMany({ where: { user_id: user.id, anuncio_id: anuncioId } })
  return NextResponse.json({ ok: true })
}
