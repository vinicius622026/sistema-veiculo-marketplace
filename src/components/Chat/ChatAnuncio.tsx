"use client"
import React, { useEffect, useState } from 'react'
import { supabase } from '@/src/services/supabaseClient'
import { getWhatsAppLink } from '@/src/utils/helpers'

interface Props {
  anuncioId: string
  telefoneTitular?: string
}

export default function ChatAnuncio({ anuncioId, telefoneTitular }: Props) {
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let channel: any

    async function load() {
      try {
        const { data } = await supabase
          .from('mensagens')
          .select('*')
          .eq('anuncio_id', anuncioId)
          .order('created_at', { ascending: true })

        if (data) setMessages(data)
      } catch (e) {
        // ignore
      } finally {
        setLoading(false)
      }
    }

    load()

    try {
      channel = supabase.channel(`public:mensagens:anuncio_${anuncioId}`)
      channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensagens', filter: `anuncio_id=eq.${anuncioId}` }, (payload: any) => {
        setMessages((prev) => [...prev, payload.new])
      })
      channel.subscribe()
    } catch (e) {
      // fallback: supabase.from(...).on('INSERT', ...)
      try {
        supabase
          .from(`mensagens:anuncio_id=eq.${anuncioId}`)
          .on('INSERT', (payload) => setMessages((p) => [...p, payload.new]))
          .subscribe()
      } catch (err) {
        // no-op
      }
    }

    return () => {
      try { channel?.unsubscribe() } catch (e) { /* */ }
    }
  }, [anuncioId])

  async function send() {
    if (!text.trim()) return
    const payload = {
      anuncio_id: anuncioId,
      sender_nome: 'Visitante',
      sender_telefone: '',
      conteudo: text,
    }
    setText('')
    try {
      await supabase.from('mensagens').insert(payload)
    } catch (e) {
      console.error('send message error', e)
    }
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold">Chat do anúncio</h3>
        {telefoneTitular && (
          <a href={getWhatsAppLink(telefoneTitular)} target="_blank" rel="noreferrer" className="text-green-600 font-bold">
            Abrir no WhatsApp
          </a>
        )}
      </div>

      <div className="bg-white border rounded p-3 h-64 overflow-auto">
        {loading ? (
          <div className="text-gray-500">Carregando mensagens...</div>
        ) : messages.length === 0 ? (
          <div className="text-gray-500">Nenhuma mensagem ainda.</div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="mb-2">
              <div className="text-sm text-gray-600">{m.sender_nome} • <span className="text-xs">{new Date(m.created_at).toLocaleString()}</span></div>
              <div className="bg-gray-100 p-2 rounded mt-1">{m.conteudo}</div>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escreva sua mensagem" className="flex-1 px-3 py-2 border rounded" />
        <button onClick={send} className="bg-blue-600 text-white px-4 rounded">Enviar</button>
      </div>
    </div>
  )
}
