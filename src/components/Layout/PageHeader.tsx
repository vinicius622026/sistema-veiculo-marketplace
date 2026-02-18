import React from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: string
  action?: React.ReactNode
}

export default function PageHeader({
  title,
  subtitle,
  icon,
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-8 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {icon && <span className="text-4xl">{icon}</span>}
            <h1 className="text-4xl font-bold text-slate-900">{title}</h1>
          </div>
          {subtitle && <p className="text-lg text-slate-600">{subtitle}</p>}
        </div>
        {action && <div className="pt-1">{action}</div>}
      </div>
    </div>
  )
}
