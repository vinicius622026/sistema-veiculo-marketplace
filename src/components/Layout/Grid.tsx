import React from 'react'
import clsx from 'clsx'

interface GridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Grid({
  children,
  columns = 3,
  gap = 'md',
  className,
}: GridProps) {
  const columnsClass = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }

  const gapClass = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8',
  }[gap]

  return (
    <div
      className={clsx(
        'grid',
        columnsClass[columns],
        gapClass,
        className
      )}
    >
      {children}
    </div>
  )
}
