import { useState, useEffect } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { useAuthStore } from '@/stores/authStore'
import toast from 'react-hot-toast'

interface Question {
  id: number
  text: string
  correctAnswer: string
  explanation: string
  hints: string[]
}

interface LessonData {
  id: string
  name: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  totalQuestions: number
  questions: Question[]
}

const LessonsPage = () => {
  const { user } = useAuthStore()
  const { submitAnswer, markMissionComplete } = useGameStore()

  const [currentStep, setCurrentStep] = useState<'intro' | 'concept' | 'question' | 'feedback' | 'complete'>('intro')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answer, setAnswer] = useState('')
  const [justification, setJustification] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [hintLevel, setHintLevel] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)

  // Sample lesson data
  const lesson: LessonData = {
    id: 'linear-equations-101',
    name: 'Linear Equations',
    description: 'Learn how to solve linear equations and apply them to real-world problems.',
    difficulty: 'intermediate',
    estimatedTime: 15,
    totalQuestions: 5,
    questions: [
      {
        id: 1,
        text: 'Solve for x: 2x + 3 = 7',
        correctAnswer: '2',
        explanation: 'Starting with: 2x + 3 = 7\nSubtract 3 from both sides: 2x = 4\nDivide both sides by 2: x = 2',
        hints: [
          'Think about what you need to do to isolate x on one side of the equation.',
          'Try subtracting 3 from both sides first.',
          'Then divide both sides by 2.'
        ]
      },
      {
        id: 2,
        text: 'Solve for x: 5x - 10 = 15',
        correctAnswer: '5',
        explanation: 'Starting with: 5x - 10 = 15\nAdd 10 to both sides: 5x = 25\nDivide both sides by 5: x = 5',
        hints: [
          'What operation is the opposite of subtraction?',
          'Add 10 to both sides.',
          'Then divide by 5.'
        ]
      },
      {
        id: 3,
        text: 'Solve for x: 3x + 2 = 2x + 5',
        correctAnswer: '3',
        explanation: 'Starting with: 3x + 2 = 2x + 5\nSubtract 2x from both sides: x + 2 = 5\nSubtract 2 from both sides: x = 3',
        hints: [
          'Get all x terms on one side.',
          'Subtract 2x from both sides.',
          'Then subtract 2 from both sides.'
        ]
      },
      {
        id: 4,
        text: 'Solve for x: (x + 4)/2 = 6',
        correctAnswer: '8',
        explanation: 'Starting with: (x + 4)/2 = 6\nMultiply both sides by 2: x + 4 = 12\nSubtract 4 from both sides: x = 8',
        hints: [
          'What is the opposite of division?',
          'Multiply both sides by 2.',
          'Then subtract 4.'
        ]
      },
      {
        id: 5,
        text: 'Solve for x: 2(x - 3) = 10',
        correctAnswer: '8',
        explanation: 'Starting with: 2(x - 3) = 10\nDivide both sides by 2: x - 3 = 5\nAdd 3 to both sides: x = 8',
        hints: [
          'Start by dividing both sides by 2.',
          'Then add 3 to both sides.',
          'Remember to distribute the 2 first if needed.'
        ]
      }
    ]
  }

  // Timer
  useEffect(() => {
    if (!isPaused && currentStep !== 'intro' && currentStep !== 'complete') {
      const timer = setInterval(() => {
        setTimeSpent(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isPaused, currentStep])

  const handleStartLesson = () => {
    setCurrentStep('concept')
  }

  const handleNextStep = () => {
    if (currentStep === 'concept') {
      setCurrentStep('question')
    }
  }

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || !justification.trim()) {
      toast.error('Please provide both an answer and explanation')
      return
    }

    try {
      setLoading(true)
      const question = lesson.questions[currentQuestion]
      const isCorrect = answer.toLowerCase() === question.correctAnswer.toLowerCase()

      setQuestionsAnswered(prev => prev + 1)
      if (isCorrect) {
        setCorrectAnswers(prev => prev + 1)
      }

      setCurrentStep('feedback')
    } catch (error) {
      toast.error('Failed to submit answer')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < lesson.totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1)
      setAnswer('')
      setJustification('')
      setShowHint(false)
      setHintLevel(0)
      setCurrentStep('question')
    } else {
      completeLesson()
    }
  }

  const completeLesson = () => {
    const accuracy = Math.round((correctAnswers / questionsAnswered) * 100)
    const xpEarned = Math.round(150 * (accuracy / 100))
    setCurrentStep('complete')
  }

  const handleShowHint = () => {
    if (hintLevel < lesson.questions[currentQuestion].hints.length) {
      setShowHint(true)
      setHintLevel(prev => prev + 1)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const progressPercentage = (currentQuestion / lesson.totalQuestions) * 100
  const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0
  const xpEarned = Math.round(150 * (accuracy / 100))

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {currentStep !== 'intro' && (
          <div className="mb-6 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400">Advanced Mathematics / Linear Equations</p>
                <h1 className="text-2xl font-bold text-white">{lesson.name}</h1>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Exit
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Lesson Progress</span>
                <span className="text-cyan-400 font-semibold">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Introduction */}
        {currentStep === 'intro' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">{lesson.name}</h2>
            <p className="text-gray-300 mb-6">{lesson.description}</p>

            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-white">Learning Objectives</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span> Understand what a linear equation is
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span> Learn how to solve linear equations
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span> Apply linear equations to real-world problems
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span> Verify solutions
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-gray-400">Difficulty</p>
                <p className="text-lg font-semibold text-cyan-400 capitalize">{lesson.difficulty}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-gray-400">Estimated Time</p>
                <p className="text-lg font-semibold text-cyan-400">{lesson.estimatedTime} min</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-gray-400">Questions</p>
                <p className="text-lg font-semibold text-cyan-400">{lesson.totalQuestions}</p>
              </div>
            </div>

            <button
              onClick={handleStartLesson}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
            >
              Start Lesson
            </button>
          </div>
        )}

        {/* Concept Explanation */}
        {currentStep === 'concept' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Understanding Linear Equations</h3>

            <div className="space-y-6">
              <div>
                <p className="text-gray-300 mb-4">A linear equation is an equation that can be written in the form:</p>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-cyan-400 text-center mb-4">
                  ax + b = c
                </div>
                <p className="text-gray-300">Where:</p>
                <ul className="mt-2 space-y-2 text-gray-300">
                  <li><strong>a</strong> is the coefficient (cannot be 0)</li>
                  <li><strong>x</strong> is the variable we're solving for</li>
                  <li><strong>b</strong> and <strong>c</strong> are constants</li>
                </ul>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h4 className="text-green-400 font-semibold mb-2">Example:</h4>
                <p className="text-gray-300 font-mono">2x + 3 = 7</p>
                <p className="text-gray-400 text-sm mt-2">Here, a=2, b=3, c=7</p>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setCurrentStep('intro')}
                className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Previous
              </button>
              <button
                onClick={handleNextStep}
                className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Question */}
        {currentStep === 'question' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-6">Question {currentQuestion + 1} of {lesson.totalQuestions}</h3>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-6">
              <p className="text-white text-lg font-semibold">{lesson.questions[currentQuestion].text}</p>
            </div>

            {showHint && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <p className="text-yellow-400 font-semibold mb-2">💡 Hint</p>
                <p className="text-gray-300">{lesson.questions[currentQuestion].hints[hintLevel - 1]}</p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Answer</label>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Explain Your Reasoning</label>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Why did you choose this answer?"
                  rows={4}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleShowHint}
                disabled={hintLevel >= lesson.questions[currentQuestion].hints.length}
                className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                💡 Show Hint
              </button>
              <button
                onClick={handleSubmitAnswer}
                disabled={loading}
                className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Answer'}
              </button>
            </div>
          </div>
        )}

        {/* Feedback */}
        {currentStep === 'feedback' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">
              {answer.toLowerCase() === lesson.questions[currentQuestion].correctAnswer.toLowerCase() ? '✅ Correct!' : '❌ Not Quite Right'}
            </h3>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
              <h4 className="text-white font-semibold mb-2">Explanation</h4>
              <p className="text-gray-300 whitespace-pre-line">{lesson.questions[currentQuestion].explanation}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setCurrentStep('concept')
                  setAnswer('')
                  setJustification('')
                  setShowHint(false)
                  setHintLevel(0)
                }}
                className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Review Concept
              </button>
              <button
                onClick={handleNextQuestion}
                className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
              >
                {currentQuestion < lesson.totalQuestions - 1 ? 'Next Question' : 'Complete Lesson'}
              </button>
            </div>
          </div>
        )}

        {/* Completion */}
        {currentStep === 'complete' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">🎉 Lesson Complete!</h2>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                <p className="text-sm text-gray-400">Questions Answered</p>
                <p className="text-2xl font-bold text-cyan-400">{questionsAnswered}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                <p className="text-sm text-gray-400">Accuracy</p>
                <p className="text-2xl font-bold text-cyan-400">{accuracy}%</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                <p className="text-sm text-gray-400">XP Earned</p>
                <p className="text-2xl font-bold text-cyan-400">+{xpEarned}</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-8">
              <p className="text-sm text-gray-400 mb-2">Mastery Level</p>
              <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  style={{ width: `${accuracy}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-300 mt-2">
                {accuracy >= 90 ? 'Fluent' : accuracy >= 75 ? 'Proficient' : accuracy >= 50 ? 'Familiar' : 'Started'} ({accuracy}%)
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => window.history.back()}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-semibold"
              >
                Back to Paths
              </button>
              <button
                onClick={() => {
                  setCurrentStep('intro')
                  setCurrentQuestion(0)
                  setAnswer('')
                  setJustification('')
                  setQuestionsAnswered(0)
                  setCorrectAnswers(0)
                  setShowHint(false)
                  setHintLevel(0)
                }}
                className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors font-semibold"
              >
                Next Lesson
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LessonsPage
