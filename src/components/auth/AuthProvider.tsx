import { createContext, ReactNode } from 'react'
import { useAuthProvider } from '../../hooks/useAuth'

interface User {
  id: string
  email: string
  full_name: string
  role: 'super_admin' | 'restaurant_admin' | 'cashier' | 'chef' | 'waiter'
  restaurant_id: string | null
  is_active: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, fullName: string, role: string, restaurantId?: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  hasPermission: (permission: string) => boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuthProvider()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}