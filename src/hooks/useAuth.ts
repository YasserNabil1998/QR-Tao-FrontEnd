
import { useState, useEffect, useContext } from 'react'
import { supabase } from '../lib/supabase'
import { AuthContext } from '../components/auth/AuthProvider'

interface User {
  id: string
  email: string
  full_name: string
  role: 'super_admin' | 'restaurant_admin' | 'cashier' | 'chef' | 'waiter'
  restaurant_id: string | null
  is_active: boolean
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const token = localStorage.getItem('qtap_token')
      if (!token) {
        setLoading(false)
        return
      }

      // For demo purposes, check if Supabase is available
      if (!import.meta.env.VITE_PUBLIC_SUPABASE_URL) {
        console.warn('Supabase not configured - running in demo mode')
        localStorage.removeItem('qtap_token')
        setUser(null)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', token)
        .eq('is_active', true)
        .single()

      if (error || !data) {
        localStorage.removeItem('qtap_token')
        setUser(null)
      } else {
        setUser(data)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      localStorage.removeItem('qtap_token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      // Simple password verification - in production, use proper hashing
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('is_active', true)
        .single()

      if (error || !data) {
        return { success: false, error: 'Invalid email or password' }
      }

      // In production, verify hashed password
      if (data.password_hash !== password) {
        return { success: false, error: 'Invalid email or password' }
      }

      localStorage.setItem('qtap_token', data.id)
      setUser(data)
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  const signUp = async (email: string, password: string, fullName: string, role: string, restaurantId?: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: email.toLowerCase(),
          password_hash: password, // In production, hash the password
          full_name: fullName,
          role: role as any,
          restaurant_id: restaurantId || null
        })
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      localStorage.setItem('qtap_token', data.id)
      setUser(data)
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' }
    }
  }

  const signOut = async () => {
    localStorage.removeItem('qtap_token')
    setUser(null)
  }

  const hasPermission = (permission: string) => {
    if (!user) return false
    
    const permissions: Record<string, string[]> = {
      super_admin: ['all'],
      restaurant_admin: ['restaurant_manage', 'menu_manage', 'orders_view', 'staff_manage'],
      cashier: ['orders_view', 'payments_manage'],
      chef: ['orders_view', 'kitchen_manage'],
      waiter: ['orders_view', 'table_manage']
    }

    const userPermissions = permissions[user.role] || []
    return userPermissions.includes('all') || userPermissions.includes(permission)
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    hasPermission
  }
}
