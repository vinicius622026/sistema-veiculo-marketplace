import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useBuscaGeo } from '@/hooks/useBuscaGeo'
import Header from '@/components/Layout/Header'
import FiltroGeo from '@/components/Localizacao/FiltroGeo'
import MapaVeiculos from '@/components/Localizacao/MapaVeiculos'
import CardVeiculoDistancia from '@/components/Localizacao/CardVeiculoDistancia'
import { BuscaGeo } from '@/types/localizacao'

export default function Home() {
  const { isAuthenticated } = useAuth()
  const { resultados, loading, buscar } = useBuscaGeo()
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [precoMin, setPrecoMin] = useState('')
  const [precoMax, setPrecoMax] = useState('')

  const handleBuscaCompleta = (e: React.FormEvent) => {
    e.preventDefault()
    const parametros: BuscaGeo = {}
    if (marca) parametros.marca = marca
    if (modelo) parametros.modelo = modelo
    if (precoMin) parametros.precoMin = Number(precoMin)
    if (precoMax) parametros.precoMax = Number(precoMax)

    buscar(parametros)
  }

  const handleBuscaGeo = (parametros: BuscaGeo) => { buscar(parametros) }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <section className="relative overflow-hidden bg-slate-900 text-white py-16">
        <div className="absolute inset-0 opacity-40" aria-hidden>
          <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-amber-400 blur-3xl" />
          <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-emerald-500 blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Busca inteligente</p>
            <h2 className="text-5xl font-bold mb-2">Encontre seu proximo carro</h2>
            <p className="text-lg text-slate-200">Compre e venda com seguranca</p>
          </div>

          <form onSubmit={handleBuscaCompleta} className="glass rounded-3xl p-6 text-slate-800 mb-6">
            <h3 className="font-bold text-lg mb-4 text-slate-900">🔍 Busca Rapida</h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Marca</label>
                <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Toyota, Honda..." className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/10" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Modelo</label>
                <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} placeholder="Corolla, Civic..." className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/10" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Preco Min</label>
                <input type="number" value={precoMin} onChange={(e) => setPrecoMin(e.target.value)} placeholder="0" className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/10" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Preco Max</label>
                <input type="number" value={precoMax} onChange={(e) => setPrecoMax(e.target.value)} placeholder="999999" className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/10" />
              </div>

              <div className="flex items-end">
                <button type="submit" className="w-full rounded-xl bg-slate-900 text-white py-3 font-bold hover:bg-slate-800 transition">Buscar</button>
              </div>
            </div>
          </form>

          <FiltroGeo onBuscar={handleBuscaGeo} loading={loading} />
        </div>
      </section>

      {resultados.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4">
            <h3 className="text-4xl font-bold text-slate-900 mb-8">Resultados ({resultados.length})</h3>
            <div className="mb-8"><MapaVeiculos anuncios={resultados} /></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">{resultados.map(a => (<CardVeiculoDistancia key={a.id} anuncio={a} />))}</div>
          </div>
        </section>
      )}

      {resultados.length === 0 && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4">
            <h3 className="text-4xl font-bold text-slate-900 mb-12">Destaques</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1,2,3,4].map(i => (
                <Link key={i} href={`/marketplace/${i}`}>
                  <a className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm hover:shadow-lg transition overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center text-6xl">🏎️</div>
                    <div className="p-4">
                      <h4 className="font-bold text-lg text-slate-900">Toyota Corolla 2023</h4>
                      <p className="text-sm text-slate-600 mb-3">📍 Sao Paulo, SP</p>
                      <p className="text-2xl font-bold text-slate-900 mb-3">R$ 95.000</p>
                      <button className="w-full rounded-xl bg-slate-900 text-white py-2 font-medium transition">Ver detalhes</button>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="border-t border-slate-700 pt-8 text-center">
            <p>© 2026 WebMotors. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
