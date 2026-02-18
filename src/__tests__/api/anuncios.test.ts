/// <reference types="jest" />
/** @jest-environment node */

import '@testing-library/jest-dom'
// @ts-ignore

const jExpect: any = expect

class MockRequest {
  url: string
  method?: string
  private _headers: Record<string, string>
  private _body?: string
  constructor(url: string, opts?: any) {
    this.url = url
    this.method = opts?.method
    this._body = opts?.body
    this._headers = {}
    const headers = opts?.headers || {}
    for (const k of Object.keys(headers)) this._headers[k.toLowerCase()] = headers[k]
  }
  headers = {
    get: (k: string) => this._headers[k.toLowerCase()] || null,
  }
  async json() {
    return this._body ? JSON.parse(this._body) : {}
  }
}
;(global as any).Request = MockRequest

class MockResponse {
  status: number
  private _body: any
  constructor(body?: any, init?: any) {
    this._body = body
    this.status = init?.status ?? 200
  }
  async json() {
    return typeof this._body === 'string' ? JSON.parse(this._body) : this._body
  }
}
;(global as any).Response = MockResponse

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

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: any) => new (global as any).Response(body, init),
  },
}))

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

    const { GET } = await import('../../../app/api/anuncios/route')
    const req = new Request('http://localhost:3000/api/anuncios?page=1&perPage=12')
    const res = await GET(req)
    const body = await res.json()

    jExpect(res.status).toBe(200)
    jExpect(body).toMatchObject({
      total: 1,
      page: 1,
      perPage: 12,
    })
    jExpect(Array.isArray(body.items)).toBe(true)
  })

  it('POST deve retornar 401 sem Authorization', async () => {
    const { POST } = await import('../../../app/api/anuncios/route')
    const req = new Request('http://localhost:3000/api/anuncios', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ titulo: 'Teste', preco: 1000, revenda_id: 'rev-1' }),
    })

    const res = await POST(req)
    const body = await res.json()

    jExpect(res.status).toBe(401)
    jExpect(body).toMatchObject({ error: 'Unauthorized' })
  })

  it('POST deve retornar 400 para payload inválido autenticado', async () => {
    ;(supabaseAdmin.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    })

    const { POST } = await import('../../../app/api/anuncios/route')
    const req = new Request('http://localhost:3000/api/anuncios', {
      method: 'POST',
      headers: {
        authorization: 'Bearer token-valido',
        'content-type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    const res = await POST(req)
    jExpect(res.status).toBe(400)
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

    const { POST } = await import('../../../app/api/anuncios/route')
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

    jExpect(res.status).toBe(200)
    jExpect(body).toMatchObject({
      id: 'anuncio-1',
      titulo: 'Carro com imagens',
      foto_url: payload.foto,
      thumbnail_url: payload.thumbnail,
    })
  })
})
