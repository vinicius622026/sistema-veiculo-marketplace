"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '../services/supabaseClient'

interface ProtectedProps {
  children: React.ReactNode
  allowedRoles?: Array<'comprador' | 'vendedor' | 'admin'>
}

export default function Protected({ children, allowedRoles }: ProtectedProps) {
  const router = useRouter()
  const [authorized, setAuthorized] = React.useState(false)

  useEffect(() => {
    let mounted = true
    async function check() {
      try {
        const { data } = await supabase.auth.getSession()
        if (mounted && !data.session) {
          router.push('/login')
          return
        }

        if (mounted && data.session && allowedRoles && allowedRoles.length > 0) {
          const userId = data.session.user.id
          const { data: profile } = await supabase
            .from('profiles')
            .select('tipo_usuario')
            .eq('id', userId)
            .single()

          const role = profile?.tipo_usuario as 'comprador' | 'vendedor' | 'admin' | undefined
          if (!role || !allowedRoles.includes(role)) {
            router.push('/anuncios')
            return
          }
        }

        if (mounted) setAuthorized(true)
      } catch (e) {
        if (mounted) router.push('/login')
      }
    }
    check()
    return () => { mounted = false }
  }, [router, allowedRoles])

  if (!authorized) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-sm text-gray-600">
        Verificando acesso...
      </div>
    )
  }

  return <>{children}</>
}
