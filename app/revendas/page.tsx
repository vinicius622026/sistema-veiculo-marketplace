"use client"
import React, { useEffect, useState } from 'react'

interface Revenda { id: string; nome: string; cidade: string; estado: string; telefone: string }

export default function RevendasPage() {
  const [revendas, setRevendas] = useState<Revenda[]>([])

  useEffect(() => {
    fetch('/api/revendas')
      .then((r) => r.json())
      .then(setRevendas)
      .catch(() => setRevendas([]))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 rounded-3xl border border-slate-200/70 bg-white/80 p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Revendas</p>
        <h2 className="text-3xl font-semibold text-slate-900">Revendas parceiras</h2>
        <p className="mt-2 text-slate-500">Conheca as lojas cadastradas e seus contatos.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {revendas.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 text-center text-slate-500">
            Nenhuma revenda encontrada.
          </div>
        )}
        {revendas.map((r) => (
          <div key={r.id} className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm">
            <h3 className="font-semibold text-lg text-slate-900">{r.nome}</h3>
            <p className="text-sm text-slate-600">{r.cidade} — {r.estado}</p>
            <p className="text-sm text-slate-500">{r.telefone}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
