import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { signupSchema } from '../../../../src/validations/auth'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const client = createClient(url, anon)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const dados = signupSchema.parse(body)
    const { data, error } = await client.auth.signUp({ email: dados.email, password: dados.password })
    if (error) return NextResponse.json({ erro: error.message || 'Erro ao criar conta' }, { status: 400 })

    // Optionally create profile via HTTP to our DB via serverless functions or rely on seed/user flow
    return NextResponse.json({ user: data.user, session: data.session }, { status: 201 })
  } catch (err) {
    console.error('POST /api/auth/signup error', err)
    return NextResponse.json({ erro: 'Erro ao criar conta' }, { status: 500 })
  }
}
