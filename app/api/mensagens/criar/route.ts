import { NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { anuncio_id, sender_nome, sender_telefone, conteudo } = body
    if (!anuncio_id || !sender_nome || !sender_telefone || !conteudo) {
      return NextResponse.json({ erro: 'Dados incompletos' }, { status: 400 })
    }

    const msg = await (prisma as any).mensagem.create({ data: {
      anuncio_id: anuncio_id as string,
      sender_nome,
      sender_telefone,
      conteudo,
    }})

    return NextResponse.json(msg, { status: 201 })
  } catch (err) {
    console.error('POST /api/mensagens/criar error', err)
    return NextResponse.json({ erro: 'Erro ao enviar mensagem' }, { status: 500 })
  }
}
