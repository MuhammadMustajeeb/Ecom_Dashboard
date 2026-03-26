import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export interface Store {
  id: string
  name: string
  domain: string
  owner_email: string
  created_at: string
  updated_at: string
}

export interface TenantContext {
  store: Store | null
  isLoading: boolean
  error: string | null
}

class MultiTenantManager {
  private currentStore: Store | null = null
  private listeners: ((context: TenantContext) => void)[] = []

  constructor() {
    this.initializeFromStorage()
  }

  // Initialize from localStorage (client-side only)
  private initializeFromStorage() {
    if (typeof window !== 'undefined') {
      const storedStore = localStorage.getItem('current-store')
      if (storedStore) {
        try {
          this.currentStore = JSON.parse(storedStore)
        } catch (error) {
          console.error('Failed to parse stored store:', error)
          localStorage.removeItem('current-store')
        }
      }
    }
  }

  // Subscribe to store changes
  subscribe(listener: (context: TenantContext) => void) {
    this.listeners.push(listener)
    listener(this.getContext())
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  // Notify all listeners
  private notify() {
    const context = this.getContext()
    this.listeners.forEach(listener => listener(context))
  }

  // Get current context
  getContext(): TenantContext {
    return {
      store: this.currentStore,
      isLoading: false,
      error: null
    }
  }

  // Set current store
  setStore(store: Store | null) {
    this.currentStore = store
    
    if (typeof window !== 'undefined') {
      if (store) {
        localStorage.setItem('current-store', JSON.stringify(store))
      } else {
        localStorage.removeItem('current-store')
      }
    }
    
    this.notify()
  }

  // Get current store ID
  getStoreId(): string | null {
    return this.currentStore?.id || null
  }

  // Check if user has access to store
  async hasStoreAccess(storeId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('stores')
      .select('id')
      .eq('id', storeId)
      .eq('owner_email', (await supabase.auth.getUser()).data.user?.email || '')
      .single()

    return !error && !!data
  }

  // Get user's stores
  async getUserStores(): Promise<Store[]> {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user?.email) {
      return []
    }

    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('owner_email', user.user.email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user stores:', error)
      return []
    }

    return data || []
  }

  // Create new store
  async createStore(storeData: {
    name: string
    domain: string
  }): Promise<{ store: Store | null; error: string | null }> {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user?.email) {
      return { store: null, error: 'User not authenticated' }
    }

    const { data, error } = await supabase
      .from('stores')
      .insert({
        name: storeData.name,
        domain: storeData.domain,
        owner_email: user.user.email
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating store:', error)
      return { store: null, error: error.message }
    }

    this.setStore(data)
    return { store: data, error: null }
  }

  // Switch to different store
  async switchStore(storeId: string): Promise<{ success: boolean; error: string | null }> {
    const hasAccess = await this.hasStoreAccess(storeId)
    if (!hasAccess) {
      return { success: false, error: 'Access denied to this store' }
    }

    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('id', storeId)
      .single()

    if (error) {
      console.error('Error fetching store:', error)
      return { success: false, error: error.message }
    }

    this.setStore(data)
    return { success: true, error: null }
  }

  // Clear current store (logout)
  clearStore() {
    this.setStore(null)
  }
}

// Singleton instance
export const multiTenant = new MultiTenantManager()

// React hook for using multi-tenant context
export function useMultiTenant() {
  const [context, setContext] = useState<TenantContext>(multiTenant.getContext())

  useEffect(() => {
    const unsubscribe = multiTenant.subscribe(setContext)
    return unsubscribe
  }, [])

  return {
    ...context,
    setStore: multiTenant.setStore.bind(multiTenant),
    switchStore: multiTenant.switchStore.bind(multiTenant),
    createStore: multiTenant.createStore.bind(multiTenant),
    getUserStores: multiTenant.getUserStores.bind(multiTenant),
    clearStore: multiTenant.clearStore.bind(multiTenant)
  }
}
