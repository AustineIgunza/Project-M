import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import type { 
  GameState, 
  MissionWithProgress, 
  MissionWithTask, 
  UserProgress,
  XPGain,
  SubmitMissionResponse 
} from '@/types/database'
import { 
  getMissions, 
  getUserProgress, 
  submitMission,
  subscribeToProgress,
  subscribeToProfile
} from '@/lib/supabase'
import { useAuthStore } from './authStore'

interface GameStore extends GameState {
  // Actions
  initialize: () => Promise<void>
  loadMissions: () => Promise<void>
  loadUserProgress: () => Promise<void>
  selectMission: (missionId: string) => void
  submitAnswer: (missionId: string, answer: string, metadata?: Record<string, any>) => Promise<SubmitMissionResponse>
  markMissionComplete: (missionId: string, xpGained: number, isCritical: boolean) => void
  clearError: () => void
  
  // Real-time subscriptions
  subscriptions: any[]
  setupSubscriptions: () => void
  cleanupSubscriptions: () => void
  
  // Computed
  activeMissions: MissionWithProgress[]
  completedMissions: MissionWithProgress[]
  lockedMissions: MissionWithProgress[]
  totalXP: number
  currentLevel: number
  xpToNextLevel: number
}

export const useGameStore = create<GameStore>()(
  devtools(
    subscribeWithSelector(
      (set, get) => ({
        // Initial state
        missions: [],
        currentMission: null,
        userProgress: [],
        xpHistory: [],
        loading: false,
        error: null,
        subscriptions: [],

        // Computed properties
        get activeMissions() {
          return get().missions.filter(mission => 
            mission.user_progress?.some(p => p.status === 'active')
          )
        },

        get completedMissions() {
          return get().missions.filter(mission => 
            mission.user_progress?.some(p => p.status === 'completed')
          )
        },

        get lockedMissions() {
          return get().missions.filter(mission => 
            !mission.user_progress?.length || 
            mission.user_progress?.some(p => p.status === 'locked')
          )
        },

        get totalXP() {
          const { user } = useAuthStore.getState()
          return user?.current_xp || 0
        },

        get currentLevel() {
          const xp = get().totalXP
          return Math.floor(xp / 300) + 1 // 300 XP per level
        },

        get xpToNextLevel() {
          const currentLevel = get().currentLevel
          const totalXP = get().totalXP
          const nextLevelXP = currentLevel * 300
          return nextLevelXP - totalXP
        },

        // Actions
        initialize: async () => {
          try {
            set({ loading: true, error: null })
            
            await Promise.all([
              get().loadMissions(),
              get().loadUserProgress()
            ])
            
            get().setupSubscriptions()
            
            set({ loading: false })
          } catch (error) {
            console.error('Game initialization error:', error)
            set({
              error: error instanceof Error ? error.message : 'Failed to initialize game',
              loading: false
            })
          }
        },

        loadMissions: async () => {
          try {
            const { data: missions, error } = await getMissions()
            
            if (error) throw error
            
            // Transform missions to include user progress
            const { user } = useAuthStore.getState()
            let userProgress: UserProgress[] = []
            
            if (user) {
              const { data: progress } = await getUserProgress(user.id)
              userProgress = progress || []
            }
            
            const missionsWithProgress: MissionWithProgress[] = missions?.map(mission => ({
              ...mission,
              user_progress: userProgress.filter(p => p.mission_id === mission.id)
            })) || []
            
            set({ missions: missionsWithProgress })
          } catch (error) {
            console.error('Load missions error:', error)
            set({
              error: error instanceof Error ? error.message : 'Failed to load missions'
            })
          }
        },

        loadUserProgress: async () => {
          try {
            const { user } = useAuthStore.getState()
            if (!user) return
            
            const { data: progress, error } = await getUserProgress(user.id)
            
            if (error) throw error
            
            set({ userProgress: progress || [] })
          } catch (error) {
            console.error('Load user progress error:', error)
            set({
              error: error instanceof Error ? error.message : 'Failed to load progress'
            })
          }
        },

        selectMission: (missionId: string) => {
          const { missions } = get()
          const mission = missions.find(m => m.id === missionId)
          
          if (mission) {
            const missionWithTask: MissionWithTask = {
              ...mission,
              tasks: mission.tasks
            }
            set({ currentMission: missionWithTask })
          }
        },

        submitAnswer: async (missionId: string, answer: string, metadata = {}) => {
          try {
            const { user } = useAuthStore.getState()
            if (!user) throw new Error('User not authenticated')
            
            set({ loading: true, error: null })
            
            const response = await submitMission(missionId, answer, user.id, metadata)
            
            if (response.success) {
              // Update local state
              const xpGain: XPGain = {
                base_xp: response.xp_earned || 0,
                earned_xp: response.xp_earned || 0,
                is_critical: response.is_critical || false
              }
              
              get().markMissionComplete(missionId, xpGain.earned_xp, xpGain.is_critical)
              
              set(state => ({
                xpHistory: [xpGain, ...state.xpHistory.slice(0, 9)], // Keep last 10
                loading: false
              }))
            }
            
            set({ loading: false })
            return response
            
          } catch (error) {
            console.error('Submit answer error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to submit answer'
            set({
              error: errorMessage,
              loading: false
            })
            throw new Error(errorMessage)
          }
        },

        markMissionComplete: (missionId: string, xpGained: number, isCritical: boolean) => {
          set(state => {
            const updatedMissions = state.missions.map(mission => {
              if (mission.id === missionId) {
                return {
                  ...mission,
                  user_progress: mission.user_progress?.map(progress => ({
                    ...progress,
                    status: 'completed' as const,
                    completed_at: new Date().toISOString()
                  })) || []
                }
              }
              return mission
            })
            
            return {
              missions: updatedMissions,
              currentMission: null // Clear current mission after completion
            }
          })
          
          // Update auth store with new XP (will be synced from backend)
          const { updateUserProfile, user } = useAuthStore.getState()
          if (user) {
            updateUserProfile({
              current_xp: user.current_xp + xpGained,
              last_active_at: new Date().toISOString()
            }).catch(console.error)
          }
        },

        setupSubscriptions: () => {
          const { user } = useAuthStore.getState()
          if (!user) return
          
          const { subscriptions } = get()
          
          // Clean up existing subscriptions
          subscriptions.forEach(sub => sub.unsubscribe())
          
          // Setup new subscriptions
          const progressSub = subscribeToProgress(user.id, (payload) => {
            console.log('Progress update:', payload)
            get().loadUserProgress()
          })
          
          const profileSub = subscribeToProfile(user.id, (payload) => {
            console.log('Profile update:', payload)
            // Auth store will handle profile updates
          })
          
          set({ subscriptions: [progressSub, profileSub] })
        },

        cleanupSubscriptions: () => {
          const { subscriptions } = get()
          subscriptions.forEach(sub => sub.unsubscribe())
          set({ subscriptions: [] })
        },

        clearError: () => set({ error: null })
      })
    ),
    { name: 'GameStore' }
  )
)

// Auto-cleanup subscriptions when auth changes
useAuthStore.subscribe(
  (state) => state.isAuthenticated,
  (isAuthenticated) => {
    const { setupSubscriptions, cleanupSubscriptions } = useGameStore.getState()
    
    if (isAuthenticated) {
      setupSubscriptions()
    } else {
      cleanupSubscriptions()
    }
  }
)
