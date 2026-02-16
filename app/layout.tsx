import React from 'react'
import '../src/styles/globals.css'

export const metadata = {
  title: 'Sistema Veículo Marketplace',
  description: 'Marketplace de veículos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  )
}
