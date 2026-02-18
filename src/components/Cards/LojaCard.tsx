import React from 'react'
import Link from 'next/link'
import { Loja } from '@/types'

interface Props {
  loja: Loja
}

export default function LojaCard({ loja }: Props) {
  return (
    <Link href={`/loja/${loja.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group h-full">
        {/* CAPA */}
        <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700 transition flex items-center justify-center relative">
          {loja.capa_url ? (
            <img src={loja.capa_url} alt={loja.nome} className="w-full h-full object-cover" />
          ) : (
            <div className="text-4xl">🏪</div>
          )}

          {loja.verificada && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              ✓ Verificada
            </div>
          )}
        </div>

        {/* LOGO E INFO */}
        <div className="p-4">
          <div className="flex items-start gap-3 mb-3">
            {loja.logo_url ? (
              <img
                src={loja.logo_url}
                alt={loja.nome}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-lg">
                🚗
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-bold text-lg group-hover:text-blue-600 transition truncate">
                {loja.nome}
              </h3>
              <p className="text-xs text-gray-600">
                📍 {loja.cidade}, {loja.estado}
              </p>
            </div>
          </div>

          {loja.descricao && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {loja.descricao}
            </p>
          )}

          {/* CONTATO */}
          <div className="space-y-1 text-xs text-gray-600 mb-4">
            <p className="flex items-center gap-2">
              <span>📞</span> {loja.telefone}
            </p>
            {loja.whatsapp && (
              <p className="flex items-center gap-2">
                <span>💬</span> {loja.whatsapp}
              </p>
            )}
          </div>

          {/* BOTÃO */}
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-bold transition text-sm">
            Visitar loja →
          </button>
        </div>
      </div>
    </Link>
  )
}
