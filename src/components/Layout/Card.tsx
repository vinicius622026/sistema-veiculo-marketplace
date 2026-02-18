import React from 'react'
import clsx from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
  shadow?: 'sm' | 'md' | 'lg'
}

export default function Card({
  children,
  className,
  hover = false,
  padding = 'md',
  shadow = 'md',
}: CardProps) {
  const paddingClass = {
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  }[padding]

  const shadowClass = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  }[shadow]

  return (
    <div
      className={clsx(
        'bg-white/90 rounded-2xl border border-slate-200/70',
        paddingClass,
        shadowClass,
        hover && 'hover:shadow-xl hover:-translate-y-0.5 transition duration-300',
        className
      )}
    >
      {children}
    </div>
  )
}
