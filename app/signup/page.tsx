"use client"
import React, { useState } from 'react'
import { supabase } from '../../src/services/supabaseClient'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage(error.message)
    else setMessage('Verifique seu email para confirmar o cadastro')
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-lg">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Cadastro</p>
        <h2 className="text-3xl font-semibold text-slate-900">Criar conta</h2>
        <p className="mt-2 text-sm text-slate-500">Receba acesso ao painel e anuncie seus veiculos.</p>
        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          <div>
            <FormInput label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <FormInput label="Senha" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <button type="submit" className="w-full rounded-xl bg-slate-900 px-4 py-2 text-white">Cadastrar</button>
          </div>
          {message && <p className="text-sm text-slate-600">{message}</p>}
        </form>
      </div>
    </div>
  )
}
