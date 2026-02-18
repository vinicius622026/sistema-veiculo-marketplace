"use client"
import React, { useState, useEffect } from 'react'
import supabase from '../../../src/services/supabaseClient'

export default function AdminCleanup() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [userIsAdmin, setUserIsAdmin] = useState(false)
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    async function check() {
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user
      const meta = (user as any)?.user_metadata || {}
      if (mounted) setUserIsAdmin(meta.role === 'admin' || meta.tipo_usuario === 'admin')
      // fetch history
      try {
        const token = data.session?.access_token
        if (token) {
          const hRes = await fetch('/api/uploads/cleanup/history', { headers: { Authorization: `Bearer ${token}` } })
          if (hRes.ok) {
            const json = await hRes.json()
            if (mounted) setHistory(json.entries || [])
          }
        }
      } catch (e) { /**/ }
    }
    check()
    return () => { mounted = false }
  }, [])

  async function runCleanup() {
    setLoading(true)
    setResult(null)
    try {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (!token) return window.location.href = '/login'
      const res = await fetch('/api/uploads/cleanup/admin', { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
      const json = await res.json()
      setResult(json)
    } catch (e) {
      setResult({ error: (e as any).message || 'Erro' })
    } finally { setLoading(false) }
  }

  if (!userIsAdmin) return <div className="p-6 max-w-md mx-auto">Acesso negado. Somente administradores.</div>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Limpeza de imagens (Admin)</h2>
      <div className="mb-4">
        <button disabled={loading} onClick={runCleanup} className="bg-red-600 text-white px-4 py-2 rounded">Executar limpeza</button>
      </div>
      {loading && <p>Executando...</p>}
      {result && (
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
      )}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Histórico de limpezas</h3>
        {history.length === 0 && <p className="text-sm text-gray-600">Nenhum histórico encontrado.</p>}
        {history.map((h, idx) => (
          <div key={idx} className="mb-2 p-2 bg-white shadow-sm rounded">
            <div className="text-xs text-gray-500">{h.at || h.timestamp || '—'}</div>
            <pre className="text-sm overflow-auto">{JSON.stringify(h, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  )
}
