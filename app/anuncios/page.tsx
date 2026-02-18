"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../src/services/supabaseClient'

interface Veiculo { id: string; marca: string; modelo: string; ano: number; valor: number }
interface Anuncio { id: string; titulo: string; preco: number; cidade: string; estado: string; veiculo: Veiculo }

export default function AnunciosPage() {
  const router = useRouter()
  const safePathname = '/anuncios'

  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [token, setToken] = useState<string | null>(null)
  const [marca, setMarca] = useState('')
  const [cidade, setCidade] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minAno, setMinAno] = useState('')
  const [maxAno, setMaxAno] = useState('')
  const [minKm, setMinKm] = useState('')
  const [maxKm, setMaxKm] = useState('')
  const [sort, setSort] = useState('recent')
  const [page, setPage] = useState(1)
  const [perPage] = useState(12)
  const [total, setTotal] = useState(0)
  const [favoritos, setFavoritos] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // populate initial state from URL on client
    try {
      if (typeof window !== 'undefined') {
        const sp = new URLSearchParams(window.location.search)
        const m = sp.get('marca') || ''
        const c = sp.get('cidade') || ''
        const minP = sp.get('minPrice') || ''
        const maxP = sp.get('maxPrice') || ''
        const minA = sp.get('minAno') || ''
        const maxA = sp.get('maxAno') || ''
        const minK = sp.get('minKm') || ''
        const maxK = sp.get('maxKm') || ''
        const s = sp.get('sort') || 'recent'
        const p = Number(sp.get('page') || '1')

        setMarca(m)
        setCidade(c)
        setMinPrice(minP)
        setMaxPrice(maxP)
        setMinAno(minA)
        setMaxAno(maxA)
        setMinKm(minK)
        setMaxKm(maxK)
        setSort(s)
        setPage(p)
      }
    } catch (e) {
      // ignore
    }

    const params = new URLSearchParams()
    if (marca) params.set('marca', marca)
    if (cidade) params.set('cidade', cidade)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (minAno) params.set('minAno', minAno)
    if (maxAno) params.set('maxAno', maxAno)
    if (minKm) params.set('minKm', minKm)
    if (maxKm) params.set('maxKm', maxKm)
    if (sort && sort !== 'recent') params.set('sort', sort)
    if (page > 1) params.set('page', String(page))
    params.set('perPage', String(perPage))

    const query = params.toString()
    router.replace(query ? `${safePathname}?${query}` : safePathname, { scroll: false })
  }, [marca, cidade, minPrice, maxPrice, minAno, maxAno, minKm, maxKm, sort, page, perPage, safePathname, router])

  useEffect(() => {
    const params = new URLSearchParams()
    if (marca) params.set('marca', marca)
    if (cidade) params.set('cidade', cidade)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (minAno) params.set('minAno', minAno)
    if (maxAno) params.set('maxAno', maxAno)
    if (minKm) params.set('minKm', minKm)
    if (maxKm) params.set('maxKm', maxKm)
    params.set('sort', sort)
    params.set('page', String(page))
    params.set('perPage', String(perPage))

    setLoading(true)
    fetch(`/api/anuncios?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setAnuncios(Array.isArray(data) ? data : (data.items || []))
        if (typeof data?.total === 'number') setTotal(data.total)
      })
      .catch(() => setAnuncios([]))
      .finally(() => setLoading(false))
  }, [marca, cidade, minPrice, maxPrice, minAno, maxAno, minKm, maxKm, sort, page, perPage])

  useEffect(() => {
    ;(async () => {
      const session = await supabase.auth.getSession()
      const accessToken = session?.data?.session?.access_token ?? null
      setToken(accessToken)

      if (accessToken) {
        const favRes = await fetch('/api/favoritos', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        if (favRes.ok) {
          const data = await favRes.json()
          setFavoritos(data.items || [])
        }
      }
    })()
  }, [])

  async function toggleFavorito(anuncioId: string) {
    if (!token) {
      window.location.href = '/login'
      return
    }

    const isFav = favoritos.includes(anuncioId)
    if (isFav) {
      const res = await fetch(`/api/favoritos?anuncio_id=${encodeURIComponent(anuncioId)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) setFavoritos((prev) => prev.filter((id) => id !== anuncioId))
    } else {
      const res = await fetch('/api/favoritos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ anuncio_id: anuncioId }),
      })
      if (res.ok) setFavoritos((prev) => [...prev, anuncioId])
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / perPage))

  function limparFiltros() {
    setMarca('')
    setCidade('')
    setMinPrice('')
    setMaxPrice('')
    setMinAno('')
    setMaxAno('')
    setMinKm('')
    setMaxKm('')
    setSort('recent')
    setPage(1)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 rounded-3xl border border-slate-200/70 bg-white/80 p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Anuncios</p>
        <h2 className="text-3xl font-semibold text-slate-900">Todos os anuncios em um so lugar</h2>
        <p className="mt-2 text-slate-500">Use os filtros para refinar sua busca e salve seus favoritos.</p>
      </div>

      <div className="glass grid grid-cols-1 md:grid-cols-10 gap-3 mb-5 p-4 rounded-2xl shadow-sm">
        <input
          className="rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm"
          placeholder="Filtrar por marca"
          value={marca}
          onChange={(e) => { setPage(1); setMarca(e.target.value) }}
        />
        <input
          className="rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm"
          placeholder="Filtrar por cidade"
          value={cidade}
          onChange={(e) => { setPage(1); setCidade(e.target.value) }}
        />
        <input
          className="rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm"
          type="number"
          placeholder="Preco min"
          value={minPrice}
          onChange={(e) => { setPage(1); setMinPrice(e.target.value) }}
        />
        <input
          className="rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm"
          type="number"
          placeholder="Preco max"
          value={maxPrice}
          onChange={(e) => { setPage(1); setMaxPrice(e.target.value) }}
        />
        <input
          className="rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm"
          type="number"
          placeholder="Ano min"
          value={minAno}
          onChange={(e) => { setPage(1); setMinAno(e.target.value) }}
        />
        <input
          className="rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm"
          type="number"
          placeholder="Ano max"
          value={maxAno}
          onChange={(e) => { setPage(1); setMaxAno(e.target.value) }}
        />
        <input
          className="rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm"
          type="number"
          placeholder="KM min"
          value={minKm}
          onChange={(e) => { setPage(1); setMinKm(e.target.value) }}
        />
        <input
          className="rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm"
          type="number"
          placeholder="KM max"
          value={maxKm}
          onChange={(e) => { setPage(1); setMaxKm(e.target.value) }}
        />
        <select className="rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm" value={sort} onChange={(e) => { setPage(1); setSort(e.target.value) }}>
          <option value="recent">Mais recentes</option>
          <option value="price_asc">Menor preco</option>
          <option value="price_desc">Maior preco</option>
          <option value="year_desc">Ano: mais novo</option>
          <option value="year_asc">Ano: mais antigo</option>
          <option value="km_asc">KM: menor</option>
          <option value="km_desc">KM: maior</option>
          <option value="visitas">Mais vistos</option>
        </select>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-slate-200 px-3 py-2 text-sm"
            onClick={limparFiltros}
          >
            Limpar
          </button>
          <div className="text-sm text-slate-500">Total: {total}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading && <div className="text-sm text-slate-600">Carregando anuncios...</div>}
        {!loading && anuncios.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 text-center text-slate-500">
            Nenhum anuncio encontrado.
          </div>
        )}
        {anuncios.map((a) => (
          <article key={a.id} className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-lg text-slate-900">{a.titulo}</h3>
              <button
                type="button"
                className="text-xl leading-none"
                aria-label="favoritar"
                onClick={() => toggleFavorito(a.id)}
              >
                {favoritos.includes(a.id) ? '❤️' : '🤍'}
              </button>
            </div>
            <p className="text-sm text-slate-600">{a.veiculo.marca} {a.veiculo.modelo} • {a.veiculo.ano}</p>
            <p className="mt-2 font-semibold text-slate-900">R$ {a.preco.toFixed(2)}</p>
            <p className="text-sm text-slate-500">{a.cidade} — {a.estado}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          className="rounded-full border border-slate-200 px-4 py-2 text-sm disabled:opacity-40"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
        >
          Anterior
        </button>
        <span className="text-sm text-slate-600">Pagina {page} de {totalPages}</span>
        <button
          className="rounded-full border border-slate-200 px-4 py-2 text-sm disabled:opacity-40"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
        >
          Proxima
        </button>
      </div>
    </div>
  )
}
