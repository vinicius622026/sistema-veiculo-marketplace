"use client"
import React from 'react'
import { formatCurrency } from '../utils/formatters'

interface Props {
  anuncio: any
}

export default function ListingCard({ anuncio }: Props) {
  const foto = anuncio.foto || anuncio.fotos?.[0] || '/placeholder-car.png'
  return (
    <article className="bg-white rounded shadow-sm overflow-hidden">
      <div className="h-44 bg-gray-100">
        <img src={foto} alt={anuncio.titulo} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-lg">{anuncio.titulo}</h3>
        <div className="text-sm text-gray-600">{anuncio.cidade} — {anuncio.estado}</div>
        <div className="mt-2 font-bold text-blue-600">{formatCurrency(anuncio.preco)}</div>
      </div>
    </article>
  )
}
