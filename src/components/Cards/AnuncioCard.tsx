import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Anuncio } from '@/types'
import { formatCurrency } from '@/utils/helpers'
import BotaoFavorito from './BotaoFavorito'

interface Props {
  anuncio: Anuncio
  mostrarFavorito?: boolean
}

export default function AnuncioCard({ anuncio, mostrarFavorito = true }: Props) {
  const veiculo = anuncio.veiculo
  const loja = anuncio.loja

  return (
    <Link href={`/anuncio/${anuncio.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer h-full flex flex-col">
        {/* IMAGEM */}
        <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
            {anuncio.imagens_urls && anuncio.imagens_urls[0] ? (
            <Image
              src={anuncio.imagens_urls[0]}
              alt={anuncio.titulo || ''}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-6xl">🏎️</div>
          )}

          {/* BADGES */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {anuncio.destaque && (
              <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                ⭐ DESTAQUE
              </div>
            )}
            {mostrarFavorito && (
              <div onClick={(e) => e.preventDefault()}>
                <BotaoFavorito anuncioId={anuncio.id} />
              </div>
            )}
          </div>

          {/* VISITAS */}
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <span>👁️</span>
            <span>{anuncio.visitas || 0}</span>
          </div>
        </div>

        {/* CONTEÚDO */}
        <div className="p-4 flex flex-col flex-1">
          {/* TÍTULO E LOCALIZAÇÃO */}
          <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition line-clamp-2 text-gray-900">
            {veiculo?.marca} {veiculo?.modelo} {veiculo?.ano}
          </h3>

          <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
            📍 {anuncio.cidade}, {anuncio.estado}
          </p>

          {/* ESPECIFICAÇÕES */}
          <div className="flex justify-between items-center mb-4 text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <span>⚡ {veiculo?.km?.toLocaleString('pt-BR') || 'N/A'} km</span>
            <span>🛢️ {veiculo?.combustivel || 'N/A'}</span>
          </div>

          {/* PREÇO */}
          <p className="text-2xl font-bold text-blue-600 mb-3">
            {formatCurrency(anuncio.preco_venda)}
          </p>

          {/* LOJA */}
          {loja && (
            <div className="border-t pt-3 mt-auto">
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <span>🏪</span>
                <span className="font-semibold text-gray-800 truncate">{loja.nome}</span>
              </p>
              <p className="text-xs text-gray-500">
                {loja.cidade} - {loja.estado}
              </p>
            </div>
          )}
        </div>

        {/* BOTÃO */}
        <div className="px-4 pb-4">
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-bold transition text-sm">
            Ver detalhes →
          </button>
        </div>
      </div>
    </Link>
  )
}
