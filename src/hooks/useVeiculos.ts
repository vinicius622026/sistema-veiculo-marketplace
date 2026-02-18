import { useState, useEffect } from 'react'

export function useVeiculos(_lojaId?: string) {
  const [veiculos, setVeiculos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(false)
    setVeiculos([])
  }, [_lojaId])

  return { veiculos, loading }
}
