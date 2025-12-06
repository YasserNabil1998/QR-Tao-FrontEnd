import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjU0MjgwMCwiZXhwIjoxOTU4MTE4ODAwfQ.demo-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          full_name: string
          role: 'super_admin' | 'restaurant_admin' | 'cashier' | 'chef' | 'waiter'
          restaurant_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          full_name: string
          role: 'super_admin' | 'restaurant_admin' | 'cashier' | 'chef' | 'waiter'
          restaurant_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          full_name?: string
          role?: 'super_admin' | 'restaurant_admin' | 'cashier' | 'chef' | 'waiter'
          restaurant_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      restaurants: {
        Row: {
          id: string
          name: string
          slug: string
          email: string
          phone: string | null
          address: string | null
          logo_url: string | null
          theme_colors: any
          opening_hours: any
          subscription_status: 'trial' | 'active' | 'suspended' | 'cancelled'
          subscription_plan: 'basic' | 'premium' | 'enterprise'
          trial_ends_at: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          email: string
          phone?: string | null
          address?: string | null
          logo_url?: string | null
          theme_colors?: any
          opening_hours?: any
          subscription_status?: 'trial' | 'active' | 'suspended' | 'cancelled'
          subscription_plan?: 'basic' | 'premium' | 'enterprise'
          trial_ends_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          email?: string
          phone?: string | null
          address?: string | null
          logo_url?: string | null
          theme_colors?: any
          opening_hours?: any
          subscription_status?: 'trial' | 'active' | 'suspended' | 'cancelled'
          subscription_plan?: 'basic' | 'premium' | 'enterprise'
          trial_ends_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}