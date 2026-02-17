"use client"
"use client"
import React from 'react'
import { formatCurrency } from '../utils/formatters'
import { supabase } from '../services/supabaseClient'

interface Props {
  anuncio: any
}

function getPublicUrlFromStorage(path: string | undefined) {
  if (!path) return null
  // if path already looks like full URL, return it
  try {
    const u = new URL(path)
    if (u.protocol.startsWith('http')) return path
  } catch (e) { }
  // otherwise assume path is in public bucket and return built URL
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  if (!url) return null
  // path may be like 'bucket/dir/file.jpg' or 'dir/file.jpg'
  if (path.includes('/')) return `${url.replace(/\/$/, '')}/storage/v1/object/public/${path}`
  return `${url.replace(/\/$/, '')}/storage/v1/object/public/${path}`
}

export default function ListingCard({ anuncio }: Props) {
  const veiculo = anuncio.veiculo || {}
  let foto = anuncio.foto_url || anuncio.foto || null
  if (!foto && veiculo.fotos && Array.isArray(veiculo.fotos) && veiculo.fotos.length > 0) {
    foto = veiculo.fotos[0]
  }
  let publicUrl = foto ? getPublicUrlFromStorage(foto) : '/placeholder-car.png'
  return (
    <article className="bg-white rounded shadow-sm overflow-hidden">
      <div className="h-44 bg-gray-100">
        <img src={publicUrl || '/placeholder-car.png'} alt={anuncio.titulo} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-lg">{anuncio.titulo}</h3>
        <div className="text-sm text-gray-600">{anuncio.cidade} — {anuncio.estado}</div>
        <div className="mt-2 font-bold text-blue-600">{formatCurrency(anuncio.preco)}</div>
      </div>
    </article>
  )
}
