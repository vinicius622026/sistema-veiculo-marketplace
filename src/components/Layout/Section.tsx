import React from 'react'
import clsx from 'clsx'

interface SectionProps {
  children: React.ReactNode
  className?: string
  background?: 'white' | 'gray' | 'blue' | 'gradient'
  padding?: 'sm' | 'md' | 'lg'
}

export default function Section({
  children,
  className,
  background = 'white',
  padding = 'md',
}: SectionProps) {
  const bgClass = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    blue: 'bg-blue-50',
    gradient: 'bg-gradient-to-r from-blue-600 to-blue-800 text-white',
  }[background]

  const paddingClass = {
    sm: 'py-8 px-4',
    md: 'py-12 px-4',
    lg: 'py-16 px-4',
  }[padding]

  return (
    <section className={clsx(bgClass, paddingClass, className)}>
      <div className="container mx-auto max-w-6xl">{children}</div>
    </section>
  )
}
