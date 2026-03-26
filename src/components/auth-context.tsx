'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { AuthUser, getCurrentUser, onAuthStateChange } from '@/lib/auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string, companyName?: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser().then(setUser).finally(() => setLoading(false))
    
    const subscription = onAuthStateChange(setUser)
    
    return () => {
      if (subscription) {
        ;(subscription as any).unsubscribe()
      }
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { signIn } = await import('@/lib/auth')
    await signIn(email, password)
  }

  const signUp = async (email: string, password: string, fullName: string, companyName?: string) => {
    const { signUp } = await import('@/lib/auth')
    await signUp(email, password, fullName, companyName)
  }

  const signOut = async () => {
    const { signOut } = await import('@/lib/auth')
    await signOut()
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
