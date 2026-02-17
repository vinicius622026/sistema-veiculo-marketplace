import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { loginSchema } from '../../../../src/validations/auth'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const client = createClient(url, anon)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const dados = loginSchema.parse(body)
    const { data, error } = await client.auth.signInWithPassword({ email: dados.email, password: dados.password })
    if (error) return NextResponse.json({ erro: error.message || 'Erro ao autenticar' }, { status: 401 })
    return NextResponse.json({ user: data.user, session: data.session })
  } catch (err) {
    console.error('POST /api/auth/login error', err)
    return NextResponse.json({ erro: 'Email ou senha inválidos' }, { status: 401 })
  }
}
