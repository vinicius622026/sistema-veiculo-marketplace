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
    <article className="group overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-44 bg-slate-100">
        <img
          src={publicUrl || '/placeholder-car.png'}
          alt={anuncio.titulo}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs text-slate-700">
          {veiculo.marca || 'Veiculo'} {veiculo.ano || ''}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">{anuncio.titulo}</h3>
        <div className="mt-1 text-sm text-slate-500">{anuncio.cidade} — {anuncio.estado}</div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-lg font-bold text-slate-900">{formatCurrency(anuncio.preco)}</div>
          <span className="text-xs text-slate-500">Ver detalhes →</span>
        </div>
      </div>
    </article>
  )
}
