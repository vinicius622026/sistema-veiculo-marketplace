"use client"
import React from 'react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      <div className="absolute inset-0 opacity-40" aria-hidden>
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-amber-400 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-emerald-500 blur-3xl" />
      </div>
      <div className="relative max-w-6xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-300">Marketplace Automotivo</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold leading-tight">
            Encontre seu proximo carro com transparencia e seguranca
          </h1>
          <p className="text-lg text-slate-200 mt-4 mb-6">
            Compare anuncios, revendas verificadas e dados completos para decidir com calma.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-slate-200">
            <span className="rounded-full border border-white/20 px-3 py-1">Fotos reais</span>
            <span className="rounded-full border border-white/20 px-3 py-1">Sem taxa oculta</span>
            <span className="rounded-full border border-white/20 px-3 py-1">Revendas confiaveis</span>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="glass rounded-2xl p-5 shadow-xl">
            <p className="text-sm text-slate-600">Busque por marca, modelo ou cidade</p>
            <div className="mt-3 flex gap-2">
              <input
                placeholder="Ex: Volkswagen, Corolla, HB20"
                className="w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
              <button className="rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">Buscar</button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-500">
              <div className="rounded-lg bg-white/80 p-3 text-center">+2.5k anuncios</div>
              <div className="rounded-lg bg-white/80 p-3 text-center">350 revendas</div>
              <div className="rounded-lg bg-white/80 p-3 text-center">Entrega segura</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
