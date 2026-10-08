import { create } from 'zustand'
import toast from 'react-hot-toast'
import { useLearningPlannerStore } from './useLearningPlannerStore'
import { usePracticeStore } from './usePracticeStore'

// Default 30-Day React blueprint
const DEFAULT_WEEKS_BY_TECH = {
  react: [
    {
      weekNumber: 1,
      title: 'React fundamentals',
      description: 'JSX syntax, component tree, props vs state, and unidirectional data flow',
      topics: ['JSX & Virtual DOM', 'Props & Component Decomposition', 'State Basics & Synthetic Events'],
    },
    {
      weekNumber: 2,
      title: 'Hooks + State',
      description: 'useState, useEffect, custom hooks, and state lifecycle management',
      topics: ['useEffect & Cleanup', 'Custom Hooks Extraction', 'Context API & State Batches'],
    },
    {
      weekNumber: 3,
      title: 'API + Projects',
      description: 'Asynchronous data fetching, TanStack Query, and portfolio milestone development',
      topics: ['Abortable Fetch & Error Boundaries', 'Optimistic UI Updates', 'Real-world Portfolio Feature'],
    },
    {
      weekNumber: 4,
      title: 'Advanced concepts + Practice tests',
      description: 'Performance optimization, Server Components (RSC), and timed mock assessments',
      topics: ['React Profiler & Memoization', 'Server Components Architecture', 'Comprehensive Mock Tests'],
    },
  ],
  python: [
    {
      weekNumber: 1,
      title: 'Python fundamentals',
      description: 'Language syntax, control flow, functions, and standard data structures',
      topics: ['Lists, Dicts & Sets Mutability', 'Functions & Scope', 'Virtual Environments'],
    },
    {
      weekNumber: 2,
      title: 'OOP + Error Handling',
      description: 'Class hierarchies, dunder methods, and robust exception handling',
      topics: ['Dunder Methods & Properties', 'Custom Exception Hierarchies', 'Context Managers'],
    },
    {
      weekNumber: 3,
      title: 'Concurrency + APIs',
      description: 'AsyncIO, generators, FastAPIs, and relational database interaction',
      topics: ['Generators & Itertools', 'AsyncIO Event Loops', 'REST API Architecture'],
    },
    {
      weekNumber: 4,
      title: 'Internals + Practice tests',
      description: 'CPython GIL, memory profiling, and timed mock tests',
      topics: ['GIL & Multiprocessing Tradeoffs', 'Memory Allocation & Profiling', 'Advanced Mock Tests'],
    },
  ],
}

// Generate the standard 7-day rhythmic weekly schedule (Mon-Sun)
function generateWeeklySchedule(techName, level, dailyHours = 1.0) {
  const durationMin = Math.round(dailyHours * 60)
  const learnMin = Math.max(30, Math.round(durationMin * 0.8))
  const practiceMin = Math.max(20, Math.min(30, Math.round(durationMin * 0.5)))

  return [
    {
      day: 'Monday',
      type: 'Learn',
      title: 'Core Concept Deep Dive',
      duration: `${learnMin}m`,
      task: `Master foundational architecture and syntax for ${techName}`,
      status: 'completed',
      tag: 'Theory',
    },
    {
      day: 'Tuesday',
      type: 'Practice',
      title: 'Targeted Practice Drill',
      duration: `${practiceMin}m`,
      task: `Complete timed practice test on ${techName} (${level})`,
      status: 'ready',
      tag: 'Practice Test',
      practiceTech: techName.toLowerCase(),
      practiceDifficulty: level,
    },
    {
      day: 'Wednesday',
      type: 'Learn',
      title: 'Mechanics & Implementation',
      duration: `${learnMin}m`,
      task: `Component construction and design patterns`,
      status: 'upcoming',
      tag: 'Implementation',
    },
    {
      day: 'Thursday',
      type: 'Practice',
      title: 'Debugging & Code Quizzes',
      duration: `${practiceMin}m`,
      task: `Hands-on bug diagnosis and code output challenges`,
      status: 'upcoming',
      tag: 'Practice Test',
      practiceTech: techName.toLowerCase(),
      practiceDifficulty: level,
    },
    {
      day: 'Friday',
      type: 'Revision',
      title: 'Spaced Repetition Recap',
      duration: `${Math.round(durationMin * 0.6)}m`,
      task: `Review edge cases, missed question logs, and notes`,
      status: 'upcoming',
      tag: 'Review',
    },
    {
      day: 'Saturday',
      type: 'Mock Test',
      title: 'Comprehensive Milestone Test',
      duration: `${practiceMin + 15}m`,
      task: `Full timed milestone assessment (10–15 questions)`,
      status: 'upcoming',
      tag: 'Milestone Mock',
      practiceTech: techName.toLowerCase(),
      practiceDifficulty: level,
    },
    {
      day: 'Sunday',
      type: 'Review',
      title: 'Solution Analysis & Calibration',
      duration: `${Math.round(durationMin * 0.5)}m`,
      task: `Analyze test answers and calibrate next week's schedule`,
      status: 'upcoming',
      tag: 'Calibration',
    },
  ]
}

export const useDeadlinePlannerStore = create((set, get) => ({
  // Goal configuration
  goalPrompt: 'I need to learn React in 30 days.',
  technology: 'React',
  targetRole: 'Full Stack Engineer',
  deadlineDays: 30,
  dailyHours: 1.0,
  currentLevel: 'Intermediate',
  startDate: new Date().toISOString(),
  targetDate: new Date(Date.now() + 30 * 86400000).toISOString(),

  // The 4-Week Milestone Breakdown
  weeks: DEFAULT_WEEKS_BY_TECH.react,

  // The 7-Day Rhythmic Weekly Schedule
  weeklySchedule: generateWeeklySchedule('React', 'Intermediate', 1.0),

  // Proposed Schedule Adaptation (Pending user review & acceptance)
  // Ensures schedule is NEVER changed automatically without explicit user confirmation
  proposedChange: null,
  isProposalModalOpen: false,

  // ─── Actions ────────────────────────────────────────────────

  // Set / Update Goal
  setGoal: ({ technology = 'React', deadlineDays = 30, dailyHours = 1.0, currentLevel = 'Intermediate' }) => {
    const techKey = technology.toLowerCase()
    const weeks = DEFAULT_WEEKS_BY_TECH[techKey] || DEFAULT_WEEKS_BY_TECH.react

    const newSchedule = generateWeeklySchedule(technology, currentLevel, dailyHours)
    const targetDate = new Date(Date.now() + deadlineDays * 86400000).toISOString()

    set({
      goalPrompt: `I need to learn ${technology} in ${deadlineDays} days.`,
      technology,
      deadlineDays,
      dailyHours,
      currentLevel,
      weeks,
      weeklySchedule: newSchedule,
      targetDate,
      proposedChange: null,
      isProposalModalOpen: false,
    })

    // Synchronize with Learning Planner
    try {
      useLearningPlannerStore.getState().updateRoadmapConfig({
        technology,
        durationDays: Number(deadlineDays),
        dailyHours: Number(dailyHours),
        level: currentLevel,
      })
    } catch (e) {
      console.warn('Failed to sync with Learning Planner', e)
    }

    // Synchronize with Practice Store
    try {
      usePracticeStore.getState().setTech(technology.toLowerCase())
      usePracticeStore.getState().setDifficulty(currentLevel)
    } catch (e) {
      console.warn('Failed to sync with Practice Store', e)
    }

    toast.success(`Generated ${deadlineDays}-Day milestone plan for ${technology} (${dailyHours}h/day)!`)
  },

  // Evaluate performance from a finished Practice Test
  // Connects Practice Test -> Deadline & Learning Planner
  evaluateTestPerformance: (testResults) => {
    const { technology, currentLevel, weeklySchedule } = get()
    const score = testResults.score || 0
    const weakTopics = testResults.feedback?.topicsWrong || []

    // 1. STRONG PERFORMANCE (>= 85%):
    // Move them to the next difficulty level
    if (score >= 85) {
      let nextLevel = 'Advanced'
      if (currentLevel.toLowerCase() === 'beginner') nextLevel = 'Intermediate'
      else if (currentLevel.toLowerCase() === 'intermediate') nextLevel = 'Advanced'
      else nextLevel = 'Mastery / Advanced'

      const currentTuesday = weeklySchedule.find((s) => s.day === 'Tuesday')
      const currentSaturday = weeklySchedule.find((s) => s.day === 'Saturday')

      const proposed = {
        id: `proposal-${Date.now()}`,
        type: 'level_up',
        title: 'Level Up Schedule Adaptation',
        reason: `Exceptional mastery demonstrated with ${score}/100! You have outgrown the ${currentLevel} tier.`,
        technology,
        score,
        currentPlanSummary: `Current Level: ${currentLevel} (Standard Practice Tests)`,
        proposedPlanSummary: `Elevate to Level: ${nextLevel} (Higher complexity scenarios & architecture challenges)`,
        beforeSchedule: [
          { day: 'Tuesday', title: currentTuesday?.title || `Practice Drill (${currentLevel})`, task: currentTuesday?.task || `Standard ${currentLevel} questions` },
          { day: 'Saturday', title: currentSaturday?.title || `Mock Test (${currentLevel})`, task: currentSaturday?.task || `${currentLevel} milestone assessment` },
        ],
        afterSchedule: [
          { day: 'Tuesday', title: `Practice Drill (${nextLevel})`, task: `Challenging ${nextLevel} architecture & edge-case drills` },
          { day: 'Saturday', title: `Mock Test (${nextLevel})`, task: `Comprehensive ${nextLevel} timed milestone test` },
        ],
        targetDifficulty: nextLevel,
      }

      set({ proposedChange: proposed, isProposalModalOpen: true })
      toast.success('Congratulations! Level-up schedule adaptation available.', { icon: '🚀' })
      return proposed
    }

    // 2. POOR PERFORMANCE (< 70% or has weak topics):
    // Automatically recommend additional practice for weak topics
    if (score < 70 || weakTopics.length > 0) {
      const primaryWeakTopic = weakTopics[0] || 'Core Mechanics & Edge Cases'
      const secondaryWeakTopic = weakTopics[1] || primaryWeakTopic

      const currentTuesday = weeklySchedule.find((s) => s.day === 'Tuesday')
      const currentThursday = weeklySchedule.find((s) => s.day === 'Thursday')

      const proposed = {
        id: `proposal-${Date.now()}`,
        type: 'weak_topics_reinforcement',
        title: 'Recommended Weak Topics Reinforcement',
        reason: `Your recent assessment score (${score}/100) identified knowledge gaps in: ${weakTopics.join(', ') || 'fundamentals'}.`,
        technology,
        score,
        weakTopics,
        currentPlanSummary: `Tuesday: ${currentTuesday?.title || 'Practice Drill'} • Thursday: ${currentThursday?.title || 'General Quizzes'}`,
        proposedPlanSummary: `Tuesday: Focus Drill on "${primaryWeakTopic}" • Thursday: Deep Debugging Workshop on "${secondaryWeakTopic}"`,
        beforeSchedule: [
          { day: 'Tuesday', title: currentTuesday?.title || 'Standard Practice Test', task: currentTuesday?.task || 'General test' },
          { day: 'Thursday', title: currentThursday?.title || 'General Quizzes', task: currentThursday?.task || 'General questions' },
        ],
        afterSchedule: [
          { day: 'Tuesday', title: `Targeted Drill: ${primaryWeakTopic}`, task: `Focused 15m session dedicated to ${primaryWeakTopic}` },
          { day: 'Thursday', title: `Debugging Clinic: ${secondaryWeakTopic}`, task: `Guided error-handling exercises to eliminate recurrence` },
        ],
        targetDifficulty: currentLevel,
      }

      set({ proposedChange: proposed, isProposalModalOpen: true })
      toast('Schedule adaptation proposed based on your test results', { icon: '💡' })
      return proposed
    }

    return null
  },

  // Accept proposed schedule adaptation (User explicitly confirms)
  acceptProposedChange: () => {
    const { proposedChange, weeklySchedule, technology } = get()
    if (!proposedChange) return

    let updatedSchedule = [...weeklySchedule]

    if (proposedChange.type === 'weak_topics_reinforcement') {
      const topic1 = proposedChange.weakTopics[0] || 'Targeted Review'
      const topic2 = proposedChange.weakTopics[1] || topic1

      updatedSchedule = updatedSchedule.map((item) => {
        if (item.day === 'Tuesday') {
          return {
            ...item,
            title: `Targeted Drill: ${topic1}`,
            task: `Focused reinforcement session on ${topic1}`,
            tag: 'Weak Topic Drill',
          }
        }
        if (item.day === 'Thursday') {
          return {
            ...item,
            title: `Debugging Clinic: ${topic2}`,
            task: `Guided problem-solving on ${topic2}`,
            tag: 'Weak Topic Drill',
          }
        }
        return item
      })

      set({
        weeklySchedule: updatedSchedule,
        proposedChange: null,
        isProposalModalOpen: false,
      })

      toast.success('Schedule updated! Added targeted practice for weak topics.')
    } else if (proposedChange.type === 'level_up') {
      const nextLevel = proposedChange.targetDifficulty

      updatedSchedule = updatedSchedule.map((item) => {
        if (item.type === 'Practice' || item.type === 'Mock Test') {
          return {
            ...item,
            title: `${item.title.replace(/\((.*?)\)/g, '')} (${nextLevel})`.trim(),
            practiceDifficulty: nextLevel,
            task: `${item.task} adjusted for ${nextLevel} level`,
          }
        }
        return item
      })

      set({
        currentLevel: nextLevel,
        weeklySchedule: updatedSchedule,
        proposedChange: null,
        isProposalModalOpen: false,
      })

      // Sync level to Practice Store
      try {
        usePracticeStore.getState().setDifficulty(nextLevel)
      } catch (e) {
        console.warn('Failed to sync level to Practice Store', e)
      }

      // Sync level to Learning Planner
      try {
        useLearningPlannerStore.getState().updateRoadmapConfig({ level: nextLevel })
      } catch (e) {
        console.warn('Failed to sync level to Learning Planner', e)
      }

      toast.success(`Schedule leveled up to ${nextLevel}!`)
    }
  },

  // Decline proposed schedule adaptation (User keeps current schedule unchanged)
  declineProposedChange: () => {
    set({ proposedChange: null, isProposalModalOpen: false })
    toast('Current schedule preserved without changes.')
  },

  openProposalModal: () => set({ isProposalModalOpen: true }),
  closeProposalModal: () => set({ isProposalModalOpen: false }),
}))
