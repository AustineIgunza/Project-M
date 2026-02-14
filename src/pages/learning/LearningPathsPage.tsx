import { useState, useMemo } from 'react'
import { useGameStore } from '@/stores/gameStore'
import toast from 'react-hot-toast'

interface LearningPath {
  id: string
  name: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  duration: number
  concepts: number
  enrolled: number
  rating: number
  progress?: number
  status: 'available' | 'enrolled' | 'completed'
}

const LearningPathsPage = () => {
  const { missions, selectMission } = useGameStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDuration, setSelectedDuration] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  // Sample learning paths data
  const learningPaths: LearningPath[] = [
    {
      id: 'advanced-math',
      name: 'Advanced Mathematics',
      description: 'Master complex mathematical concepts including calculus, linear algebra, and differential equations.',
      difficulty: 'advanced',
      category: 'mathematics',
      duration: 45,
      concepts: 12,
      enrolled: 2345,
      rating: 4.8,
      progress: 75,
      status: 'enrolled'
    },
    {
      id: 'physics-101',
      name: 'Physics Fundamentals',
      description: 'Explore the laws of motion, energy, and forces through interactive simulations and experiments.',
      difficulty: 'intermediate',
      category: 'physics',
      duration: 35,
      concepts: 11,
      enrolled: 1876,
      rating: 4.7,
      progress: 45,
      status: 'enrolled'
    },
    {
      id: 'programming-101',
      name: 'Programming Fundamentals',
      description: 'Learn the foundations of programming with hands-on projects and real-world applications.',
      difficulty: 'beginner',
      category: 'programming',
      duration: 30,
      concepts: 10,
      enrolled: 3456,
      rating: 4.9,
      progress: 0,
      status: 'available'
    },
    {
      id: 'accounting-basics',
      name: 'Accounting Basics',
      description: 'Master fundamental accounting principles and practices for business management.',
      difficulty: 'beginner',
      category: 'accounting',
      duration: 25,
      concepts: 9,
      enrolled: 1234,
      rating: 4.6,
      progress: 0,
      status: 'available'
    },
    {
      id: 'chemistry-essentials',
      name: 'Chemistry Essentials',
      description: 'Explore chemical reactions, atomic structure, and molecular bonding through interactive labs.',
      difficulty: 'intermediate',
      category: 'chemistry',
      duration: 40,
      concepts: 13,
      enrolled: 1567,
      rating: 4.7,
      progress: 0,
      status: 'available'
    },
    {
      id: 'data-science-101',
      name: 'Data Science Fundamentals',
      description: 'Learn data analysis, visualization, and machine learning basics for real-world applications.',
      difficulty: 'intermediate',
      category: 'programming',
      duration: 50,
      concepts: 14,
      enrolled: 2789,
      rating: 4.8,
      progress: 0,
      status: 'available'
    }
  ]

  // Filter paths
  const filteredPaths = useMemo(() => {
    return learningPaths.filter(path => {
      const matchesSearch = path.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           path.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDifficulty = !selectedDifficulty || path.difficulty === selectedDifficulty
      const matchesCategory = !selectedCategory || path.category === selectedCategory
      const matchesStatus = !selectedStatus || path.status === selectedStatus
      
      let matchesDuration = true
      if (selectedDuration === 'short') matchesDuration = path.duration < 5
      else if (selectedDuration === 'medium') matchesDuration = path.duration >= 5 && path.duration <= 20
      else if (selectedDuration === 'long') matchesDuration = path.duration > 20

      return matchesSearch && matchesDifficulty && matchesCategory && matchesDuration && matchesStatus
    })
  }, [searchTerm, selectedDifficulty, selectedCategory, selectedDuration, selectedStatus])

  const handleEnroll = (pathId: string) => {
    toast.success('Successfully enrolled in path!')
  }

  const handleContinue = (pathId: string) => {
    toast.success('Continuing path...')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Learning Paths</h1>
          <p className="text-gray-400">Discover structured learning journeys designed to master new skills</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div>
              <input
                type="text"
                placeholder="Search learning paths..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="">All Categories</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="programming">Programming</option>
                  <option value="accounting">Accounting</option>
                  <option value="chemistry">Chemistry</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="">Any Duration</option>
                  <option value="short">Under 5 hours</option>
                  <option value="medium">5-20 hours</option>
                  <option value="long">20+ hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="">All Paths</option>
                  <option value="enrolled">My Paths</option>
                  <option value="completed">Completed</option>
                  <option value="available">Available</option>
                </select>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedDifficulty('')
                setSelectedCategory('')
                setSelectedDuration('')
                setSelectedStatus('')
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Paths Grid */}
        {filteredPaths.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPaths.map(path => (
              <div
                key={path.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
              >
                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-white flex-1">{path.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(path.difficulty)}`}>
                      {path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{path.category}</p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-300 mb-4 line-clamp-2">{path.description}</p>

                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="text-sm font-semibold text-white">{path.duration}h</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Concepts</p>
                    <p className="text-sm font-semibold text-white">{path.concepts}</p>
                  </div>
                </div>

                {/* Progress Bar (if enrolled) */}
                {path.status === 'enrolled' && path.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400">Progress</span>
                      <span className="text-xs font-semibold text-cyan-400">{path.progress}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        style={{ width: `${path.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(path.rating) ? 'text-yellow-400' : 'text-gray-600'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">{path.rating} ({path.enrolled.toLocaleString()} enrolled)</span>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => path.status === 'enrolled' ? handleContinue(path.id) : handleEnroll(path.id)}
                  className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                    path.status === 'enrolled'
                      ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30'
                      : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                  }`}
                >
                  {path.status === 'enrolled' ? 'Continue' : path.status === 'completed' ? 'Review' : 'Start Path'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No learning paths found matching your criteria</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedDifficulty('')
                setSelectedCategory('')
                setSelectedDuration('')
                setSelectedStatus('')
              }}
              className="mt-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default LearningPathsPage
