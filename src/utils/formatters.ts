export function formatCurrency(value: number | undefined): string {
  if (!value) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string | undefined): string {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('pt-BR')
}

export function formatDateTime(date: string | undefined): string {
  if (!date) return '-'
  return new Date(date).toLocaleString('pt-BR')
}

export function formatPhone(phone: string | undefined): string {
  if (!phone) return '-'
  return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')
}

export function formatDocument(doc: string | undefined): string {
  if (!doc) return '-'
  if (doc && doc.length === 11) {
    return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  return doc ? doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5') : '-'
}

export function formatPlate(plate: string | undefined): string {
  if (!plate) return '-'
  return plate.toUpperCase()
}
