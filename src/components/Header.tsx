import React from 'react'
import Link from 'next/link'
import supabase from '../lib/supabaseClient'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold">Sistema Veículo</Link>
        <nav className="space-x-4 flex items-center">
          <Link href="/" className="text-gray-600 hover:text-gray-900">Início</Link>
          <Link href="/anuncios" className="text-gray-600 hover:text-gray-900">Anúncios</Link>
          <Link href="/anuncios/new" className="text-gray-600 hover:text-gray-900">Criar Anúncio</Link>
          <Link href="/revendas" className="text-gray-600 hover:text-gray-900">Revendas</Link>
          <Link href="/signup" className="text-gray-600 hover:text-gray-900">Cadastrar</Link>
          <Link href="/login" className="text-blue-600 hover:underline">Entrar</Link>
          <button onClick={async () => {
            try {
              await supabase.auth.signOut()
              window.location.href = '/'
            } catch (e) { console.error(e) }
          }} className="ml-4 text-sm text-gray-500">Sair</button>
        </nav>
      </div>
    </header>
  )
}
