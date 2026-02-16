"use client"
import React, { useState } from 'react'
import supabase from '@/src/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setMessage(error.message)
    else setMessage('Login realizado. Recarregue a página.')
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Entrar</h2>
      <form onSubmit={handleLogin} className="space-y-4 bg-white p-4 rounded shadow-sm">
        <div>
          <label className="block text-sm">Email</label>
          <input className="w-full border px-3 py-2 rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Senha</label>
          <input type="password" className="w-full border px-3 py-2 rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
        </div>
        {message && <p className="text-sm text-red-600">{message}</p>}
      </form>
    </div>
  )
}
