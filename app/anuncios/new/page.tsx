"use client"
import React, { useState } from 'react'
import Protected from '../../../src/components/Protected'
import supabase from '../../../src/services/supabaseClient'

export default function NewAnuncio() {
  const [titulo, setTitulo] = useState('')
  const [preco, setPreco] = useState(0)
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [message, setMessage] = useState('')
  const [revendas, setRevendas] = useState<any[]>([])
  const [selectedRevenda, setSelectedRevenda] = useState<string>('')
  // vehicle fields
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [ano, setAno] = useState<number | ''>('')
  const [valor, setValor] = useState<number | ''>('')
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    try {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (!token) return window.location.href = '/login'
      const userId = data.session?.user?.id

      // fetch user's revendas
      try {
        const r = await fetch('/api/revendas', { headers: { Authorization: `Bearer ${token}` } })
        if (r.ok) {
          const list = await r.json()
          const mine = list.filter((rv: any) => rv.owner_id === userId)
          setRevendas(mine)
          if (mine.length > 0 && !selectedRevenda) setSelectedRevenda(mine[0].id)
        }
      } catch (e) { /**/ }

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

      if (!selectedRevenda) throw new Error('Selecione uma revenda antes de criar o anúncio')
      if (!marca || !modelo || !ano || !valor) throw new Error('Preencha os dados do veículo')

      const payload: any = {
        estoque_id: '',
        revenda_id: selectedRevenda,
        titulo,
        preco,
        cidade,
        estado,
        foto: fotoUrl,
        veiculo: { marca, modelo, ano: Number(ano), valor: Number(valor) }
      }
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
            <label className="block text-sm">Revenda</label>
            {revendas.length === 0 ? (
              <div className="text-sm text-red-600">Nenhuma revenda encontrada. Crie uma revenda antes.</div>
            ) : (
              <select value={selectedRevenda} onChange={(e) => setSelectedRevenda(e.target.value)} className="w-full border px-3 py-2 rounded">
                {revendas.map((r) => <option key={r.id} value={r.id}>{r.nome}</option>)}
              </select>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm">Marca</label>
              <input className="w-full border px-3 py-2 rounded" value={marca} onChange={(e) => setMarca(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm">Modelo</label>
              <input className="w-full border px-3 py-2 rounded" value={modelo} onChange={(e) => setModelo(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm">Ano</label>
              <input type="number" className="w-full border px-3 py-2 rounded" value={ano as any} onChange={(e) => setAno(e.target.value ? Number(e.target.value) : '')} />
            </div>
            <div>
              <label className="block text-sm">Valor</label>
              <input type="number" className="w-full border px-3 py-2 rounded" value={valor as any} onChange={(e) => setValor(e.target.value ? Number(e.target.value) : '')} />
            </div>
          </div>
          <div>
            <label className="block text-sm">Foto</label>
            <input type="file" accept="image/*" onChange={(e) => {
              const f = e.target.files?.[0] ?? null
              setFile(f)
              if (f) {
                const url = URL.createObjectURL(f)
                setPreviewUrl(url)
              } else {
                if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null) }
              }
            }} />
            {previewUrl && (
              <div className="mt-2 flex items-center space-x-4">
                <div className="w-36 h-28 rounded overflow-hidden shadow">
                  <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-700 mb-2">Pré-visualização</div>
                  <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
                    <div className="h-3 bg-gradient-to-r from-green-400 to-green-600 text-xs text-white text-center" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{uploadProgress}%</div>
                </div>
              </div>
            )}
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
