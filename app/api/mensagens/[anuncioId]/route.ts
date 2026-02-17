import { NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const parts = url.pathname.split('/')
    const anuncioId = parts[parts.length - 1]
    if (!anuncioId) return NextResponse.json({ erro: 'ID do anúncio não fornecido' }, { status: 400 })

    const mensagens = await (prisma as any).mensagem.findMany({
      where: { anuncio_id: anuncioId },
      orderBy: { created_at: 'asc' }
    })
    return NextResponse.json(mensagens)
  } catch (err) {
    console.error('GET /api/mensagens/[anuncioId] error', err)
    return NextResponse.json({ erro: 'Erro ao buscar mensagens' }, { status: 500 })
  }
}
