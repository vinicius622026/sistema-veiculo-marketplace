import { useState, useEffect } from 'react'
import { Coordenadas } from '@/types/localizacao'

interface GeoState {
  coordenadas: Coordenadas | null
  loading: boolean
  erro: string | null
  permissao: PermissionState | null
}

export function useGeolocalizacao() {
  const [state, setState] = useState<GeoState>({
    coordenadas: null,
    loading: true,
    erro: null,
    permissao: null,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, erro: 'Geolocalização não suportada', loading: false }))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coordenadas: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          loading: false,
          erro: null,
          permissao: 'granted',
        })
      },
      (error) => {
        setState({ coordenadas: null, loading: false, erro: error.message, permissao: 'denied' })
      }
    )
  }, [])

  return state
}

export function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distancia = R * c
  return Math.round(distancia * 10) / 10
}
