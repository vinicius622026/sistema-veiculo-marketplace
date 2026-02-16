import { NextResponse } from 'next/server'
import { prisma } from '../../../src/lib/prisma'

export async function GET() {
  try {
    const revendas = await prisma.revenda.findMany({ orderBy: { created_at: 'desc' } })
    return NextResponse.json(revendas)
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao buscar revendas' }, { status: 500 })
  }
}
