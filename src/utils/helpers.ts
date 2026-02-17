export function getWhatsAppLink(phone: string | undefined, text?: string) {
  if (!phone) return '#'
  const cleaned = phone.replace(/[^0-9+]/g, '')
  const msg = text ? encodeURIComponent(text) : ''
  // Use wa.me link format
  return `https://wa.me/${cleaned}${msg ? `?text=${msg}` : ''}`
}

export default { getWhatsAppLink }
export function getInitials(name: string | undefined): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ativa: 'bg-green-100 text-green-800',
    proposta: 'bg-yellow-100 text-yellow-800',
    pausada: 'bg-orange-100 text-orange-800',
    cancelada: 'bg-red-100 text-red-800',
    completa: 'bg-blue-100 text-blue-800',
    disponivel: 'bg-green-100 text-green-800',
    vendido: 'bg-gray-100 text-gray-800',
    manutencao: 'bg-yellow-100 text-yellow-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function truncate(text: string | undefined, length: number = 100): string {
  if (!text) return ''
  return text.length > length ? text.slice(0, length) + '...' : text
}
