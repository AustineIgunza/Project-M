import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile, AuthState } from '@/types/database'
import { 
  supabase, 
  signIn, 
  signUp, 
  signOut, 
  getCurrentSession, 
  getProfile,
  updateProfile
} from '@/lib/supabase'

interface AuthStore extends AuthState {
  // Actions
  initialize: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (updates: Partial<Profile>) => Promise<void>
  verifyTwoFactor: (code: string) => Promise<void>
  clearError: () => void
  
  // Computed
  isAuthenticated: boolean
  userRole: 'student' | 'admin' | null
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        session: null,
        loading: true,
        error: null,
        isAuthenticated: false,
        userRole: null,

        // Actions
        initialize: async () => {
          try {
            set({ loading: true, error: null })
            
            const { data: { session } } = await getCurrentSession()
            
            if (session?.user) {
              const { data: profile, error: profileError } = await getProfile(session.user.id)
              
              if (profileError) {
                throw profileError
              }
              
              set({
                user: profile,
                session,
                isAuthenticated: true,
                userRole: profile.role,
                loading: false
              })
            } else {
              set({
                user: null,
                session: null,
                isAuthenticated: false,
                userRole: null,
                loading: false
              })
            }
          } catch (error) {
            console.error('Auth initialization error:', error)
            set({
              error: error instanceof Error ? error.message : 'Authentication failed',
              loading: false,
              user: null,
              session: null,
              isAuthenticated: false,
              userRole: null
            })
          }
        },

        login: async (email: string, password: string) => {
          try {
            set({ loading: true, error: null })
            
            const { data, error } = await signIn(email, password)
            
            if (error) throw error
            
            if (data.user) {
              const { data: profile, error: profileError } = await getProfile(data.user.id)
              
              if (profileError) {
                throw profileError
              }
              
              set({
                user: profile,
                session: data.session,
                isAuthenticated: true,
                userRole: profile.role,
                loading: false,
                error: null
              })
            }
          } catch (error) {
            console.error('Login error:', error)
            set({
              error: error instanceof Error ? error.message : 'Login failed',
              loading: false
            })
            throw error
          }
        },

        register: async (email: string, password: string, metadata = {}) => {
          try {
            set({ loading: true, error: null })
            
            const { data, error } = await signUp(email, password, metadata)
            
            if (error) throw error
            
            // Registration successful, but user needs to confirm email
            set({
              loading: false,
              error: null
            })
            
            // Note: Profile will be created after email confirmation
          } catch (error) {
            console.error('Registration error:', error)
            set({
              error: error instanceof Error ? error.message : 'Registration failed',
              loading: false
            })
            throw error
          }
        },

        logout: async () => {
          try {
            set({ loading: true, error: null })
            
            const { error } = await signOut()
            
            if (error) throw error
            
            set({
              user: null,
              session: null,
              isAuthenticated: false,
              userRole: null,
              loading: false,
              error: null
            })
          } catch (error) {
            console.error('Logout error:', error)
            set({
              error: error instanceof Error ? error.message : 'Logout failed',
              loading: false
            })
          }
        },

        updateUserProfile: async (updates: Partial<Profile>) => {
          try {
            const { user } = get()
            if (!user) throw new Error('No user logged in')
            
            set({ loading: true, error: null })
            
            const { error } = await updateProfile(user.id, updates)
            
            if (error) throw error
            
            set({
              user: { ...user, ...updates },
              loading: false,
              error: null
            })
          } catch (error) {
            console.error('Profile update error:', error)
            set({
              error: error instanceof Error ? error.message : 'Profile update failed',
              loading: false
            })
            throw error
          }
        },

        verifyTwoFactor: async (code: string) => {
          try {
            set({ loading: true, error: null })
            
            // For demo purposes, accept any 6-digit code
            if (code.length !== 6) {
              throw new Error('Invalid verification code')
            }
            
            // In production, this would verify with your 2FA service
            // await verifyTwoFactorCode(code)
            
            set({
              loading: false,
              error: null,
              // Set authenticated state - in real app this would come from backend
              isAuthenticated: true
            })
          } catch (error) {
            console.error('2FA verification error:', error)
            set({
              error: error instanceof Error ? error.message : 'Verification failed',
              loading: false
            })
            throw error
          }
        },

        clearError: () => set({ error: null })
      }),
      {
        name: 'fortress-auth',
        partialize: (state) => ({
          user: state.user,
          session: state.session,
          isAuthenticated: state.isAuthenticated,
          userRole: state.userRole
        })
      }
    ),
    { name: 'AuthStore' }
  )
)

// Setup auth state listener
supabase.auth.onAuthStateChange((event) => {
  const { initialize } = useAuthStore.getState()
  
  if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
    initialize()
  }
})
