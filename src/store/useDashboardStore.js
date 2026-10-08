import { create } from 'zustand'
import {
  fetchDashboardData,
  updateDeadlineStatus,
  updatePriorityItemStatus,
} from '../api/dashboardApi'
import toast from 'react-hot-toast'

export const useDashboardStore = create((set, get) => ({
  // Career summary state
  careerHealth: null,
  practiceTechnologies: [],
  learningToday: null,
  projectToday: null,
  upcomingDeadlines: [],
  interviewNext: null,
  jobSwitchReadiness: null,
  latestOffer: null,
  todaysPriorities: [],
  
  isLoading: true,
  isRefreshing: false,
  error: null,

  // Selected tech for practice test modal
  activePracticeModal: null, // { id, name } or null

  // Fetch full dashboard payload
  loadDashboard: async () => {
    try {
      set({ isLoading: true, error: null })
      const data = await fetchDashboardData()
      set({
        careerHealth: data.careerHealth,
        practiceTechnologies: data.practiceTechnologies,
        learningToday: data.learningToday,
        projectToday: data.projectToday,
        upcomingDeadlines: data.upcomingDeadlines,
        interviewNext: data.interviewNext,
        jobSwitchReadiness: data.jobSwitchReadiness,
        latestOffer: data.latestOffer,
        todaysPriorities: data.todaysPriorities,
        isLoading: false,
      })
    } catch (err) {
      set({ error: err.message || 'Failed to load dashboard data', isLoading: false })
      toast.error('Could not load dashboard data')
    }
  },

  // Soft refresh
  refreshDashboard: async () => {
    try {
      set({ isRefreshing: true })
      const data = await fetchDashboardData()
      set({
        careerHealth: data.careerHealth,
        practiceTechnologies: data.practiceTechnologies,
        learningToday: data.learningToday,
        projectToday: data.projectToday,
        upcomingDeadlines: data.upcomingDeadlines,
        interviewNext: data.interviewNext,
        jobSwitchReadiness: data.jobSwitchReadiness,
        latestOffer: data.latestOffer,
        todaysPriorities: data.todaysPriorities,
        isRefreshing: false,
      })
      toast.success('Dashboard synchronized with your latest career progress!')
    } catch (err) {
      set({ isRefreshing: false })
      toast.error('Failed to refresh dashboard')
    }
  },

  // Toggle deadline completion
  toggleDeadline: async (id) => {
    const list = get().upcomingDeadlines
    const item = list.find((d) => d.id === id)
    if (!item) return

    const updatedStatus = !item.completed

    // Optimistic UI update
    set({
      upcomingDeadlines: list.map((d) =>
        d.id === id ? { ...d, completed: updatedStatus, progress: updatedStatus ? 100 : 50 } : d
      ),
    })

    try {
      await updateDeadlineStatus(id, updatedStatus)
      toast.success(updatedStatus ? `Completed: "${item.title}"` : `Reopened: "${item.title}"`)
    } catch {
      set({ upcomingDeadlines: list })
      toast.error('Failed to update deadline')
    }
  },

  // Toggle Today's Priority item completion
  togglePriority: async (id) => {
    const list = get().todaysPriorities
    const item = list.find((p) => p.id === id)
    if (!item) return

    const newStatus = item.status === 'completed' ? 'pending' : 'completed'

    set({
      todaysPriorities: list.map((p) =>
        p.id === id ? { ...p, status: newStatus } : p
      ),
    })

    try {
      await updatePriorityItemStatus(id, newStatus === 'completed')
      if (newStatus === 'completed') {
        toast.success(`Completed: ${item.title} 🎉`)
      }
    } catch {
      set({ todaysPriorities: list })
    }
  },

  // Open / Close Practice Test Modal
  openPracticeModal: (tech = null) => {
    set({ activePracticeModal: tech || { id: 'react', name: 'React' } })
  },

  closePracticeModal: () => {
    set({ activePracticeModal: null })
  },
}))
