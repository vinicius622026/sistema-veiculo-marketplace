"use client"
import React from 'react'
import Link from 'next/link'
import Protected from '../../src/components/Protected'

const navItems = [
  { href: '/dashboard', label: 'Visao geral' },
  { href: '/dashboard/estoque', label: 'Estoque' },
  { href: '/dashboard/anuncios', label: 'Anuncios' },
  { href: '/dashboard/mensagens', label: 'Mensagens' },
  { href: '/dashboard/relatorios', label: 'Relatorios' },
  { href: '/dashboard/financeiro', label: 'Financeiro' },
  { href: '/dashboard/configuracoes', label: 'Configuracoes' },
  { href: '/dashboard/suporte', label: 'Suporte' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Protected allowedRoles={["vendedor", "admin"]}>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-6 rounded-3xl border border-slate-200/70 bg-white/80 p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Painel</p>
            <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
            <p className="mt-2 text-sm text-slate-500">Controle seu estoque, anuncios e performance.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
            <aside className="rounded-2xl border border-slate-200/70 bg-white/90 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Navegacao</div>
              <nav className="mt-4 flex flex-col gap-2 text-sm">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </aside>

            <main className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm">
              {children}
            </main>
          </div>
        </div>
      </div>
    </Protected>
  )
}
