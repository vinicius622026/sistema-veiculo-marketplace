"use client"
import React, { useEffect, useState } from 'react'
import Header from '../src/components/Header'
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <h2 className="text-2xl font-semibold">Anúncios</h2>
          <div className="flex gap-2 items-center">
            <input placeholder="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} className="border px-3 py-2 rounded" />
            <input placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} className="border px-3 py-2 rounded" />
            <input placeholder="R$ mín" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-24 border px-2 py-2 rounded" />
            <input placeholder="R$ máx" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-24 border px-2 py-2 rounded" />
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="border px-2 py-2 rounded">
              <option value="recent">Mais recentes</option>
              <option value="price_asc">Preço: menor</option>
              <option value="price_desc">Preço: maior</option>
              <option value="visitas">Mais vistos</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {anuncios.length === 0 && <div>Nenhum anúncio encontrado.</div>}
          {anuncios.map((a) => <ListingCard key={a.id} anuncio={a} />)}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">Página {page} de {totalPages} — {total} anúncios</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Anterior</button>
            <button className="px-3 py-1 border rounded" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Próxima</button>
          </div>
        </div>
      </main>
    </div>
  )
}
