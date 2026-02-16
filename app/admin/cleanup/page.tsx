"use client"
import React, { useState, useEffect } from 'react'
import supabase from '../../../src/lib/supabaseClient'

export default function AdminCleanup() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [userIsAdmin, setUserIsAdmin] = useState(false)

  useEffect(() => {
    let mounted = true
    async function check() {
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user
      const meta = (user as any)?.user_metadata || {}
      if (mounted) setUserIsAdmin(meta.role === 'admin' || meta.tipo_usuario === 'admin')
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
    </div>
  )
}
