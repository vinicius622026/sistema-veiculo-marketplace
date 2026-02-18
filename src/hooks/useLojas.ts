import { useState } from 'react'

export function useLojas() {
  const [loja, setLoja] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  function buscarMinha(_userId?: string) {
    // placeholder
    setLoja(null)
  }

  return { loja, buscarMinha, loading }
}
