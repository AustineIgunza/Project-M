import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useGameStore } from '@/stores/gameStore'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const { user, updateUserProfile, loading: authLoading } = useAuthStore()
  const { totalXP, currentLevel, xpToNextLevel, completedMissions } = useGameStore()
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || '',
    university: user?.university || '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        university: user.university || '',
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      await updateUserProfile({
        username: formData.username,
        university: formData.university,
      })
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Please log in to view your profile</p>
        </div>
      </div>
    )
  }

  const progressPercentage = (totalXP % (currentLevel * 300)) / (currentLevel * 300) * 100

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-400">Manage your account and view your learning progress</p>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Profile Info */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{user.username || 'User'}</h2>
                <p className="text-gray-400">{user.email}</p>
                {user.university && (
                  <p className="text-sm text-gray-400 mt-1">📚 {user.university}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Member since {new Date(user.updated_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditing && (
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    placeholder="Enter your username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">University</label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    placeholder="Enter your university"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
            <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total XP</p>
                <p className="text-2xl font-bold text-cyan-400">{totalXP.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Current Level</p>
                <p className="text-2xl font-bold text-cyan-400">{currentLevel}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Missions Completed</p>
                <p className="text-2xl font-bold text-cyan-400">{completedMissions.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Current Streak</p>
                <p className="text-2xl font-bold text-cyan-400">{user.streak_count} days 🔥</p>
              </div>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Level Progress</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Level {currentLevel}</span>
              <span className="text-cyan-400 font-semibold">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>{totalXP.toLocaleString()} XP</span>
              <span>{xpToNextLevel.toLocaleString()} XP to next level</span>
            </div>
          </div>
        </div>

        {/* Learning Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <p className="text-sm text-gray-400 mb-2">Missions Completed</p>
            <p className="text-3xl font-bold text-cyan-400">{completedMissions.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <p className="text-sm text-gray-400 mb-2">Current Streak</p>
            <p className="text-3xl font-bold text-cyan-400">{user.streak_count}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <p className="text-sm text-gray-400 mb-2">Total XP</p>
            <p className="text-3xl font-bold text-cyan-400">{(totalXP / 1000).toFixed(1)}k</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <p className="text-sm text-gray-400 mb-2">Current Level</p>
            <p className="text-3xl font-bold text-cyan-400">{currentLevel}</p>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-6">Account Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div>
                <p className="text-white font-medium">Email Address</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
              <span className="text-xs px-3 py-1 bg-green-500/20 text-green-400 rounded-full">Verified</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div>
                <p className="text-white font-medium">Account Role</p>
                <p className="text-sm text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div>
                <p className="text-white font-medium">Last Active</p>
                <p className="text-sm text-gray-400">
                  {new Date(user.last_active_at).toLocaleDateString()} at{' '}
                  {new Date(user.last_active_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
