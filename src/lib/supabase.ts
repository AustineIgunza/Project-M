import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Real-time subscription helpers
export const subscribeToProgress = (
  userId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel('user-progress')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_progress',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe()
}

export const subscribeToProfile = (
  userId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel('user-profile')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`
      },
      callback
    )
    .subscribe()
}

// Edge Function helpers
export const submitMission = async (
  missionId: string,
  userAnswer: string,
  userId: string,
  metadata?: Record<string, any>
) => {
  const { data, error } = await supabase.functions.invoke('submit-mission', {
    body: {
      mission_id: missionId,
      user_answer: userAnswer,
      user_id: userId,
      metadata
    }
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Auth helpers
export const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  })
}

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password
  })
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}

export const getCurrentUser = () => {
  return supabase.auth.getUser()
}

export const getCurrentSession = () => {
  return supabase.auth.getSession()
}

// Database query helpers
export const getMissions = async () => {
  return await supabase
    .from('missions')
    .select(`
      *,
      tasks (*)
    `)
    .eq('is_published', true)
    .order('sequence_order', { ascending: true })
}

export const getUserProgress = async (userId: string) => {
  return await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
}

export const getProfile = async (userId: string) => {
  return await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
}

export const updateProfile = async (userId: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>) => {
  return await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
}

export const getLeaderboard = async (universityId: string) => {
  return await supabase
    .from('leaderboard_view')
    .select('*')
    .eq('university_id', universityId)
    .limit(100)
}

export const getMissionAttempts = async (userId: string, missionId?: string) => {
  let query = supabase
    .from('mission_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('attempted_at', { ascending: false })

  if (missionId) {
    query = query.eq('mission_id', missionId)
  }

  return await query.limit(50)
}

// Utility functions
export const isAuthenticated = async () => {
  const { data: { session } } = await getCurrentSession()
  return !!session
}

export const requireAuth = async () => {
  const { data: { session } } = await getCurrentSession()
  if (!session) {
    throw new Error('Authentication required')
  }
  return session
}
