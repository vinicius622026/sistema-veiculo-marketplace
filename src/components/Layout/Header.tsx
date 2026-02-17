import Link from 'next/link'
import React from 'react'

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <a className="text-xl font-bold text-blue-600">WebMotors</a>
        </Link>

        <nav className="flex gap-4">
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/auth/login">Entrar</Link>
        </nav>
      </div>
    </header>
  )
}
