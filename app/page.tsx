"use client"
import React, { useEffect, useState } from 'react'
import Hero from '../src/components/Hero'
import ListingCard from '../src/components/ListingCard'

export default function Home() {
  const [anuncios, setAnuncios] = useState<any[]>([])
  const [marca, setMarca] = useState('')
  const [cidade, setCidade] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('recent')
  const [page, setPage] = useState(1)
  const [perPage] = useState(12)
  const [total, setTotal] = useState(0)

  useEffect(() => { fetchAnuncios() }, [marca, cidade, minPrice, maxPrice, sort, page])

  function buildQuery() {
    const params = new URLSearchParams()
    if (marca) params.set('marca', marca)
    if (cidade) params.set('cidade', cidade)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (sort) params.set('sort', sort)
    if (page) params.set('page', String(page))
    if (perPage) params.set('perPage', String(perPage))
    return params.toString()
  }

  async function fetchAnuncios() {
    try {
      const q = buildQuery()
      const res = await fetch(`/api/anuncios?${q}`)
      const json = await res.json()
      if (json.items) {
        setAnuncios(json.items)
        setTotal(json.total || 0)
      } else if (Array.isArray(json)) {
        setAnuncios(json)
        setTotal(json.length)
      } else {
        setAnuncios([])
        setTotal(0)
      }
    } catch (e) {
      setAnuncios([])
      setTotal(0)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / perPage))

  return (
    <div className="min-h-screen">
      <Hero />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Anúncios em destaque</p>
            <h2 className="text-3xl font-semibold text-slate-900">Explore os melhores anúncios</h2>
          </div>
          <div className="glass rounded-2xl p-3 shadow-sm">
            <div className="flex flex-wrap gap-2 items-center">
              <input
                placeholder="Marca"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm"
              />
              <input
                placeholder="Cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm"
              />
              <input
                placeholder="R$ min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-24 rounded-xl border border-slate-200 bg-white/90 px-2 py-2 text-sm"
              />
              <input
                placeholder="R$ max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-24 rounded-xl border border-slate-200 bg-white/90 px-2 py-2 text-sm"
              />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white/90 px-2 py-2 text-sm"
              >
                <option value="recent">Mais recentes</option>
                <option value="price_asc">Preco: menor</option>
                <option value="price_desc">Preco: maior</option>
                <option value="visitas">Mais vistos</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {anuncios.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-500">
              Nenhum anúncio encontrado.
            </div>
          )}
          {anuncios.map((a) => <ListingCard key={a.id} anuncio={a} />)}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">Pagina {page} de {totalPages} — {total} anuncios</div>
          <div className="flex items-center gap-2">
            <button className="rounded-full border border-slate-200 px-4 py-2 text-sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Anterior</button>
            <button className="rounded-full border border-slate-200 px-4 py-2 text-sm" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Proxima</button>
          </div>
        </div>
      </main>
    </div>
  )
}
