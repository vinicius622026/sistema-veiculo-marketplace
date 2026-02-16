"use client"
import React, { useState } from 'react'

export default function NewAnuncio() {
  const [titulo, setTitulo] = useState('')
  const [preco, setPreco] = useState(0)
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    const token = (window as any).supabase ? (await (window as any).supabase.auth.getSession()).data.session?.access_token : null
    const res = await fetch('/api/anuncios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ estoque_id: '', revenda_id: '', titulo, preco, cidade, estado })
    })
    const data = await res.json()
    if (!res.ok) setMessage(data.error || 'Erro')
    else setMessage('Anúncio criado')
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Criar Anúncio</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow-sm">
        <div>
          <label className="block text-sm">Título</label>
          <input className="w-full border px-3 py-2 rounded" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Preço</label>
          <input type="number" className="w-full border px-3 py-2 rounded" value={preco} onChange={(e) => setPreco(Number(e.target.value))} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm">Cidade</label>
            <input className="w-full border px-3 py-2 rounded" value={cidade} onChange={(e) => setCidade(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">Estado</label>
            <input className="w-full border px-3 py-2 rounded" value={estado} onChange={(e) => setEstado(e.target.value)} />
          </div>
        </div>
        <div>
          <button className="bg-green-600 text-white px-4 py-2 rounded">Criar</button>
        </div>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  )
}
