import React, { useState, useEffect } from 'react'
import Header from '@/components/Layout/Header'
import FiltroGeo from '@/components/Localizacao/FiltroGeo'
import MapaVeiculos from '@/components/Localizacao/MapaVeiculos'
import CardVeiculoDistancia from '@/components/Localizacao/CardVeiculoDistancia'
import { useBuscaGeo } from '@/hooks/useBuscaGeo'
import { useGeolocalizacao } from '@/hooks/useGeolocalizacao'
import { BuscaGeo } from '@/types/localizacao'

export default function Marketplace() {
  const { resultados, loading, buscar } = useBuscaGeo()
  const { coordenadas } = useGeolocalizacao()
  const [viewType, setViewType] = useState<'lista' | 'mapa'>('lista')

  useEffect(() => { buscar({}) }, [])

  const handleBuscaGeo = (parametros: BuscaGeo) => { buscar(parametros) }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">🛍️ Marketplace</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside><FiltroGeo onBuscar={handleBuscaGeo} loading={loading} /></aside>
          <main className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="font-bold text-gray-700">{resultados.length} resultado{resultados.length !== 1 ? 's' : ''}</p>
              <div className="flex gap-2">
                <button onClick={() => setViewType('lista')} className={`px-4 py-2 rounded-lg font-medium transition ${viewType === 'lista' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>📋 Lista</button>
                <button onClick={() => setViewType('mapa')} className={`px-4 py-2 rounded-lg font-medium transition ${viewType === 'mapa' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>🗺️ Mapa</button>
              </div>
            </div>

            {viewType === 'mapa' && (<div className="mb-8"><MapaVeiculos anuncios={resultados} userLocation={coordenadas || undefined} /></div>)}

            {viewType === 'lista' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{loading ? (<div className="col-span-2 text-center py-12"><p className="text-gray-600">Carregando...</p></div>) : resultados.length === 0 ? (<div className="col-span-2 text-center py-12"><p className="text-gray-600">Nenhum veículo encontrado com os filtros selecionados</p></div>) : resultados.map(a => (<CardVeiculoDistancia key={a.id} anuncio={a} />))}</div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
