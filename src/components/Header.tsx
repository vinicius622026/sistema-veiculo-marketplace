"use client"
import React from 'react'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white text-sm">MV</span>
          <span className="text-xl font-semibold text-slate-900">
            MercadoVeiculos
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/anuncios" className="text-slate-600 hover:text-slate-900 transition">Anuncios</Link>
          <Link href="/revendas" className="text-slate-600 hover:text-slate-900 transition">Revendas</Link>
          <Link href="/login" className="rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 transition">Entrar</Link>
        </nav>
      </div>
    </header>
  )
}
