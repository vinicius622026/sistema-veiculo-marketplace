"use client"
import React from 'react'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">MercadoVeículos</Link>
        <nav className="space-x-4">
          <Link href="/anuncios" className="text-sm text-gray-700">Anúncios</Link>
          <Link href="/revendas" className="text-sm text-gray-700">Revendas</Link>
          <Link href="/login" className="text-sm text-blue-600 font-medium">Entrar</Link>
        </nav>
      </div>
    </header>
  )
}
