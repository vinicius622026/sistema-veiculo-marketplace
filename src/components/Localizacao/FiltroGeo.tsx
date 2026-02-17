import React, { useState } from 'react'
import { REGIOES, ESTADOS, PRINCIPAIS_CIDADES } from '@/data/regioes'
import { BuscaGeo } from '@/types/localizacao'
import { useGeolocalizacao } from '@/hooks/useGeolocalizacao'

interface Props {
  onBuscar: (parametros: BuscaGeo) => void
  loading?: boolean
}

export default function FiltroGeo({ onBuscar, loading }: Props) {
  const { coordenadas, loading: geoLoading } = useGeolocalizacao()
  const [filtro, setFiltro] = useState<BuscaGeo>({ raio: 50 })
  const [regiao, setRegiao] = useState<string>('')
  const [estado, setEstado] = useState<string>('')

  const handleBuscaProxima = () => {
    if (coordenadas) {
      onBuscar({ ...filtro, latitude: coordenadas.latitude, longitude: coordenadas.longitude })
    }
  }

  const handleBuscaCompleta = (e: React.FormEvent) => {
    e.preventDefault()
    onBuscar(filtro)
  }

  const cidades = PRINCIPAIS_CIDADES.filter(c => (estado ? c.estado === estado : true))

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h3 className="text-xl font-bold mb-4">🗺️ Buscar por Localização</h3>

      <div className="border-b pb-4">
        <button
          onClick={handleBuscaProxima}
          disabled={!coordenadas || geoLoading || loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-bold disabled:opacity-50 transition"
        >
          {geoLoading ? 'Localizando...' : '📍 Buscar Perto de Mim'}
        </button>
        {coordenadas && (
          <p className="text-xs text-gray-600 mt-2">Sua localização: {coordenadas.latitude.toFixed(4)}, {coordenadas.longitude.toFixed(4)}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Raio de Busca: {filtro.raio} km</label>
        <input type="range" min="5" max="500" step="5" value={filtro.raio || 50} onChange={(e) => setFiltro(prev => ({ ...prev, raio: Number(e.target.value) }))} className="w-full" />
        <div className="flex justify-between text-xs text-gray-600 mt-1"><span>5 km</span><span>500 km</span></div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Região</label>
        <select value={regiao} onChange={(e) => { setRegiao(e.target.value); setEstado(''); setFiltro(prev => ({ ...prev, regiao: e.target.value })) }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
          <option value="">Todas as regiões</option>
          {REGIOES.map(r => (<option key={r.id} value={r.nome}>{r.nome}</option>))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
        <select value={estado} onChange={(e) => { setEstado(e.target.value); setFiltro(prev => ({ ...prev, estado: e.target.value })) }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
          <option value="">Todos os estados</option>
          {(regiao ? REGIOES.find(r => r.nome === regiao)?.estados || [] : ESTADOS).map(e => (<option key={e.id} value={e.sigla}>{e.nome} ({e.sigla})</option>))}
        </select>
      </div>

      {estado && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
          <select value={filtro.cidade || ''} onChange={(e) => setFiltro(prev => ({ ...prev, cidade: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            <option value="">Qualquer cidade</option>
            {cidades.map(c => (<option key={c.id} value={c.nome}>{c.nome}</option>))}
          </select>
        </div>
      )}

      <button onClick={handleBuscaCompleta} disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-bold disabled:opacity-50 transition">{loading ? 'Buscando...' : '🔍 Buscar'}</button>
    </div>
  )
}
