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

        // prefer presign -> proxy flow for large uploads and progress
        const presignRes = await fetch('/api/uploads/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, contentType: file.type })
        })
        const presignData = await presignRes.json()
        if (!presignRes.ok) throw new Error(presignData.error || 'Erro ao gerar presign')

        // use XHR to track upload progress
        const xhrUpload = () => new Promise<{ publicUrl: string }>((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.open('POST', presignData.uploadProxy)
          xhr.setRequestHeader('x-upload-path', presignData.path)
          xhr.setRequestHeader('x-upload-token', presignData.token)
          xhr.setRequestHeader('Content-Type', file.type)
          xhr.upload.onprogress = (ev) => {
            if (ev.lengthComputable) setUploadProgress(Math.round((ev.loaded / ev.total) * 100))
          }
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try { resolve(JSON.parse(xhr.responseText)) } catch (e) { resolve({ publicUrl: '' }) }
            } else reject(new Error('Upload failed: ' + xhr.status))
          }
          xhr.onerror = () => reject(new Error('Network error'))
          xhr.send(file)
        })

        const uploadResult = await xhrUpload()
        fotoUrl = uploadResult.publicUrl
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
