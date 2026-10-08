import { create } from 'zustand'
import {
  generatePracticeTest,
  submitPracticeTest,
  TECHNOLOGIES_LIST,
} from '../api/practiceApi'
import toast from 'react-hot-toast'

import { useAssessmentHistoryStore } from './useAssessmentHistoryStore'
import { useDeadlinePlannerStore } from './useDeadlinePlannerStore'

export const usePracticeStore = create((set, get) => ({
  // Screen state: 'config' | 'testing' | 'review'
  screen: 'config',

  // Config selections
  selectedTech: 'python',
  selectedDifficulty: 'Intermediate',
  selectedCount: 5,
  selectedDuration: 10, // minutes
  practiceMode: 'codechef', // 'codechef' | 'standard'

  // Active test session
  testSession: null, // { testId, questions, durationSeconds... }
  currentIndex: 0,
  userAnswers: {}, // { [questionIndex]: optionIndex }
  skippedIndices: [], // array of skipped question indices
  timeRemaining: 600,
  isTimerActive: false,

  // Evaluation & Review
  results: null, // grade, correctCount, review array

  // Exit warning modal
  isExitWarningOpen: false,
  pendingNavigation: null,

  // Loading state
  isLoading: false,

  // ─── Actions ────────────────────────────────────────────────

  setTech: (techId) => set({ selectedTech: techId }),
  setDifficulty: (diff) => set({ selectedDifficulty: diff }),
  setCount: (count) => set({ selectedCount: count }),
  setDuration: (minutes) => set({ selectedDuration: minutes }),
  setPracticeMode: (mode) => set({ practiceMode: mode }),

  // Start the test session
  startTest: async (customConfig = null) => {
    try {
      set({ isLoading: true })
      const tech = customConfig?.technology || get().selectedTech
      const diff = customConfig?.difficulty || get().selectedDifficulty
      const count = customConfig?.questionCount || get().selectedCount
      const duration = customConfig?.durationMinutes || get().selectedDuration
      const mode = customConfig?.mode || get().practiceMode

      const session = await generatePracticeTest({
        technology: tech,
        difficulty: diff,
        questionCount: count,
        durationMinutes: duration,
        mode,
      })

      set({
        screen: 'testing',
        testSession: session,
        selectedTech: tech,
        selectedDifficulty: diff,
        selectedCount: count,
        selectedDuration: duration,
        currentIndex: 0,
        userAnswers: {},
        skippedIndices: [],
        timeRemaining: session.durationSeconds,
        isTimerActive: true,
        results: null,
        isLoading: false,
      })

      toast.success(`Started ${tech.toUpperCase()} Practice Assessment!`)
    } catch (err) {
      set({ isLoading: false })
      toast.error('Failed to generate practice test')
    }
  },

  // Record user answer choice
  selectAnswer: (optionIndex) => {
    const { currentIndex, userAnswers, skippedIndices } = get()
    set({
      userAnswers: { ...userAnswers, [currentIndex]: optionIndex },
      skippedIndices: skippedIndices.filter((idx) => idx !== currentIndex),
    })
  },

  // Navigation between questions
  nextQuestion: () => {
    const { currentIndex, testSession } = get()
    if (currentIndex < testSession.questions.length - 1) {
      set({ currentIndex: currentIndex + 1 })
    }
  },

  prevQuestion: () => {
    const { currentIndex } = get()
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 })
    }
  },

  skipQuestion: () => {
    const { currentIndex, skippedIndices, testSession } = get()
    if (!skippedIndices.includes(currentIndex)) {
      set({ skippedIndices: [...skippedIndices, currentIndex] })
    }
    if (currentIndex < testSession.questions.length - 1) {
      set({ currentIndex: currentIndex + 1 })
      toast('Question skipped — you can return anytime')
    }
  },

  jumpToQuestion: (index) => {
    const { testSession } = get()
    if (index >= 0 && index < testSession.questions.length) {
      set({ currentIndex: index })
    }
  },

  // Decrement timer
  tickTimer: () => {
    const { timeRemaining, isTimerActive } = get()
    if (!isTimerActive) return

    if (timeRemaining <= 1) {
      set({ timeRemaining: 0, isTimerActive: false })
      toast.error('Time is up! Submitting test...')
      get().submitTest()
    } else {
      set({ timeRemaining: timeRemaining - 1 })
    }
  },

  // Submit test
  submitTest: async () => {
    const { testSession, userAnswers, timeRemaining, selectedTech, selectedDifficulty } = get()
    if (!testSession) return

    set({ isTimerActive: false, isLoading: true })
    const timeSpent = Math.max(1, testSession.durationSeconds - timeRemaining)
    const minutes = Math.floor(timeSpent / 60)
    const seconds = timeSpent % 60
    const timeTakenFormatted = `${minutes}m ${seconds}s`

    try {
      const results = await submitPracticeTest({
        testId: testSession.testId,
        questions: testSession.questions,
        answers: userAnswers,
        timeSpentSeconds: timeSpent,
        technology: selectedTech,
        difficulty: selectedDifficulty,
      })

      // SAVE to Assessment History:
      // Score, Stars, Technology, Difficulty, Questions, Correct answers, Incorrect answers, Date, Time taken
      const historyRecord = {
        id: testSession.testId,
        score: results.score,
        scoreOutOf100: results.scoreOutOf100,
        stars: results.starsCount,
        starString: results.starString,
        technology: selectedTech.charAt(0).toUpperCase() + selectedTech.slice(1),
        difficulty: selectedDifficulty,
        questions: testSession.questions.length,
        correctAnswers: results.correctCount,
        incorrectAnswers: results.incorrectCount,
        date: results.submittedAt,
        timeTaken: timeTakenFormatted,
        timeTakenSeconds: timeSpent,
        breakdown: results.breakdown,
        feedback: results.feedback,
        nextSteps: results.nextSteps,
        review: results.review,
      }

      useAssessmentHistoryStore.getState().addAssessment(historyRecord)

      // Connect with Deadline Planner & Learning Planner:
      // Evaluates performance to propose weak topic practice or level-up without automatically altering schedule
      useDeadlinePlannerStore.getState().evaluateTestPerformance(results)

      set({
        screen: 'review',
        results,
        isLoading: false,
      })

      toast.success(`Test Completed! Score: ${results.scoreOutOf100}`)
    } catch (err) {
      set({ isLoading: false })
      toast.error('Error submitting test')
    }
  },

  // Practice weak topics action
  practiceWeakTopics: () => {
    const { results, selectedTech, selectedDifficulty } = get()
    toast.success(`Starting focused session for ${selectedTech.toUpperCase()} weak topics...`)
    get().startTest({
      technology: selectedTech,
      difficulty: selectedDifficulty,
      questionCount: 5,
      durationMinutes: 10,
    })
  },

  // Exit warning handling
  attemptExit: (navigationAction = null) => {
    set({ isExitWarningOpen: true, pendingNavigation: navigationAction })
  },

  confirmExit: () => {
    const { pendingNavigation } = get()
    set({
      screen: 'config',
      testSession: null,
      isTimerActive: false,
      isExitWarningOpen: false,
    })
    if (pendingNavigation) pendingNavigation()
  },

  cancelExit: () => {
    set({ isExitWarningOpen: false, pendingNavigation: null })
  },

  // Retake or reset
  retakeTest: () => {
    get().startTest()
  },

  resetToConfig: () => {
    set({
      screen: 'config',
      testSession: null,
      results: null,
      isTimerActive: false,
    })
  },
}))
