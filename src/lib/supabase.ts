import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string
          amount: number
          status: 'paid' | 'pending' | 'failed'
          created_at: string
          customer_id: string
        }
        Insert: {
          id?: string
          amount: number
          status?: 'paid' | 'pending' | 'failed'
          created_at?: string
          customer_id: string
        }
        Update: {
          id?: string
          amount?: number
          status?: 'paid' | 'pending' | 'failed'
          created_at?: string
          customer_id?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
        }
      }
    }
  }
}
