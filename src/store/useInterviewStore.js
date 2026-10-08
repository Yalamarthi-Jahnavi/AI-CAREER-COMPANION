import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const INITIAL_INTERVIEW_HISTORY = [
  {
    id: 'int-session-1',
    role: 'Full Stack Developer',
    roundType: 'mixed',
    date: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
    duration: '14m 20s',
    scores: {
      interviewScore: 68,
      technicalScore: 70,
      communicationScore: 65,
      confidenceScore: 64,
      hrScore: 72,
      problemSolvingScore: 69,
    },
    stars: 3,
    starsString: '⭐⭐⭐',
    encouragement: 'Solid foundation! Focus on structuring your answers with concrete metrics and the STAR framework.',
    summary: 'Good conceptual knowledge of React and Node.js. Communication was clear, though some answers lacked quantitative impact numbers.',
    answersCount: 5,
  },
  {
    id: 'int-session-2',
    role: 'Full Stack Developer',
    roundType: 'technical',
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    duration: '16m 05s',
    scores: {
      interviewScore: 79,
      technicalScore: 82,
      communicationScore: 78,
      confidenceScore: 76,
      hrScore: 78,
      problemSolvingScore: 81,
    },
    stars: 4,
    starsString: '⭐⭐⭐⭐',
    encouragement: 'Great improvement! Your explanation of system caching and state reconciliation was sharp and convincing.',
    summary: 'Noticeable jump in confidence and problem-solving clarity. Technical trade-offs were explained with real-world examples.',
    answersCount: 5,
  },
  {
    id: 'int-session-3',
    role: 'Full Stack Developer',
    roundType: 'mixed',
    date: new Date(Date.now() - 3600000 * 6).toISOString(), // 6 hours ago
    duration: '18m 30s',
    scores: {
      interviewScore: 91,
      technicalScore: 94,
      communicationScore: 89,
      confidenceScore: 92,
      hrScore: 90,
      problemSolvingScore: 93,
    },
    stars: 5,
    starsString: '⭐⭐⭐⭐⭐',
    encouragement: 'Outstanding performance! You demonstrated senior-level architecture depth, clear communication, and calm confidence.',
    summary: 'Exceptional answers across technical accuracy and problem solving. Handled edge cases and architectural trade-offs with distinction.',
    answersCount: 5,
  },
]

export const useInterviewStore = create(
  persist(
    (set, get) => ({
      // ── Active Mock Interview Session ──────────────────────────
      activeSession: null, // { role, roundType, questions, currentIdx, answers, startTime }
      isEvaluatingAnswer: false,
      finalReport: null,

      // ── History & Tracking ─────────────────────────────────────
      history: INITIAL_INTERVIEW_HISTORY,

      // ── HR Question Generator State ───────────────────────────
      selectedHrCategory: 'all',
      savedHrQuestions: [],
      starDrafts: {}, // { [qId]: { situation, task, action, result } }

      // ── Mock Interview Actions ─────────────────────────────────
      startSession: ({ role, roundType, questions }) => {
        set({
          activeSession: {
            id: 'session-' + Date.now(),
            role,
            roundType,
            questions,
            currentIndex: 0,
            answers: [],
            startTime: Date.now(),
          },
          finalReport: null,
          isEvaluatingAnswer: false,
        })
      },

      setEvaluating: (val) => set({ isEvaluatingAnswer: val }),

      recordAnswer: (evaluatedAnswer) => {
        set((s) => {
          if (!s.activeSession) return {}
          return {
            activeSession: {
              ...s.activeSession,
              answers: [...s.activeSession.answers, evaluatedAnswer],
            },
          }
        })
      },

      nextQuestion: () => {
        set((s) => {
          if (!s.activeSession) return {}
          return {
            activeSession: {
              ...s.activeSession,
              currentIndex: s.activeSession.currentIndex + 1,
            },
          }
        })
      },

      finishSession: (report) => {
        const currentSession = get().activeSession
        const historyItem = {
          id: currentSession?.id || 'session-' + Date.now(),
          role: currentSession?.role || 'Full Stack Developer',
          roundType: currentSession?.roundType || 'mixed',
          date: new Date().toISOString(),
          duration: report.timeTaken || '15m 00s',
          scores: {
            interviewScore: report.interviewScore,
            technicalScore: report.technicalScore,
            communicationScore: report.communicationScore,
            confidenceScore: report.confidenceScore,
            hrScore: report.hrScore,
            problemSolvingScore: report.problemSolvingScore,
          },
          stars: report.stars,
          starsString: '⭐'.repeat(report.stars),
          encouragement: report.encouragement,
          summary: report.summary,
          answersCount: currentSession?.answers?.length || 0,
          answers: currentSession?.answers || [],
        }

        set((s) => ({
          finalReport: report,
          history: [historyItem, ...s.history],
        }))
      },

      clearActiveSession: () => {
        set({ activeSession: null, finalReport: null, isEvaluatingAnswer: false })
      },

      // ── HR Question Actions ────────────────────────────────────
      setHrCategory: (cat) => set({ selectedHrCategory: cat }),

      toggleSaveHrQuestion: (question) => {
        set((s) => {
          const exists = s.savedHrQuestions.some((q) => q.id === question.id)
          return {
            savedHrQuestions: exists
              ? s.savedHrQuestions.filter((q) => q.id !== question.id)
              : [...s.savedHrQuestions, question],
          }
        })
      },

      updateStarDraft: (qId, field, value) => {
        set((s) => ({
          starDrafts: {
            ...s.starDrafts,
            [qId]: {
              ...(s.starDrafts[qId] || { situation: '', task: '', action: '', result: '' }),
              [field]: value,
            },
          },
        }))
      },

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'ai-career-interview-store',
      partialize: (s) => ({
        history: s.history,
        savedHrQuestions: s.savedHrQuestions,
        starDrafts: s.starDrafts,
      }),
    }
  )
)
