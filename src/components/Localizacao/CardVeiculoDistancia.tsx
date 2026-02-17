import React from 'react'
import Link from 'next/link'
import { AnuncioComDistancia } from '@/types/localizacao'
import { formatCurrency } from '@/utils/formatters'

interface Props { anuncio: AnuncioComDistancia }

export default function CardVeiculoDistancia({ anuncio }: Props) {
  return (
    <Link href={`/marketplace/${anuncio.id}`}>
      <a>
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer">
          <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-6xl relative">🏎️
            {anuncio.distancia_usuario !== undefined && (
              <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">📍 {anuncio.distancia_usuario} km</div>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-bold text-lg mb-2 truncate">{anuncio.titulo}</h3>
            <p className="text-sm text-gray-600 mb-3">📍 {anuncio.cidade}, {anuncio.estado}</p>

            <div className="flex justify-between items-center mb-3 text-sm text-gray-600">
              <span>⚡ {anuncio.km_carro.toLocaleString()} km</span>
              <span>🛢️ {anuncio.combustivel}</span>
            </div>

            <p className="text-2xl font-bold text-blue-600 mb-3">{formatCurrency(anuncio.preco)}</p>

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium transition">Ver detalhes</button>
          </div>
        </div>
      </a>
    </Link>
  )
}
