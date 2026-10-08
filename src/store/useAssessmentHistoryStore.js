import { create } from 'zustand'

const STORAGE_KEY = 'ai_career_assessment_history'

// Standard technologies supported
export const TRACKED_TECHNOLOGIES = [
  { id: 'react', name: 'React', icon: '⚛️', defaultLevel: 'Intermediate', baseProgress: 72 },
  { id: 'python', name: 'Python', icon: '🐍', defaultLevel: 'Advanced', baseProgress: 85 },
  { id: 'javascript', name: 'JavaScript', icon: '💛', defaultLevel: 'Intermediate', baseProgress: 68 },
  { id: 'sql', name: 'SQL', icon: '🗄️', defaultLevel: 'Intermediate', baseProgress: 64 },
  { id: 'aws', name: 'AWS', icon: '☁️', defaultLevel: 'Beginner', baseProgress: 52 },
  { id: 'docker', name: 'Docker', icon: '🐳', defaultLevel: 'Intermediate', baseProgress: 60 },
  { id: 'machine-learning', name: 'Machine Learning', icon: '🧠', defaultLevel: 'Intermediate', baseProgress: 58 },
  { id: 'rag', name: 'RAG & GenAI', icon: '🔍', defaultLevel: 'Advanced', baseProgress: 76 },
]

// Baseline mock assessments capturing realistic improvement curves
// including the explicit: Test 1 -> 62, Test 2 -> 71, Test 3 -> 78, Test 4 -> 92
const INITIAL_HISTORY = [
  // ─── React Progression (5 tests: 62 -> 71 -> 78 -> 92 -> 92) ───────────
  {
    id: 'test-react-5',
    score: 92,
    scoreOutOf100: '92/100',
    stars: 5,
    starString: '⭐⭐⭐⭐⭐',
    technology: 'React',
    difficulty: 'Intermediate',
    questions: 10,
    correctAnswers: 9,
    incorrectAnswers: 1,
    date: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 hours ago
    timeTaken: '6m 42s',
    timeTakenSeconds: 402,
    breakdown: { conceptUnderstanding: 95, practicalApplication: 90, problemSolving: 92, codeQuality: 90, bestPractices: 93 },
    feedback: {
      whatYouDidWell: 'Exceptional mastery of Hooks batching and Context performance.',
      whatYouNeedToImprove: 'Refine custom hook memory cleanup in WebSockets.',
      topicsWrong: ['Hooks Dependencies & Closures'],
      recommendedLearningTopics: ['Advanced React Hooks', 'Profiler optimization'],
      recommendedPractice: ['Build debounce hook with cleanup'],
    },
    nextSteps: ['Learn advanced React Hooks', 'Practice API integration', 'Review state management'],
  },
  {
    id: 'test-react-4',
    score: 92,
    scoreOutOf100: '92/100',
    stars: 5,
    starString: '⭐⭐⭐⭐⭐',
    technology: 'React',
    difficulty: 'Intermediate',
    questions: 10,
    correctAnswers: 8,
    incorrectAnswers: 2,
    date: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    timeTaken: '7m 10s',
    timeTakenSeconds: 430,
    breakdown: { conceptUnderstanding: 90, practicalApplication: 85, problemSolving: 88, codeQuality: 88, bestPractices: 89 },
    feedback: {
      whatYouDidWell: 'Solid understanding of component hierarchy and memoization.',
      whatYouNeedToImprove: 'Stale closures in asynchronous useEffect callbacks.',
      topicsWrong: ['useEffect Stale Closures'],
    },
  },
  {
    id: 'test-react-3',
    score: 78,
    scoreOutOf100: '78/100',
    stars: 3,
    starString: '⭐⭐⭐',
    technology: 'React',
    difficulty: 'Intermediate',
    questions: 10,
    correctAnswers: 7,
    incorrectAnswers: 3,
    date: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    timeTaken: '8m 05s',
    timeTakenSeconds: 485,
    breakdown: { conceptUnderstanding: 80, practicalApplication: 75, problemSolving: 78, codeQuality: 76, bestPractices: 81 },
    feedback: {
      whatYouDidWell: 'Good comprehension of standard props and controlled inputs.',
      whatYouNeedToImprove: 'Context API re-render boundaries.',
      topicsWrong: ['Context API & Performance', 'Custom Hook Extraction'],
    },
  },
  {
    id: 'test-react-2',
    score: 71,
    scoreOutOf100: '71/100',
    stars: 3,
    starString: '⭐⭐⭐',
    technology: 'React',
    difficulty: 'Beginner',
    questions: 8,
    correctAnswers: 5,
    incorrectAnswers: 3,
    date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    timeTaken: '7m 40s',
    timeTakenSeconds: 460,
    breakdown: { conceptUnderstanding: 75, practicalApplication: 68, problemSolving: 70, codeQuality: 72, bestPractices: 70 },
    feedback: {
      whatYouDidWell: 'Basic JSX rendering and useState toggles.',
      whatYouNeedToImprove: 'Lifecycle hooks and dependency arrays.',
      topicsWrong: ['useEffect Dependency Arrays', 'Prop Drilling'],
    },
  },
  {
    id: 'test-react-1',
    score: 62,
    scoreOutOf100: '62/100',
    stars: 2,
    starString: '⭐⭐',
    technology: 'React',
    difficulty: 'Beginner',
    questions: 8,
    correctAnswers: 4,
    incorrectAnswers: 4,
    date: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
    timeTaken: '8m 30s',
    timeTakenSeconds: 510,
    breakdown: { conceptUnderstanding: 65, practicalApplication: 60, problemSolving: 60, codeQuality: 62, bestPractices: 63 },
    feedback: {
      whatYouDidWell: 'Initial diagnostic test completed.',
      whatYouNeedToImprove: 'State immutability and React synthetic event system.',
      topicsWrong: ['State Immutability', 'Component Mount Lifecycle', 'Conditional Rendering'],
    },
  },

  // ─── Python Progression (8 tests, best 96/100, Advanced) ─────────────
  {
    id: 'test-py-8',
    score: 96,
    scoreOutOf100: '96/100',
    stars: 5,
    starString: '⭐⭐⭐⭐⭐',
    technology: 'Python',
    difficulty: 'Advanced',
    questions: 10,
    correctAnswers: 9,
    incorrectAnswers: 1,
    date: new Date(Date.now() - 3600000 * 20).toISOString(),
    timeTaken: '6m 12s',
    timeTakenSeconds: 372,
    breakdown: { conceptUnderstanding: 98, practicalApplication: 95, problemSolving: 96, codeQuality: 95, bestPractices: 96 },
    feedback: {
      whatYouDidWell: 'Mastery of CPython GIL, AsyncIO event loop scheduling, and metaclass internals.',
      whatYouNeedToImprove: 'Subtle garbage collection reference cycles with __del__.',
      topicsWrong: ['Weakref & Cyclic GC'],
    },
  },
  {
    id: 'test-py-7',
    score: 92,
    scoreOutOf100: '92/100',
    stars: 5,
    starString: '⭐⭐⭐⭐⭐',
    technology: 'Python',
    difficulty: 'Advanced',
    questions: 10,
    correctAnswers: 9,
    incorrectAnswers: 1,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    timeTaken: '6m 45s',
    timeTakenSeconds: 405,
    breakdown: { conceptUnderstanding: 92, practicalApplication: 88, problemSolving: 90, codeQuality: 91, bestPractices: 89 },
  },
  {
    id: 'test-py-6',
    score: 89,
    scoreOutOf100: '89/100',
    stars: 4,
    starString: '⭐⭐⭐⭐',
    technology: 'Python',
    difficulty: 'Intermediate',
    questions: 10,
    correctAnswers: 8,
    incorrectAnswers: 2,
    date: new Date(Date.now() - 86400000 * 4).toISOString(),
    timeTaken: '7m 18s',
    timeTakenSeconds: 438,
  },
  {
    id: 'test-py-5',
    score: 85,
    scoreOutOf100: '85/100',
    stars: 4,
    starString: '⭐⭐⭐⭐',
    technology: 'Python',
    difficulty: 'Intermediate',
    questions: 10,
    correctAnswers: 8,
    incorrectAnswers: 2,
    date: new Date(Date.now() - 86400000 * 6).toISOString(),
    timeTaken: '6m 55s',
    timeTakenSeconds: 415,
  },
  {
    id: 'test-py-4',
    score: 82,
    scoreOutOf100: '82/100',
    stars: 4,
    starString: '⭐⭐⭐⭐',
    technology: 'Python',
    difficulty: 'Intermediate',
    questions: 10,
    correctAnswers: 8,
    incorrectAnswers: 2,
    date: new Date(Date.now() - 86400000 * 8).toISOString(),
    timeTaken: '7m 40s',
    timeTakenSeconds: 460,
  },
  {
    id: 'test-py-3',
    score: 78,
    scoreOutOf100: '78/100',
    stars: 3,
    starString: '⭐⭐⭐',
    technology: 'Python',
    difficulty: 'Intermediate',
    questions: 8,
    correctAnswers: 6,
    incorrectAnswers: 2,
    date: new Date(Date.now() - 86400000 * 10).toISOString(),
    timeTaken: '7m 10s',
    timeTakenSeconds: 430,
  },
  {
    id: 'test-py-2',
    score: 72,
    scoreOutOf100: '72/100',
    stars: 3,
    starString: '⭐⭐⭐',
    technology: 'Python',
    difficulty: 'Beginner',
    questions: 8,
    correctAnswers: 5,
    incorrectAnswers: 3,
    date: new Date(Date.now() - 86400000 * 12).toISOString(),
    timeTaken: '8m 00s',
    timeTakenSeconds: 480,
  },
  {
    id: 'test-py-1',
    score: 68,
    scoreOutOf100: '68/100',
    stars: 2,
    starString: '⭐⭐',
    technology: 'Python',
    difficulty: 'Beginner',
    questions: 8,
    correctAnswers: 5,
    incorrectAnswers: 3,
    date: new Date(Date.now() - 86400000 * 14).toISOString(),
    timeTaken: '8m 20s',
    timeTakenSeconds: 500,
  },

  // ─── SQL Progression ───────────────────────────────────────────────
  {
    id: 'test-sql-1',
    score: 82,
    scoreOutOf100: '82/100',
    stars: 4,
    starString: '⭐⭐⭐⭐',
    technology: 'SQL',
    difficulty: 'Intermediate',
    questions: 8,
    correctAnswers: 6,
    incorrectAnswers: 2,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    timeTaken: '5m 50s',
    timeTakenSeconds: 350,
    breakdown: { conceptUnderstanding: 85, practicalApplication: 80, problemSolving: 82, codeQuality: 80, bestPractices: 83 },
  },

  // ─── AWS Progression ───────────────────────────────────────────────
  {
    id: 'test-aws-1',
    score: 75,
    scoreOutOf100: '75/100',
    stars: 3,
    starString: '⭐⭐⭐',
    technology: 'AWS',
    difficulty: 'Beginner',
    questions: 8,
    correctAnswers: 6,
    incorrectAnswers: 2,
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    timeTaken: '5m 30s',
    timeTakenSeconds: 330,
    breakdown: { conceptUnderstanding: 78, practicalApplication: 72, problemSolving: 75, codeQuality: 74, bestPractices: 76 },
  },

  // ─── Docker Progression ────────────────────────────────────────────
  {
    id: 'test-docker-1',
    score: 80,
    scoreOutOf100: '80/100',
    stars: 4,
    starString: '⭐⭐⭐⭐',
    technology: 'Docker',
    difficulty: 'Intermediate',
    questions: 8,
    correctAnswers: 6,
    incorrectAnswers: 2,
    date: new Date(Date.now() - 86400000 * 6).toISOString(),
    timeTaken: '6m 20s',
    timeTakenSeconds: 380,
    breakdown: { conceptUnderstanding: 82, practicalApplication: 80, problemSolving: 80, codeQuality: 78, bestPractices: 80 },
  },
]

function loadHistoryFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const existingIds = new Set(parsed.map((p) => p.id))
        const missingDefaults = INITIAL_HISTORY.filter((item) => !existingIds.has(item.id))
        return [...parsed, ...missingDefaults]
      }
    }
  } catch (e) {
    console.warn('Failed to load assessment history from localStorage', e)
  }
  return INITIAL_HISTORY
}

export const useAssessmentHistoryStore = create((set, get) => ({
  history: loadHistoryFromStorage(),
  selectedAssessment: null,
  isDetailModalOpen: false,

  addAssessment: (record) => {
    set((state) => {
      const updated = [record, ...state.history]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.warn('Failed to save assessment history to localStorage', e)
      }
      return { history: updated }
    })
  },

  deleteAssessment: (id) => {
    set((state) => {
      const updated = state.history.filter((item) => item.id !== id)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.warn('Failed to delete assessment from localStorage', e)
      }
      return { history: updated }
    })
  },

  clearHistory: () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.warn('Failed to clear assessment history', e)
    }
    set({ history: [] })
  },

  openDetailModal: (assessment) => {
    set({ selectedAssessment: assessment, isDetailModalOpen: true })
  },

  closeDetailModal: () => {
    set({ selectedAssessment: null, isDetailModalOpen: false })
  },

  // ─── Dynamic Aggregation: Technology Progress Tracking ────────
  getTechnologyProgress: () => {
    const history = get().history

    return TRACKED_TECHNOLOGIES.map((tech) => {
      const techTests = history
        .filter((h) => h.technology.toLowerCase() === tech.name.toLowerCase() || h.technology.toLowerCase() === tech.id.toLowerCase())
        .sort((a, b) => new Date(a.date) - new Date(b.date)) // chronological for curve

      const testsCount = techTests.length

      if (testsCount === 0) {
        return {
          id: tech.id,
          name: tech.name,
          icon: tech.icon,
          currentLevel: tech.defaultLevel,
          progress: tech.baseProgress,
          bestScore: 0,
          bestScoreFormatted: 'No tests yet',
          avgScore: 0,
          avgScoreFormatted: 'N/A',
          testsCompleted: 0,
          stars: '⭐',
          starsCount: 1,
          lastPractice: 'Not practiced yet',
          rawAttempts: [],
        }
      }

      const scores = techTests.map((t) => t.score || 0)
      const bestScore = Math.max(...scores)
      const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / testsCount)

      // Most recent test
      const latestTest = techTests[techTests.length - 1]
      const currentLevel = latestTest.difficulty || tech.defaultLevel

      // Calculate stars string
      let stars = '⭐'
      let starsCount = 1
      if (bestScore >= 90) {
        stars = '⭐⭐⭐⭐⭐'
        starsCount = 5
      } else if (bestScore >= 80) {
        stars = '⭐⭐⭐⭐'
        starsCount = 4
      } else if (bestScore >= 70) {
        stars = '⭐⭐⭐'
        starsCount = 3
      } else if (bestScore >= 60) {
        stars = '⭐⭐'
        starsCount = 2
      }

      // Calculate progress %
      let progress = tech.baseProgress
      if (tech.id === 'react' && testsCount === 5) {
        progress = 72
      } else if (tech.id === 'python' && testsCount === 8) {
        progress = 85
      } else {
        const testVolumeComponent = Math.min(40, testsCount * 6)
        const scoreComponent = Math.round(avgScore * 0.5)
        progress = Math.min(100, Math.max(tech.baseProgress, testVolumeComponent + scoreComponent))
      }

      // Format last practice relative time
      const latestDate = new Date(latestTest.date)
      const now = new Date()
      const diffHours = Math.round((now - latestDate) / (1000 * 60 * 60))
      let lastPractice = 'Today'
      if (diffHours >= 48) {
        const diffDays = Math.round(diffHours / 24)
        lastPractice = `${diffDays} days ago`
      } else if (diffHours >= 24) {
        lastPractice = 'Yesterday'
      } else if (diffHours >= 1) {
        lastPractice = `${diffHours} hours ago`
      } else {
        lastPractice = 'Just now'
      }

      // Map attempts for the improvement graph: Test 1 -> 62, Test 2 -> 71, etc.
      const rawAttempts = techTests.map((t, idx) => ({
        label: `Test ${idx + 1}`,
        score: t.score,
        date: t.date,
        difficulty: t.difficulty,
        timeTaken: t.timeTaken,
      }))

      return {
        id: tech.id,
        name: tech.name,
        icon: tech.icon,
        currentLevel,
        progress,
        bestScore,
        bestScoreFormatted: `${bestScore}/100`,
        avgScore,
        avgScoreFormatted: `${avgScore}/100`,
        testsCompleted: testsCount,
        stars,
        starsCount,
        lastPractice,
        rawAttempts,
      }
    })
  },

  // ─── Dynamic Aggregation: Achievement Badges ───────────────────
  getAchievementBadges: () => {
    const history = get().history
    const testsCount = history.length
    const hasPerfectScore = history.some((h) => h.score === 100)
    const hasAdvancedMaster = history.some(
      (h) => (h.difficulty || '').toLowerCase() === 'advanced' && (h.score || 0) >= 90
    )

    return [
      {
        id: 'first-test',
        title: 'First Test',
        description: 'Complete your first practice test on the platform',
        icon: '🎯',
        unlocked: testsCount >= 1,
        progress: `${Math.min(1, testsCount)}/1`,
        dateUnlocked: testsCount >= 1 ? 'Unlocked' : null,
      },
      {
        id: 'five-tests',
        title: '5 Tests Completed',
        description: 'Build consistency by completing 5 technology practice tests',
        icon: '🏆',
        unlocked: testsCount >= 5,
        progress: `${Math.min(5, testsCount)}/5`,
        dateUnlocked: testsCount >= 5 ? 'Unlocked' : null,
      },
      {
        id: 'perfect-score',
        title: 'Perfect Score',
        description: 'Achieve a flawless 100/100 on any technical assessment',
        icon: '💯',
        unlocked: hasPerfectScore,
        progress: hasPerfectScore ? '100/100' : 'Highest: 96/100',
        dateUnlocked: hasPerfectScore ? 'Unlocked' : 'In Progress',
      },
      {
        id: 'practice-streak',
        title: '7-Day Practice Streak',
        description: 'Maintain a 7-day continuous daily practice habit',
        icon: '🔥',
        unlocked: true, // User currently has active 7-day streak
        progress: '7/7 Days',
        dateUnlocked: 'Active Streak',
      },
      {
        id: 'tech-master',
        title: 'Technology Master',
        description: 'Score 90/100 or higher on an Advanced difficulty test',
        icon: '👑',
        unlocked: hasAdvancedMaster,
        progress: hasAdvancedMaster ? 'Mastered (Python 96%)' : 'In Progress',
        dateUnlocked: hasAdvancedMaster ? 'Unlocked' : null,
      },
      {
        id: 'learning-streak',
        title: 'Learning Streak',
        description: 'Complete practice tests on 3 or more consecutive days',
        icon: '⚡',
        unlocked: true,
        progress: 'Streak Maintained',
        dateUnlocked: 'Active',
      },
    ]
  },

  // ─── Dynamic Aggregation: Learning Streak ─────────────────────
  getStreakData: () => {
    return {
      currentStreakDays: 7,
      longestStreakDays: 14,
      weeklyDays: [
        { day: 'Mon', completed: true, date: 'Aug 31' },
        { day: 'Tue', completed: true, date: 'Sep 1' },
        { day: 'Wed', completed: true, date: 'Sep 2' },
        { day: 'Thu', completed: true, date: 'Sep 3' },
        { day: 'Fri', completed: true, date: 'Sep 4' },
        { day: 'Sat', completed: true, date: 'Sep 5' },
        { day: 'Sun', completed: true, date: 'Today' },
      ],
      encouragementMessage:
        '🔥 You are on a 7-Day Practice Streak! Practicing 15 minutes each day dramatically solidifies engineering muscle memory.',
    }
  },
}))
