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
    const anuncio = await prisma.anuncio.create({ data: {
      estoque_id: body.estoque_id,
      revenda_id: body.revenda_id,
      titulo: body.titulo,
      descricao: body.descricao || null,
      preco: body.preco,
      cidade: body.cidade,
      estado: body.estado,
      visitas: 0,
      ativo: body.ativo ?? true,
    }})
    return NextResponse.json(anuncio)
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao criar anúncio' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const user = await getUserFromAuthHeader(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  try {
    const anuncio = await prisma.anuncio.update({ where: { id: body.id }, data: body })
    return NextResponse.json(anuncio)
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao atualizar anúncio' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const user = await getUserFromAuthHeader(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  try {
    await prisma.anuncio.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao deletar anúncio' }, { status: 500 })
  }
}
