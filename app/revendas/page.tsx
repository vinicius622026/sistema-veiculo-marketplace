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
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Revendas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {revendas.length === 0 && <div>Nenhuma revenda encontrada.</div>}
        {revendas.map((r) => (
          <div key={r.id} className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-bold text-lg">{r.nome}</h3>
            <p className="text-sm text-gray-600">{r.cidade} — {r.estado}</p>
            <p className="text-sm text-gray-500">{r.telefone}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
