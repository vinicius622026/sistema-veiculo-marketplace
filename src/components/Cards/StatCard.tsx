import React from 'react'
import clsx from 'clsx'

interface StatCardProps {
  icon: string
  label: string
  value: string | number
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  trend?: number
}

export default function StatCard({
  icon,
  label,
  value,
  color = 'blue',
  trend,
}: StatCardProps) {
  const colorClass = {
    blue: 'from-blue-50 to-blue-100 text-blue-900 border-blue-200',
    green: 'from-emerald-50 to-emerald-100 text-emerald-900 border-emerald-200',
    yellow: 'from-amber-50 to-amber-100 text-amber-900 border-amber-200',
    red: 'from-rose-50 to-rose-100 text-rose-900 border-rose-200',
    purple: 'from-violet-50 to-violet-100 text-violet-900 border-violet-200',
  }[color]

  return (
    <div className={clsx('rounded-2xl border p-6 bg-gradient-to-br', colorClass)}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-3xl">{icon}</span>
        {trend !== undefined && (
          <div
            className={clsx(
              'text-sm font-bold px-2 py-1 rounded',
              trend >= 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            )}
          >
            {trend >= 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  )
}
