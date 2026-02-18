import React from 'react'
import clsx from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
}

export default function Badge({
  children,
  color = 'blue',
  size = 'md',
  icon,
}: BadgeProps) {
  const colorClass = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    purple: 'bg-purple-100 text-purple-800',
    gray: 'bg-gray-100 text-gray-800',
  }[color]

  const sizeClass = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  }[size]

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 font-semibold rounded-full',
        colorClass,
        sizeClass
      )}
    >
      {icon && <span>{icon}</span>}
      {children}
    </span>
  )
}
