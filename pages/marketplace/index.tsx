import React, { useState } from 'react'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import Container from '@/components/Layout/Container'
import PageHeader from '@/components/Layout/PageHeader'
import Grid from '@/components/Layout/Grid'
import Card from '@/components/Layout/Card'
import Button from '@/components/Buttons/Button'
import { useAnuncios } from '@/hooks/useAnuncios'
import { useRouter } from 'next/router'
import AnuncioCard from '@/components/Cards/AnuncioCard'
import Spinner from '@/components/Loading/Spinner'

export default function Marketplace() {
  const router = useRouter()
  const [filtros, setFiltros] = useState({
    cidade: '',
    estado: '',
  })
  const [page, setPage] = useState(1)

  const { anuncios, total, totalPages, loading } = useAnuncios(undefined, filtros, page)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <Container maxWidth="2xl" className="py-8">
        <PageHeader
          title="🚗 Marketplace"
          subtitle="Encontre o veiculo perfeito com dados completos e revendas confiaveis"
          action={
            <Button
              onClick={() => router.push('/auth/signup?role=lojista')}
              variant="secondary"
              icon="🏪"
            >
              Anunciar
            </Button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* FILTROS */}
          <aside className="space-y-4">
            <Card className="bg-white/80">
              <h3 className="font-bold text-lg mb-4">🔍 Filtros</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={filtros.cidade}
                    onChange={(e) =>
                      setFiltros({ ...filtros, cidade: e.target.value })
                    }
                    placeholder="Sao Paulo"
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={filtros.estado}
                    onChange={(e) =>
                      setFiltros({ ...filtros, estado: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  >
                    <option value="">Todos</option>
                    <option value="SP">Sao Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="BA">Bahia</option>
                    <option value="PR">Parana</option>
                  </select>
                </div>

                <Button fullWidth onClick={() => setPage(1)}>
                  Buscar
                </Button>
              </div>
            </Card>

            <Card className="bg-slate-900 text-white">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Dica rapida</p>
              <p className="mt-2 text-sm">Use filtros por cidade e estado para comparar ofertas locais com mais precisao.</p>
            </Card>
          </aside>

          {/* RESULTADO */}
          <main className="lg:col-span-3">
            <Card className="mb-6 bg-gradient-to-r from-slate-50 to-white">
              <p className="text-slate-800 font-semibold">
                {total} anuncio{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
              </p>
            </Card>

            {loading ? (
              <Spinner message="Carregando anuncios..." />
            ) : anuncios.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-xl text-slate-600">
                  📭 Nenhum anuncio encontrado com esses filtros
                </p>
              </Card>
            ) : (
              <>
                <Grid columns={3} gap="md">
                  {anuncios.map((anuncio) => (
                    <AnuncioCard
                      key={anuncio.id}
                      anuncio={anuncio}
                    />
                  ))}
                </Grid>

                {/* PAGINACAO */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <Button
                          key={p}
                          variant={page === p ? 'primary' : 'secondary'}
                          size="sm"
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </Button>
                      )
                    )}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </Container>

      <Footer />
    </div>
  )
}

