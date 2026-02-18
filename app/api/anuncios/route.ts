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

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const q = url.searchParams
    const marca = q.get('marca') || undefined
    const cidade = q.get('cidade') || undefined
    const minPrice = q.get('minPrice') ? Number(q.get('minPrice')) : undefined
    const maxPrice = q.get('maxPrice') ? Number(q.get('maxPrice')) : undefined
    const minAno = q.get('minAno') ? Number(q.get('minAno')) : undefined
    const maxAno = q.get('maxAno') ? Number(q.get('maxAno')) : undefined
    const minKm = q.get('minKm') ? Number(q.get('minKm')) : undefined
    const maxKm = q.get('maxKm') ? Number(q.get('maxKm')) : undefined
    const sort = q.get('sort') || 'recent'
    const page = q.get('page') ? Math.max(1, Number(q.get('page'))) : 1
    const perPage = q.get('perPage') ? Math.max(1, Number(q.get('perPage'))) : 12

    const where: any = { }
    // only active anuncios by default
    where.ativo = true

    if (cidade) where.cidade = { contains: cidade, mode: 'insensitive' }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.preco = {}
      if (minPrice !== undefined) where.preco.gte = minPrice
      if (maxPrice !== undefined) where.preco.lte = maxPrice
    }

    // filter by veiculo.marca using relation filter
    const veiculoFilter: any = {}
    if (marca) veiculoFilter.marca = { contains: marca, mode: 'insensitive' }
    if (minAno !== undefined || maxAno !== undefined) {
      veiculoFilter.ano = {}
      if (minAno !== undefined) veiculoFilter.ano.gte = minAno
      if (maxAno !== undefined) veiculoFilter.ano.lte = maxAno
    }
    if (minKm !== undefined || maxKm !== undefined) {
      veiculoFilter.km = {}
      if (minKm !== undefined) veiculoFilter.km.gte = minKm
      if (maxKm !== undefined) veiculoFilter.km.lte = maxKm
    }

    // build order
    let orderBy: any = { created_at: 'desc' }
    if (sort === 'price_asc') orderBy = { preco: 'asc' }
    else if (sort === 'price_desc') orderBy = { preco: 'desc' }
    else if (sort === 'visitas') orderBy = { visitas: 'desc' }
    else if (sort === 'year_desc') orderBy = { veiculo: { ano: 'desc' } }
    else if (sort === 'year_asc') orderBy = { veiculo: { ano: 'asc' } }
    else if (sort === 'km_asc') orderBy = { veiculo: { km: 'asc' } }
    else if (sort === 'km_desc') orderBy = { veiculo: { km: 'desc' } }

    const andFilters: any[] = [where]
    if (Object.keys(veiculoFilter).length > 0) andFilters.push({ veiculo: veiculoFilter })
    const finalWhere = { AND: andFilters }

    const total = await prisma.anuncio.count({ where: finalWhere })

    const items = await prisma.anuncio.findMany({
      where: finalWhere,
      include: { veiculo: true },
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    })

    return NextResponse.json({ items, total, page, perPage })
  } catch (err) {
    console.error('GET /api/anuncios error:', err)
    return NextResponse.json({ error: 'Erro ao buscar anúncios' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const user = await getUserFromAuthHeader(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  console.log('POST /api/anuncios by user:', user?.id)
  console.log('POST /api/anuncios body:', { titulo: body.titulo, revenda_id: body.revenda_id })
  try {
    // basic validation
    if (!body.revenda_id) return NextResponse.json({ error: 'revenda_id is required' }, { status: 400 })
    if (!body.titulo) return NextResponse.json({ error: 'titulo is required' }, { status: 400 })
    if (typeof body.preco !== 'number' || body.preco <= 0) return NextResponse.json({ error: 'preco must be a positive number' }, { status: 400 })

    // authorization: only owner of revenda can create anuncios
    const revenda = await prisma.revenda.findUnique({ where: { id: body.revenda_id } })
    if (!revenda) return NextResponse.json({ error: 'Revenda not found' }, { status: 404 })
    if (revenda.owner_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // ensure we have a valid estoque_id (Veiculo). If not provided, create a Veiculo using provided vehicle data (avoid placeholders)
    let estoqueId = body.estoque_id
    if (!estoqueId) {
      if (body.veiculo && typeof body.veiculo === 'object') {
        const v = body.veiculo
        const veic = await prisma.veiculo.create({ data: {
          revenda_id: body.revenda_id,
          placa: v.placa || '',
          chassi: v.chassi || '',
          marca: v.marca || '',
          modelo: v.modelo || '',
          ano: Number(v.ano) || 0,
          valor: Number(v.valor) || 0,
          km: Number(v.km) || 0,
          combustivel: v.combustivel || null,
          cor: v.cor || null,
          status: v.status || 'novo',
          descricao: v.descricao || null,
          fotos: v.fotos || null,
        }});
        estoqueId = veic.id
      } else {
        const veic = await prisma.veiculo.create({ data: {
          revenda_id: body.revenda_id,
          placa: '',
          chassi: '',
          marca: '',
          modelo: '',
          ano: 0,
          valor: 0,
          km: 0,
          combustivel: null,
          cor: null,
          status: 'novo',
          descricao: null,
          fotos: null,
        }});
        estoqueId = veic.id
      }
    }

    const anuncio = await prisma.anuncio.create({ data: {
      estoque_id: estoqueId,
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
    console.error('POST /api/anuncios error:', err)
    const message = err instanceof Error ? err.message : 'Erro ao criar anúncio'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const user = await getUserFromAuthHeader(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  console.log('PUT /api/anuncios by user:', user?.id)
  console.log('PUT /api/anuncios id:', body.id)
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
    console.error('PUT /api/anuncios error:', err)
    const message = err instanceof Error ? err.message : 'Erro ao atualizar anúncio'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const user = await getUserFromAuthHeader(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  console.log('DELETE /api/anuncios by user:', user?.id, 'id:', id)
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
    console.error('DELETE /api/anuncios error:', err)
    const message = err instanceof Error ? err.message : 'Erro ao deletar anúncio'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
