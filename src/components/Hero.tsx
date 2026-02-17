"use client"
import React from 'react'

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
      <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">Encontre seu próximo carro</h1>
          <p className="text-lg opacity-90 mb-6">Busque entre milhares de anúncios de revendas confiáveis. Preços, fotos e informações completas.</p>
        </div>
        <div className="w-full md:w-1/2">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-600">Busque por marca, modelo, versão ou cidade</p>
            <div className="mt-3">
              <input placeholder="Ex: Volkswagen, Corolla, HB20" className="w-full border px-3 py-2 rounded" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
