import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Sistema Veículo Marketplace — Todos os direitos reservados.
      </div>
    </footer>
  )
}
