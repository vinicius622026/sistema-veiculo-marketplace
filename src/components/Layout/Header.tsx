import React from 'react'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">WebMotors</Link>

        <nav className="flex gap-4">
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/login">Entrar</Link>
        </nav>
      </div>
    </header>
  )
}
