import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useGameStore } from '@/stores/gameStore';

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const { 
    currentLevel, 
    totalXP, 
    completedMissions 
  } = useGameStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.username || 'Learner'}!
          </h1>
          <p className="text-emerald-200">
            Ready to continue your learning journey?
          </p>
        </div>
        
        <button
          onClick={handleLogout}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-4 py-2 rounded-lg transition-all"
        >
          Sign Out
        </button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-200 text-sm font-medium">Level</p>
              <p className="text-3xl font-bold text-white">{currentLevel}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm font-medium">Total XP</p>
              <p className="text-3xl font-bold text-white">{totalXP.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-200 text-sm font-medium">Streak</p>
              <p className="text-3xl font-bold text-white">7 days</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm font-medium">Missions</p>
              <p className="text-3xl font-bold text-white">{completedMissions.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.button
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Start Learning</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-emerald-100">Continue your current mission</p>
          </motion.button>

          <motion.button
            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Practice Mode</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-blue-100">Review and strengthen skills</p>
          </motion.button>

          <motion.button
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Leaderboard</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-purple-100">See how you rank globally</p>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
