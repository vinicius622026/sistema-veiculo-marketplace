import { useState, useEffect } from 'react'

export function useAnuncios(_revendaId?: string | number, _filtros?: any, page = 1) {
  const [anuncios, setAnuncios] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    // placeholder: empty list
    setAnuncios([])
    setTotal(0)
    setTotalPages(1)
    setLoading(false)
  }, [page])

  return { anuncios, total, totalPages, loading }
}
