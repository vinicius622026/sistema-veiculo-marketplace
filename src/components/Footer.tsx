import React from 'react'

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200/70 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-slate-500">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white text-xs">MV</span>
            <span className="font-medium text-slate-700">Sistema Veiculo Marketplace</span>
          </div>
          <div className="text-center md:text-right">
            © {new Date().getFullYear()} Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  )
}
