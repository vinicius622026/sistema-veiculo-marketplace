import React from 'react'

interface Props {
  message?: string
}

export default function Spinner({ message }: Props) {
  return (
    <div className="text-center py-8">
      <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      {message && <p className="text-gray-600 mt-2">{message}</p>}
    </div>
  )
}
