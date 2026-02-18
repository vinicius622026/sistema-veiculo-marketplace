import React from 'react'
import clsx from 'clsx'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?: string
  icon?: string
  inputSize?: 'sm' | 'md' | 'lg'
}

export default React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ error, icon, inputSize = 'md', className, ...props }, ref) {
    const sizeClass = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-4 py-3 text-lg',
    }[inputSize]

    return (
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full border-2 rounded-lg transition-all duration-200',
            'focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
            icon && 'pl-10',
            error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-gray-400',
            sizeClass,
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
