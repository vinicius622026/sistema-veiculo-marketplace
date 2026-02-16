"use client"
import React, { useState } from 'react'
import Protected from '../../../src/components/Protected'
import supabase from '../../../src/lib/supabaseClient'

export default function NewAnuncio() {
  const [titulo, setTitulo] = useState('')
  const [preco, setPreco] = useState(0)
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [message, setMessage] = useState('')
  const [file, setFile] = useState<File | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    try {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (!token) return window.location.href = '/login'

      let fotoUrl: string | null = null
      if (file) {
        // client-side validation for type and size
        if (!file.type.startsWith('image/')) throw new Error('Apenas imagens são permitidas')
        if (file.size > 5 * 1024 * 1024) throw new Error('Arquivo muito grande (máx 5MB)')

        // read file as base64 and send to server for secure upload
        const reader = new FileReader()
        const base64: string = await new Promise((res, rej) => {
          reader.onload = () => res(String(reader.result))
          reader.onerror = rej
          reader.readAsDataURL(file)
        })
        const uploadRes = await fetch('/api/uploads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, contentType: file.type, base64 })
        })
        const uploadData = await uploadRes.json()
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed')
        fotoUrl = uploadData.publicUrl
        // if thumbnail returned, you can store it in payload too
        if (uploadData.thumbnailUrl) payload.thumbnail = uploadData.thumbnailUrl
      }

      const payload: any = { estoque_id: '', revenda_id: '', titulo, preco, cidade, estado, foto: fotoUrl }
      const res = await fetch('/api/anuncios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      const resData = await res.json()
      if (!res.ok) setMessage(resData.error || 'Erro')
      else setMessage('Anúncio criado')
    } catch (err: any) {
      setMessage(err?.message || 'Erro inesperado')
    }
  }

  return (
    <Protected>
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
            <label className="block text-sm">Foto</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <div>
            <button className="bg-green-600 text-white px-4 py-2 rounded">Criar</button>
          </div>
          {message && <p className="text-sm text-gray-600">{message}</p>}
        </form>
      </div>
    </Protected>
  )
}
