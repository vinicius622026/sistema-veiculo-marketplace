"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '../lib/supabaseClient'

export default function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  useEffect(() => {
    let mounted = true
    async function check() {
      try {
        const { data } = await supabase.auth.getSession()
        if (mounted && !data.session) router.push('/login')
      } catch (e) {
        if (mounted) router.push('/login')
      }
    }
    check()
    return () => { mounted = false }
  }, [router])
  return <>{children}</>
}
