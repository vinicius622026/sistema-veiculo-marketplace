import { NextResponse } from 'next/server'
import { prisma } from '../../../src/lib/prisma'

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
