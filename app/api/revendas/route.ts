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
    const revendas = await prisma.revenda.findMany({ orderBy: { created_at: 'desc' } })
    return NextResponse.json(revendas)
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao buscar revendas' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const user = await getUserFromAuthHeader(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  try {
    const revenda = await prisma.revenda.create({ data: {
      owner_id: body.owner_id,
      nome: body.nome,
      cnpj: body.cnpj,
      endereco: body.endereco,
      cidade: body.cidade,
      estado: body.estado,
      telefone: body.telefone,
      email_contato: body.email_contato || null,
      website: body.website || null,
      logo_url: body.logo_url || null,
      ativo: body.ativo ?? true,
    }})
    return NextResponse.json(revenda)
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao criar revenda' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const user = await getUserFromAuthHeader(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  try {
    const revenda = await prisma.revenda.update({ where: { id: body.id }, data: body })
    return NextResponse.json(revenda)
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao atualizar revenda' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const user = await getUserFromAuthHeader(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  try {
    await prisma.revenda.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao deletar revenda' }, { status: 500 })
  }
}
