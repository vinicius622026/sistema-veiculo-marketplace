import React from 'react'
import clsx from 'clsx'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export default function Container({
  children,
  className,
  maxWidth = 'xl',
}: ContainerProps) {
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
  }[maxWidth]

  return (
    <div className={clsx('container mx-auto px-4 py-8', maxWidthClass, className)}>
      {children}
    </div>
  )
}
