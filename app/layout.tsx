import React from 'react'
import '../src/styles/globals.css'
import Header from '../src/components/Header'
import Footer from '../src/components/Footer'

export const metadata = {
  title: 'Sistema Veículo Marketplace',
  description: 'Marketplace de veículos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
