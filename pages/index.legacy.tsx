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
    <div className="min-h-screen bg-white">
      <Header />
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-5xl font-bold mb-2">Encontre seu próximo carro</h2>
            <p className="text-xl text-blue-100">Compre e venda com segurança</p>
          </div>

          <form onSubmit={handleBuscaCompleta} className="bg-white rounded-lg shadow-lg p-8 text-gray-800 mb-6">
            <h3 className="font-bold text-lg mb-4 text-gray-900">🔍 Busca Rápida</h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
                <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Toyota, Honda..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modelo</label>
                <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} placeholder="Corolla, Civic..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço Mín</label>
                <input type="number" value={precoMin} onChange={(e) => setPrecoMin(e.target.value)} placeholder="0" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço Máx</label>
                <input type="number" value={precoMax} onChange={(e) => setPrecoMax(e.target.value)} placeholder="999999" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
              </div>

              <div className="flex items-end">
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">Buscar</button>
              </div>
            </div>
          </form>

          <FiltroGeo onBuscar={handleBuscaGeo} loading={loading} />
        </div>
      </section>

      {resultados.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h3 className="text-4xl font-bold text-gray-900 mb-8">Resultados Encontrados ({resultados.length})</h3>
            <div className="mb-8"><MapaVeiculos anuncios={resultados} /></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">{resultados.map(a => (<CardVeiculoDistancia key={a.id} anuncio={a} />))}</div>
          </div>
        </section>
      )}

      {resultados.length === 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h3 className="text-4xl font-bold text-gray-900 mb-12">Destaques</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">{[1,2,3,4].map(i => (<Link key={i} href={`/marketplace/${i}`}><a className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"><div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-6xl">🏎️</div><div className="p-4"><h4 className="font-bold text-lg">Toyota Corolla 2023</h4><p className="text-sm text-gray-600 mb-3">📍 São Paulo, SP</p><p className="text-2xl font-bold text-blue-600 mb-3">R$ 95.000</p><button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium transition">Ver detalhes</button></div></a></Link>))}</div>
          </div>
        </section>
      )}

      <footer className="bg-gray-800 text-gray-300 py-12"><div className="container mx-auto px-4"><div className="border-t border-gray-700 pt-8 text-center"><p>© 2026 WebMotors. Todos os direitos reservados.</p></div></div></footer>
    </div>
  )
}
