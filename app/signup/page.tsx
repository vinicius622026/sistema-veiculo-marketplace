"use client"
import React, { useState } from 'react'
import supabase from '../../src/services/supabaseClient'

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
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Cadastrar</h2>
      <form onSubmit={handleSignup} className="space-y-4 bg-white p-4 rounded shadow-sm">
        <div>
          <label className="block text-sm">Email</label>
          <input className="w-full border px-3 py-2 rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Senha</label>
          <input type="password" className="w-full border px-3 py-2 rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Cadastrar</button>
        </div>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  )
}
