import React, { useEffect, useState } from 'react'
import { useProtectRoute } from '@/hooks/useProtectRoute'
import { useLojas } from '@/hooks/useLojas'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import Container from '@/components/Layout/Container'
import PageHeader from '@/components/Layout/PageHeader'
import Grid from '@/components/Layout/Grid'
import Card from '@/components/Layout/Card'
import StatCard from '@/components/Cards/StatCard'
import Button from '@/components/Buttons/Button'
import Spinner from '@/components/Loading/Spinner'
import { useAnuncios } from '@/hooks/useAnuncios'
import { useVeiculos } from '@/hooks/useVeiculos'
import Link from 'next/link'

export default function PainelLojista() {
  const { isProtected, user } = useProtectRoute('lojista')
  const { loja, buscarMinha, loading: lojaLoading } = useLojas()
  const { veiculos, loading: veiculosLoading } = useVeiculos(loja?.id)
  const { anuncios } = useAnuncios(loja?.id)

  useEffect(() => {
    if (user) {
      buscarMinha(user.id)
    }
  }, [user])

  if (lojaLoading || veiculosLoading) return <Spinner />
  if (!isProtected || !loja) return null

  const stats = [
    { icon: '🚗', label: 'Veículos', value: veiculos.length, color: 'blue' as const },
    { icon: '📋', label: 'Anúncios', value: anuncios.length, color: 'green' as const },
    { icon: '👁️', label: 'Visitas', value: '0', color: 'yellow' as const },
    { icon: '📊', label: 'Taxa Conversão', value: '0%', color: 'purple' as const },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <Container maxWidth="2xl" className="py-8">
        <PageHeader
          title={`🏪 ${loja.nome}`}
          subtitle={`${loja.cidade}, ${loja.estado} • ${loja.telefone}`}
          action={
            <Link href="/painel-lojista/novo-veiculo">
              <Button icon="🚗">Novo Veiculo</Button>
            </Link>
          }
        />

        {/* ESTATISTICAS */}
        <Grid columns={4} className="mb-8">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </Grid>

        {/* ACOES RAPIDAS */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Atalhos</p>
            <h2 className="text-2xl font-bold">Acoes rapidas</h2>
          </div>
          <div className="text-sm text-slate-500">Gerencie seu estoque com rapidez</div>
        </div>
        <Grid columns={3} gap="lg" className="mb-8">
          <Link href="/painel-lojista/novo-veiculo">
            <Card hover className="text-left cursor-pointer">
              <p className="text-4xl mb-3">🚗</p>
              <h3 className="font-bold text-lg">Adicionar Veiculo</h3>
              <p className="text-sm text-slate-600">Cadastre um novo veiculo</p>
            </Card>
          </Link>

          <Link href="/painel-lojista/estoque">
            <Card hover className="text-left cursor-pointer">
              <p className="text-4xl mb-3">📊</p>
              <h3 className="font-bold text-lg">Meu Estoque</h3>
              <p className="text-sm text-slate-600">
                {veiculos.length} veiculos
              </p>
            </Card>
          </Link>

          <Link href="/painel-lojista/anuncios">
            <Card hover className="text-left cursor-pointer">
              <p className="text-4xl mb-3">📋</p>
              <h3 className="font-bold text-lg">Meus Anuncios</h3>
              <p className="text-sm text-slate-600">
                {anuncios.length} anuncios
              </p>
            </Card>
          </Link>

          <Link href="/painel-lojista/minha-loja">
            <Card hover className="text-left cursor-pointer">
              <p className="text-4xl mb-3">🏪</p>
              <h3 className="font-bold text-lg">Editar Loja</h3>
              <p className="text-sm text-slate-600">Configurar dados</p>
            </Card>
          </Link>

          <Link href="/">
            <Card hover className="text-left cursor-pointer">
              <p className="text-4xl mb-3">📈</p>
              <h3 className="font-bold text-lg">Relatorios</h3>
              <p className="text-sm text-slate-600">Ver performance</p>
            </Card>
          </Link>

          <Link href="/">
            <Card hover className="text-left cursor-pointer">
              <p className="text-4xl mb-3">⚙️</p>
              <h3 className="font-bold text-lg">Configuracoes</h3>
              <p className="text-sm text-slate-600">Gerenciar conta</p>
            </Card>
          </Link>
        </Grid>
      </Container>

      <Footer />
    </div>
  )
}
