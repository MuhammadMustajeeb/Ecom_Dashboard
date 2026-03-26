import { createClient } from '@supabase/supabase-js'
import { Database } from './supabase'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface AuthUser {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  company_name?: string
  created_at: string
  updated_at: string
}

export async function signUp(email: string, password: string, fullName: string, companyName?: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company_name: companyName || undefined,
        }
      }
    })

    if (error) {
      console.error('Sign up error:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Sign up error:', error)
    throw error
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Sign in error:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Sign in error:', error)
    throw error
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Sign out error:', error)
      throw error
    }
  } catch (error) {
    console.error('Sign out error:', error)
    throw error
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return null
    }

    // Get user profile from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || '',
        avatar_url: user.user_metadata?.avatar_url || '',
        company_name: user.user_metadata?.company_name || '',
        created_at: user.created_at || '',
        updated_at: user.updated_at || ''
      }
    }

    return {
      id: user.id,
      email: user.email || '',
      full_name: (profile as any).full_name || user.user_metadata?.full_name || '',
      avatar_url: (profile as any).avatar_url || user.user_metadata?.avatar_url || '',
      company_name: (profile as any).company_name || user.user_metadata?.company_name || '',
      created_at: (profile as any).created_at || user.created_at || '',
      updated_at: (profile as any).updated_at || user.updated_at || ''
    }
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

export async function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      getCurrentUser().then(callback)
    } else if (event === 'SIGNED_OUT') {
      callback(null)
    }
  })

  return subscription
}
