import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateAssistantResponse } from '../api/careerAssistantApi'
import { useUserStore } from './useUserStore'
import { useAssessmentHistoryStore } from './useAssessmentHistoryStore'
import { useDeadlinePlannerStore } from './useDeadlinePlannerStore'
import { useOfferAnalyzerStore } from './useOfferAnalyzerStore'
import { useProjectAssistantStore } from './useProjectAssistantStore'

const INITIAL_MESSAGES = [
  {
    id: 'msg-welcome-01',
    sender: 'assistant',
    text: `### 👋 Welcome to your Unified AI Career Companion

I'm your **24/7 Career Decision Support & Engineering Mentor**. I can help you solve immediate workplace challenges, optimize your learning schedule, practice targeted skills, navigate offer letters, or prepare for high-stakes interviews.

---

#### 💡 Try one of these quick queries or ask anything directly:
* ⏰ **"My deadline is tomorrow. Help me prioritize."**
* ⚡ **"I have only one hour today. What technology should I practice?"**
* 📊 **"My React test score is 62. What should I improve?"**
* 💬 **"My teammate asked me this technical question. Give me a quick professional answer."**
* 📑 **"Analyze this offer letter."**
* 🤝 **"What questions should I ask HR?"**`,
    category: 'Welcome',
    actionLinks: [
      { label: 'Deadline Planner', path: '/app/deadline-planner', icon: 'Calendar' },
      { label: 'Technology Practice', path: '/app/current-technology-practice', icon: 'Code2' },
      { label: 'Offer Analyzer', path: '/app/offer-letter-analyzer', icon: 'Mail' },
    ],
    timestamp: 'Just now',
    contextUsed: false,
  },
]

export const useCareerAssistantStore = create(
  persist(
    (set, get) => ({
      // State
      messages: INITIAL_MESSAGES,
      isLoading: false,
      useContext: true, // Toggle allowing AI to read user state
      selectedCategory: 'all',

      // Actions
      toggleContext: () => set((state) => ({ useContext: !state.useContext })),
      setUseContext: (val) => set({ useContext: val }),
      setSelectedCategory: (cat) => set({ selectedCategory: cat }),

      // Collect real context across all active stores
      gatherUserContext: () => {
        const { useContext } = get()
        if (!useContext) return { enabled: false }

        try {
          const userState = useUserStore.getState().user
          const historyList = useAssessmentHistoryStore.getState().history || []
          const deadlineState = useDeadlinePlannerStore.getState()
          const offerState = useOfferAnalyzerStore.getState()
          const projectState = useProjectAssistantStore.getState()

          const recentAssessment = historyList[0] || null
          const activeDeadlines = deadlineState.weeks?.map((w) => ({
            title: `Week ${w.weekNumber}: ${w.title}`,
            deadline: 'In 3-7 days',
            urgency: 'Active sprint milestone',
          })) || []

          const activeOffer = offerState.analysisResult?.companyName
            ? {
                companyName: offerState.analysisResult.companyName,
                jobTitle: offerState.analysisResult.jobTitle,
                safetyLevel: offerState.analysisResult.safetyLevel,
              }
            : (offerState.history?.[0] || null)

          return {
            enabled: true,
            user: {
              name: userState?.name || 'Alex Johnson',
              role: userState?.role || 'Senior Software Engineer',
              careerGoal: userState?.careerGoal || 'Staff Engineer',
              currentStack: userState?.currentStack || ['React', 'TypeScript', 'Node.js', 'AWS'],
              targetStack: userState?.targetStack || ['React', 'TypeScript', 'Go', 'Kubernetes', 'System Design'],
            },
            assessmentHistory: {
              recentScore: recentAssessment?.score || 62,
              recentTech: recentAssessment?.technology || 'React',
              totalTestsTaken: historyList.length,
            },
            deadlines: {
              activeList: activeDeadlines,
            },
            offerAnalyzer: {
              activeOffer,
            },
            project: {
              activeBlueprint: projectState?.blueprint?.title || null,
            },
          }
        } catch (err) {
          console.warn('Context aggregation fallback:', err)
          return { enabled: true, user: { name: 'Alex' } }
        }
      },

      // Send chat message
      sendMessage: async (promptText) => {
        if (!promptText || !promptText.trim()) return

        const userMsg = {
          id: `msg-user-${Date.now()}`,
          sender: 'user',
          text: promptText.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }

        // Add user message immediately
        set((state) => ({
          messages: [...state.messages, userMsg],
          isLoading: true,
        }))

        try {
          const context = get().gatherUserContext()
          const assistantMsg = await generateAssistantResponse(promptText, context)

          set((state) => ({
            messages: [...state.messages, assistantMsg],
            isLoading: false,
          }))
        } catch (error) {
          console.error('Error generating assistant response:', error)
          const errorMsg = {
            id: `msg-err-${Date.now()}`,
            sender: 'assistant',
            text: '⚠️ I encountered an issue processing your request. Please try asking again.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            category: 'Error',
            contextUsed: false,
          }
          set((state) => ({
            messages: [...state.messages, errorMsg],
            isLoading: false,
          }))
        }
      },

      // Clear conversation
      clearChat: () => {
        set({ messages: INITIAL_MESSAGES })
      },

      // Export chat transcript
      exportChat: () => {
        const { messages } = get()
        const formatted = messages
          .map((m) => `[${m.timestamp}] ${m.sender.toUpperCase()}:\n${m.text}\n`)
          .join('\n---\n\n')

        const blob = new Blob([formatted], { type: 'text/markdown;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `AI_Career_Assistant_Chat_${new Date().toISOString().slice(0, 10)}.md`
        link.click()
        URL.revokeObjectURL(url)
      },
    }),
    {
      name: 'ai_career_chat_history',
      partialize: (state) => ({
        messages: state.messages,
        useContext: state.useContext,
      }),
    }
  )
)
