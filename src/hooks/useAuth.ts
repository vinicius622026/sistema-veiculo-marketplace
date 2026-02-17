import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../services/supabaseClient'
import { User } from '../types'

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

export function useAuth() {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  })

  useEffect(() => {
    checkAuth()

    const { data } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (profile) {
              const { data: revenda } = await supabase
                .from('revendas')
                .select('id')
                .eq('owner_id', session.user.id)
                .single()

              setAuthState({
                user: {
                  id: session.user.id,
                  email: session.user.email || '',
                  full_name: profile.full_name || '',
                  tipo_usuario: profile.tipo_usuario,
                  revenda_id: revenda?.id,
                  created_at: profile.created_at,
                } as User,
                loading: false,
                error: null,
                isAuthenticated: true,
              })
            }
          } catch (error) {
            console.error('Erro ao carregar profile:', error)
            setAuthState((s) => ({ ...s, loading: false, error: 'Erro ao carregar perfil' }))
          }
        } else {
          setAuthState({
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false,
          })
        }
      }
    )

    return () => { (data as any)?.subscription?.unsubscribe?.() }
  }, [])

  async function checkAuth() {
    try {
      const { data } = await supabase.auth.getSession()

      if (data.session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single()

        if (profile) {
          const { data: revenda } = await supabase
            .from('revendas')
            .select('id')
            .eq('owner_id', data.session.user.id)
            .single()

          setAuthState({
            user: {
              id: data.session.user.id,
              email: data.session.user.email || '',
              full_name: profile.full_name || '',
              tipo_usuario: profile.tipo_usuario,
              revenda_id: revenda?.id,
              created_at: profile.created_at,
            } as User,
            loading: false,
            error: null,
            isAuthenticated: true,
          })
        } else {
          setAuthState({ user: null, loading: false, error: null, isAuthenticated: false })
        }
      } else {
        setAuthState({ user: null, loading: false, error: null, isAuthenticated: false })
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
      setAuthState({ user: null, loading: false, error: 'Erro ao verificar autenticação', isAuthenticated: false })
    }
  }

  return {
    ...authState,
    signOut: async () => {
      await supabase.auth.signOut()
      setAuthState({ user: null, loading: false, error: null, isAuthenticated: false })
      try { router.push('/') } catch (e) { /**/ }
    },
  }
}

export default useAuth
