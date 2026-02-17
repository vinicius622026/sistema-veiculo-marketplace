"use client"
import React, { useEffect, useState } from 'react'

interface Veiculo { id: string; marca: string; modelo: string; ano: number; valor: number }
interface Anuncio { id: string; titulo: string; preco: number; cidade: string; estado: string; veiculo: Veiculo }

export default function AnunciosPage() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/anuncios')
      .then((r) => r.json())
      .then(setAnuncios)
      .catch(() => setAnuncios([]))
    // try to get supabase session token for protected actions
    ;(async () => {
      const s = (window as any).supabase
      if (s && s.auth) {
        const session = await s.auth.getSession()
        setToken(session?.data?.session?.access_token ?? null)
      }
    })()
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Anúncios</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {anuncios.length === 0 && <div>Nenhum anúncio encontrado.</div>}
        {anuncios.map((a) => (
          <article key={a.id} className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-bold text-lg">{a.titulo}</h3>
            <p className="text-sm text-gray-600">{a.veiculo.marca} {a.veiculo.modelo} • {a.veiculo.ano}</p>
            <p className="mt-2 font-semibold">R$ {a.preco.toFixed(2)}</p>
            <p className="text-sm text-gray-500">{a.cidade} — {a.estado}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
