import React, { useEffect, useRef } from 'react'
import { AnuncioComDistancia } from '@/types/localizacao'

interface Props {
  anuncios: AnuncioComDistancia[]
  userLocation?: { latitude: number; longitude: number }
}

export default function MapaVeiculos({ anuncios, userLocation }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Placeholder: integrar Google Maps no futuro
    // Deixar espaço para inicializar mapa quando API key estiver disponível
  }, [anuncios, userLocation])

  return (
    <div ref={mapRef} className="w-full h-96 bg-gray-200 rounded-lg border-2 border-gray-300 flex items-center justify-center">
      <p className="text-gray-600 text-center">🗺️ Mapa interativo será carregado aqui<br/><span className="text-sm">(Integração Google Maps)</span></p>
    </div>
  )
}
