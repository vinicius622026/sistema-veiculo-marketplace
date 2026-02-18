import { useState } from 'react'
import { User } from '@/types'

export function useProtectRoute(_role?: string): { isProtected: boolean; user: User | null } {
  // minimal placeholder: not protected
  return { isProtected: false, user: null }
}
