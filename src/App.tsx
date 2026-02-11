import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@/stores/authStore'
import { useGameStore } from '@/stores/gameStore'

// Components
import AuthLayout from '@/components/layouts/AuthLayout'
import GameLayout from '@/components/layouts/GameLayout'
import LoadingScreen from '@/components/ui/LoadingScreen'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

// Pages
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import MissionPage from '@/pages/missions/MissionPage'
import ProgressPage from '@/pages/progress/ProgressPage'
import LeaderboardPage from '@/pages/leaderboard/LeaderboardPage'
import ProfilePage from '@/pages/profile/ProfilePage'

function App() {
  const { initialize: initAuth, loading: authLoading, isAuthenticated } = useAuthStore()
  const { initialize: initGame } = useGameStore()

  useEffect(() => {
    // Initialize authentication on app start
    initAuth()
  }, [initAuth])

  useEffect(() => {
    // Initialize game state when user is authenticated
    if (isAuthenticated) {
      initGame()
    }
  }, [isAuthenticated, initGame])

  // Show loading screen during initial auth check
  if (authLoading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      <div className="min-h-screen bg-fortress-gradient">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            } 
          />
          <Route 
            path="/register" 
            element={
              <AuthLayout>
                <RegisterPage />
              </AuthLayout>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <GameLayout>
                  <DashboardPage />
                </GameLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <GameLayout>
                  <DashboardPage />
                </GameLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mission/:missionId" 
            element={
              <ProtectedRoute>
                <GameLayout>
                  <MissionPage />
                </GameLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/progress" 
            element={
              <ProtectedRoute>
                <GameLayout>
                  <ProgressPage />
                </GameLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leaderboard" 
            element={
              <ProtectedRoute>
                <GameLayout>
                  <LeaderboardPage />
                </GameLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <GameLayout>
                  <ProfilePage />
                </GameLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>

        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#f3f4f6',
              border: '1px solid #374151',
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#1f2937',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#1f2937',
              },
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
