import React from 'react'
import clsx from 'clsx'

interface FormGroupProps {
  label?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  helper?: string
}

export default function FormGroup({
  label,
  error,
  required,
  children,
  helper,
}: FormGroupProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}

      <div className="relative">{children}</div>

      {error ? (
        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      ) : (
        helper && <p className="text-sm text-gray-500 mt-1">{helper}</p>
      )}
    </div>
  )
}
