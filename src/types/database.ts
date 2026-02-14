// Generated types based on Project M Supabase schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          university_id: string
          university: string | null
          email: string
          username: string | null
          role: 'student' | 'admin'
          current_xp: number
          streak_count: number
          last_active_at: string
          updated_at: string
        }
        Insert: {
          id: string
          university_id: string
          university?: string | null
          email: string
          username?: string | null
          role?: 'student' | 'admin'
          current_xp?: number
          streak_count?: number
          last_active_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          university_id?: string
          university?: string | null
          email?: string
          username?: string | null
          role?: 'student' | 'admin'
          current_xp?: number
          streak_count?: number
          last_active_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      missions: {
        Row: {
          id: string
          title: string
          sequence_order: number
          xp_reward: number
          is_published: boolean
        }
        Insert: {
          id?: string
          title: string
          sequence_order: number
          xp_reward?: number
          is_published?: boolean
        }
        Update: {
          id?: string
          title?: string
          sequence_order?: number
          xp_reward?: number
          is_published?: boolean
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          mission_id: string
          task_type: 'quiz' | 'video' | 'gps' | 'upload'
          content: Json
        }
        Insert: {
          id?: string
          mission_id: string
          task_type: 'quiz' | 'video' | 'gps' | 'upload'
          content?: Json
        }
        Update: {
          id?: string
          mission_id?: string
          task_type?: 'quiz' | 'video' | 'gps' | 'upload'
          content?: Json
        }
        Relationships: [
          {
            foreignKeyName: "tasks_mission_id_fkey"
            columns: ["mission_id"]
            referencedRelation: "missions"
            referencedColumns: ["id"]
          }
        ]
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          mission_id: string
          status: 'locked' | 'active' | 'completed'
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          mission_id: string
          status?: 'locked' | 'active' | 'completed'
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          mission_id?: string
          status?: 'locked' | 'active' | 'completed'
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_mission_id_fkey"
            columns: ["mission_id"]
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      mission_attempts: {
        Row: {
          id: string
          user_id: string
          mission_id: string
          success: boolean
          metadata: Json
          attempted_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mission_id: string
          success: boolean
          metadata: Json
          attempted_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mission_id?: string
          success?: boolean
          metadata?: Json
          attempted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_attempts_mission_id_fkey"
            columns: ["mission_id"]
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_attempts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      leaderboard_view: {
        Row: {
          rank: number
          username: string | null
          avatar_url: string | null
          current_xp: number
          university_id: string
        }
      }
    }
    Functions: {
      unlock_next_mission: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_streak_maintenance: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: 'student' | 'admin'
      mission_type: 'quiz' | 'video' | 'gps' | 'upload'
      progress_status: 'locked' | 'active' | 'completed'
    }
  }
}

// Additional frontend-specific types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Mission = Database['public']['Tables']['missions']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type UserProgress = Database['public']['Tables']['user_progress']['Row']
export type MissionAttempt = Database['public']['Tables']['mission_attempts']['Row']
export type LeaderboardEntry = Database['public']['Views']['leaderboard_view']['Row']

export type ProgressStatus = Database['public']['Enums']['progress_status']
export type MissionType = Database['public']['Enums']['mission_type']
export type AppRole = Database['public']['Enums']['app_role']

// Task content types for different mission types
export interface QuizContent {
  question: string
  options: string[]
  correct_answer: string
  explanation?: string
}

export interface VideoContent {
  url: string
  duration?: number
  thumbnail?: string
  checkpoints?: number[]
}

export interface GPSContent {
  latitude: number
  longitude: number
  radius: number
  location_name: string
  description?: string
}

export interface UploadContent {
  allowed_types: string[]
  max_size: number
  instructions: string
  rubric?: string[]
}

// Mission with populated relationships
export interface MissionWithTask extends Mission {
  tasks: Task[]
}

export interface MissionWithProgress extends Mission {
  user_progress?: UserProgress[]
  tasks: Task[]
}

// XP and progression types
export interface XPGain {
  base_xp: number
  earned_xp: number
  is_critical: boolean
  multiplier?: number
}

export interface StreakInfo {
  current_streak: number
  best_streak: number
  streak_bonus: number
}

// Real-time subscription types
export interface ProgressUpdate {
  user_id: string
  mission_id: string
  status: ProgressStatus
  xp_gained?: number
  streak_updated?: boolean
}

// Frontend state types
export interface AuthState {
  user: Profile | null
  session: any | null
  loading: boolean
  error: string | null
}

export interface GameState {
  missions: MissionWithProgress[]
  currentMission: MissionWithTask | null
  userProgress: UserProgress[]
  xpHistory: XPGain[]
  loading: boolean
  error: string | null
}

export interface LeaderboardState {
  entries: LeaderboardEntry[]
  userRank: number | null
  loading: boolean
  error: string | null
}

// API response types for Edge Functions
export interface SubmitMissionResponse {
  success: boolean
  xp_earned?: number
  is_critical?: boolean
  error?: string
  next_mission_unlocked?: boolean
}

export interface MissionSubmission {
  mission_id: string
  user_answer: string
  user_id: string
  metadata?: Record<string, any>
}
