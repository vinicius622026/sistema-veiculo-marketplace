/** @jest-environment node */

jest.mock('../../../src/lib/prisma', () => ({
  prisma: {
    anuncio: {
      count: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
    revenda: {
      findUnique: jest.fn(),
    },
    veiculo: {
      create: jest.fn(),
    },
  },
}))

jest.mock('../../../src/lib/supabaseAdmin', () => ({
  __esModule: true,
  default: {
    auth: {
      getUser: jest.fn(),
    },
    storage: {
      from: jest.fn(() => ({
        remove: jest.fn(),
      })),
    },
  },
}))

import { GET, POST } from '../../../app/api/anuncios/route'
import { prisma } from '../../../src/lib/prisma'
import supabaseAdmin from '../../../src/lib/supabaseAdmin'

describe('API /api/anuncios (integração)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GET deve retornar 200 com lista paginada', async () => {
    ;(prisma.anuncio.count as jest.Mock).mockResolvedValue(1)
    ;(prisma.anuncio.findMany as jest.Mock).mockResolvedValue([
      { id: 'a1', titulo: 'Teste', preco: 1000 },
    ])

    const req = new Request('http://localhost:3000/api/anuncios?page=1&perPage=12')
    const res = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toMatchObject({
      total: 1,
      page: 1,
      perPage: 12,
    })
    expect(Array.isArray(body.items)).toBe(true)
  })

  it('POST deve retornar 401 sem Authorization', async () => {
    const req = new Request('http://localhost:3000/api/anuncios', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ titulo: 'Teste', preco: 1000, revenda_id: 'rev-1' }),
    })

    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(401)
    expect(body).toMatchObject({ error: 'Unauthorized' })
  })

  it('POST deve retornar 400 para payload inválido autenticado', async () => {
    ;(supabaseAdmin.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    })

    const req = new Request('http://localhost:3000/api/anuncios', {
      method: 'POST',
      headers: {
        authorization: 'Bearer token-valido',
        'content-type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('POST cria anúncio com imagens básicas quando autenticado e autorizado', async () => {
    ;(supabaseAdmin.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    })

    ;(prisma.revenda.findUnique as jest.Mock).mockResolvedValue({ id: 'rev-1', owner_id: 'user-1' })
    ;(prisma.veiculo.create as jest.Mock).mockResolvedValue({ id: 'estoque-1' })
    ;(prisma.anuncio.create as jest.Mock).mockResolvedValue({
      id: 'anuncio-1',
      titulo: 'Carro com imagens',
      preco: 25000,
      foto_url: 'https://via.placeholder.com/600x400.png',
      thumbnail_url: 'https://via.placeholder.com/200x150.png',
    })

    const payload = {
      titulo: 'Carro com imagens',
      descricao: 'Descrição com imagens básicas',
      preco: 25000,
      revenda_id: 'rev-1',
      cidade: 'Cidade',
      estado: 'SP',
      foto: 'https://via.placeholder.com/600x400.png',
      thumbnail: 'https://via.placeholder.com/200x150.png',
    }

    const req = new Request('http://localhost:3000/api/anuncios', {
      method: 'POST',
      headers: {
        authorization: 'Bearer token-valido',
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toMatchObject({
      id: 'anuncio-1',
      titulo: 'Carro com imagens',
      foto_url: payload.foto,
      thumbnail_url: payload.thumbnail,
    })
  })
})
