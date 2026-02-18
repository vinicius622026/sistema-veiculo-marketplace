"use client"
import React, { useEffect, useState } from 'react'
import { supabase } from '../../src/services/supabaseClient'

type Anuncio = {
  id: string
  titulo: string
  preco: number
  cidade: string
  estado: string
}

export default function FavoritosPage() {
  const [items, setItems] = useState<Anuncio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await supabase.auth.getSession()
        const token = data.session?.access_token
        if (!token) {
          window.location.href = '/login'
          return
        }

        const favRes = await fetch('/api/favoritos', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!favRes.ok) {
          setItems([])
          return
        }
        const fav = await favRes.json()
        const ids: string[] = fav.items || []
        if (ids.length === 0) {
          setItems([])
          return
        }

        const anunciosRes = await fetch('/api/anuncios?perPage=100&page=1')
        const anunciosBody = await anunciosRes.json()
        const all = anunciosBody.items || []
        setItems(all.filter((a: Anuncio) => ids.includes(a.id)))
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 rounded-3xl border border-slate-200/70 bg-white/80 p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Favoritos</p>
        <h1 className="text-3xl font-semibold text-slate-900">Meus favoritos</h1>
        <p className="mt-2 text-slate-500">Salve anuncios para comparar depois.</p>
      </div>
      {loading && <p className="text-sm text-slate-600">Carregando...</p>}
      {!loading && items.length === 0 && (
        <p className="text-sm text-slate-600">Voce ainda nao favoritou anuncios.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((a) => (
          <article key={a.id} className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm">
            <h3 className="font-semibold text-lg text-slate-900">{a.titulo}</h3>
            <p className="mt-2 font-semibold text-slate-900">R$ {a.preco.toFixed(2)}</p>
            <p className="text-sm text-slate-500">{a.cidade} — {a.estado}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
