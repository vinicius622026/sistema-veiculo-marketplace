"use client"
import React, { useEffect, useState } from 'react'
import Header from '../src/components/Header'
import Hero from '../src/components/Hero'
import ListingCard from '../src/components/ListingCard'

export default function Home() {
  const [anuncios, setAnuncios] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/anuncios')
      .then((r) => r.json())
      .then((data) => setAnuncios(Array.isArray(data) ? data : []))
      .catch(() => setAnuncios([]))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4">Anúncios recentes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {anuncios.length === 0 && <div>Nenhum anúncio encontrado.</div>}
          {anuncios.map((a) => <ListingCard key={a.id} anuncio={a} />)}
        </div>
      </main>
    </div>
  )
}
