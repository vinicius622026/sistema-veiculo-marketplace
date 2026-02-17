export async function listarAnuncios(params?: Record<string, any>) {
  const qs = new URLSearchParams()
  if (params) {
    Object.keys(params).forEach(k => { if (params[k] !== undefined && params[k] !== null) qs.set(k, String(params[k])) })
  }
  const url = `/api/anuncios?${qs.toString()}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Erro ao listar anúncios')
  return res.json()
}

export async function buscarAnuncio(id: string) {
  const res = await fetch(`/api/anuncios/${id}`)
  if (!res.ok) throw new Error('Anúncio não encontrado')
  return res.json()
}

export async function criarAnuncio(dados: any) {
  const res = await fetch('/api/anuncios', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados) })
  if (!res.ok) throw new Error('Erro ao criar anúncio')
  return res.json()
}
