import { create } from 'zustand'
import {
  fetchUserRoadmap,
  saveRoadmapState,
  generatePersonalizedRoadmap,
} from '../api/learningPlannerApi'
import toast from 'react-hot-toast'

export const useLearningPlannerStore = create((set, get) => ({
  // User configuration
  technology: 'React',
  level: 'Intermediate',
  freeTimeSlots: ['evening'],
  dailyHours: 1.5,
  targetCareer: 'AI Engineer',
  durationDays: 90, // 30 | 60 | 90

  // Roadmap payload
  roadmap: null,
  isLoading: true,
  error: null,

  // UI state
  activeTabDuration: 90, // 30 | 60 | 90
  selectedFilter: 'All', // 'All' | 'Today' | 'Upcoming' | 'Completed' | 'Skipped'
  searchQuery: '',

  // Modals
  isIntakeModalOpen: false,
  editingTask: null, // task object or null
  reschedulingTask: null, // task object or null
  addingTaskToWeek: null, // weekNumber or null

  // Initial load
  loadRoadmap: async (overrides = {}) => {
    try {
      set({ isLoading: true, error: null })
      const config = {
        technology: overrides.technology || get().technology,
        level: overrides.level || get().level,
        freeTimeSlots: overrides.freeTimeSlots || get().freeTimeSlots,
        dailyHours: overrides.dailyHours ?? get().dailyHours,
        targetCareer: overrides.targetCareer || get().targetCareer,
        durationDays: overrides.durationDays || get().activeTabDuration,
      }

      const roadmap = await fetchUserRoadmap(config)
      set({
        roadmap,
        technology: config.technology,
        level: config.level,
        freeTimeSlots: config.freeTimeSlots,
        dailyHours: config.dailyHours,
        targetCareer: config.targetCareer,
        durationDays: config.durationDays,
        activeTabDuration: config.durationDays,
        isLoading: false,
      })
    } catch (err) {
      set({ error: err.message, isLoading: false })
      toast.error('Failed to load roadmap')
    }
  },

  // Switch roadmap duration tab (30, 60, or 90 days)
  switchDuration: (days) => {
    set({ activeTabDuration: days, durationDays: days })
    get().loadRoadmap({ durationDays: days })
  },

  // Update configuration from Intake Wizard
  updateRoadmapConfig: (newConfig) => {
    const fullConfig = {
      technology: newConfig.technology || get().technology,
      level: newConfig.level || get().level,
      freeTimeSlots: newConfig.freeTimeSlots || get().freeTimeSlots,
      dailyHours: newConfig.dailyHours ?? get().dailyHours,
      targetCareer: newConfig.targetCareer || get().targetCareer,
      durationDays: newConfig.durationDays || get().activeTabDuration,
    }

    const newRoadmap = generatePersonalizedRoadmap(fullConfig)
    set({
      ...fullConfig,
      roadmap: newRoadmap,
      activeTabDuration: fullConfig.durationDays,
      isIntakeModalOpen: false,
    })
    saveRoadmapState(newRoadmap)
    toast.success(`Generated personalized ${fullConfig.durationDays}-Day ${fullConfig.technology} Roadmap!`)
  },

  // ─── Task Actions ───────────────────────────────────────────

  // 1. Complete Task
  completeTask: (dayId) => {
    const roadmap = get().roadmap
    if (!roadmap) return

    const updatedDays = roadmap.days.map((d) =>
      d.id === dayId ? { ...d, completed: !d.completed, skipped: false } : d
    )
    const completedCount = updatedDays.filter((d) => d.completed).length
    const progressPercentage = Math.round((completedCount / (updatedDays.length || 1)) * 100)

    const updatedRoadmap = {
      ...roadmap,
      days: updatedDays,
      weeks: roadmap.weeks.map((w) => ({
        ...w,
        days: w.days.map((d) =>
          d.id === dayId ? { ...d, completed: !d.completed, skipped: false } : d
        ),
      })),
      completedTasks: completedCount,
      completedHours: Math.round(completedCount * roadmap.dailyHours),
      progressPercentage,
    }

    set({ roadmap: updatedRoadmap })
    saveRoadmapState(updatedRoadmap)

    const target = updatedDays.find((d) => d.id === dayId)
    if (target?.completed) {
      toast.success(`Completed: ${target.topic}! 🎉`)
    } else {
      toast('Reopened task')
    }
  },

  // 2. Skip Task
  skipTask: (dayId) => {
    const roadmap = get().roadmap
    if (!roadmap) return

    const updatedDays = roadmap.days.map((d) =>
      d.id === dayId ? { ...d, skipped: !d.skipped, completed: false } : d
    )

    const updatedRoadmap = {
      ...roadmap,
      days: updatedDays,
      weeks: roadmap.weeks.map((w) => ({
        ...w,
        days: w.days.map((d) =>
          d.id === dayId ? { ...d, skipped: !d.skipped, completed: false } : d
        ),
      })),
    }

    set({ roadmap: updatedRoadmap })
    saveRoadmapState(updatedRoadmap)
    toast('Task skipped')
  },

  // 3. Reschedule Task
  rescheduleTask: (dayId, newDateLabel) => {
    const roadmap = get().roadmap
    if (!roadmap) return

    const updatedDays = roadmap.days.map((d) =>
      d.id === dayId ? { ...d, rescheduledDate: newDateLabel } : d
    )

    const updatedRoadmap = {
      ...roadmap,
      days: updatedDays,
      weeks: roadmap.weeks.map((w) => ({
        ...w,
        days: w.days.map((d) =>
          d.id === dayId ? { ...d, rescheduledDate: newDateLabel } : d
        ),
      })),
    }

    set({ roadmap: updatedRoadmap, reschedulingTask: null })
    saveRoadmapState(updatedRoadmap)
    toast.success(`Rescheduled to ${newDateLabel}`)
  },

  // 4. Edit Task
  editTask: (dayId, updates) => {
    const roadmap = get().roadmap
    if (!roadmap) return

    const updatedDays = roadmap.days.map((d) =>
      d.id === dayId ? { ...d, ...updates } : d
    )

    const updatedRoadmap = {
      ...roadmap,
      days: updatedDays,
      weeks: roadmap.weeks.map((w) => ({
        ...w,
        days: w.days.map((d) =>
          d.id === dayId ? { ...d, ...updates } : d
        ),
      })),
    }

    set({ roadmap: updatedRoadmap, editingTask: null })
    saveRoadmapState(updatedRoadmap)
    toast.success('Task updated successfully!')
  },

  // 5. Add Custom Task to Week
  addTask: (weekNumber, taskData) => {
    const roadmap = get().roadmap
    if (!roadmap) return

    const newDayId = `custom-task-${Date.now()}`
    const newTask = {
      id: newDayId,
      dayNumber: roadmap.days.length + 1,
      date: `Week ${weekNumber} Extra`,
      topic: taskData.topic || 'Custom Practice Topic',
      stage: taskData.stage || 'Practice',
      stageId: 'practice',
      timeSlot: roadmap.slotLabel,
      learningDuration: `${Math.round(roadmap.dailyHours * 40)} min`,
      practiceDuration: `${Math.round(roadmap.dailyHours * 20)} min`,
      practice: taskData.practice || 'Self-guided practice',
      miniTask: taskData.miniTask || 'Complete implementation drill',
      projectTask: taskData.projectTask || 'Custom milestone',
      revision: 'Review core notes',
      test: null,
      totalDailyHours: `${roadmap.dailyHours} hr`,
      completed: false,
      skipped: false,
      rescheduledDate: null,
      notes: taskData.notes || '',
    }

    const updatedWeeks = roadmap.weeks.map((w) =>
      w.weekNumber === weekNumber ? { ...w, days: [...w.days, newTask] } : w
    )
    const updatedDays = updatedWeeks.flatMap((w) => w.days)

    const updatedRoadmap = {
      ...roadmap,
      weeks: updatedWeeks,
      days: updatedDays,
      totalTasks: updatedDays.length,
      totalPlannedHours: Math.round(updatedDays.length * roadmap.dailyHours),
    }

    set({ roadmap: updatedRoadmap, addingTaskToWeek: null })
    saveRoadmapState(updatedRoadmap)
    toast.success(`Task added to Week ${weekNumber}!`)
  },

  // Filter and Search
  setFilter: (filter) => set({ selectedFilter: filter }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Modal controls
  openIntakeModal: () => set({ isIntakeModalOpen: true }),
  closeIntakeModal: () => set({ isIntakeModalOpen: false }),

  openEditModal: (task) => set({ editingTask: task }),
  closeEditModal: () => set({ editingTask: null }),

  openRescheduleModal: (task) => set({ reschedulingTask: task }),
  closeRescheduleModal: () => set({ reschedulingTask: null }),

  openAddTaskModal: (weekNum) => set({ addingTaskToWeek: weekNum }),
  closeAddTaskModal: () => set({ addingTaskToWeek: null }),
}))
