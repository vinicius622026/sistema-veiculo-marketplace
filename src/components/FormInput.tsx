"use client"
import React from 'react'

interface FormInputProps {
  label?: string
  name?: string
  type?: string
  value?: string | number
  placeholder?: string
  required?: boolean
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FormInput({
  label,
  name,
  type = 'text',
  value = '',
  placeholder = '',
  required = false,
  className = '',
  onChange,
}: FormInputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={name} className="block text-sm">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value as any}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full border px-3 py-2 rounded ${className}`}
      />
    </div>
  )
}
