import { create } from 'zustand'
import {
  fetchRoadmapData,
  saveUserPracticeStack,
  TECH_CATEGORIES,
  RELEVANCE_FILTERS,
} from '../api/roadmapApi'
import toast from 'react-hot-toast'

export const useRoadmapStore = create((set, get) => ({
  categories: TECH_CATEGORIES,
  relevanceFilters: RELEVANCE_FILTERS,
  technologies: [],
  myCurrentTechnologies: [],

  selectedCategory: 'All',
  selectedRelevance: 'All Relevance',
  searchQuery: '',

  isLoading: true,
  error: null,

  // Selected technology for deep-dive detail modal
  activeTechDetail: null,

  // Selected technology for starting practice / test modal
  activePracticeModal: null,

  // Is Add Technology modal open
  isAddTechModalOpen: false,

  // Initialize
  loadRoadmap: async () => {
    try {
      set({ isLoading: true, error: null })
      const data = await fetchRoadmapData()
      set({
        technologies: data.technologies,
        myCurrentTechnologies: data.userPracticeStack,
        isLoading: false,
      })
    } catch (err) {
      set({ error: err.message || 'Failed to load technology roadmap', isLoading: false })
      toast.error('Could not load roadmap data')
    }
  },

  setCategory: (category) => set({ selectedCategory: category }),
  setRelevance: (relevance) => set({ selectedRelevance: relevance }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Add technology to "My Current Technologies"
  addCurrentTech: async (tech) => {
    const list = get().myCurrentTechnologies
    if (list.some((t) => t.id === tech.id || t.name.toLowerCase() === tech.name.toLowerCase())) {
      toast.error(`${tech.name} is already in your current practice stack!`)
      return
    }

    const newEntry = {
      id: tech.id,
      name: tech.name,
      progress: 25,
      currentLevel: 'Level 1: Novice',
      practiceScore: 60,
      testsCompleted: 0,
      lastTest: 'Not started',
      bestScore: 0,
      starsEarned: 1,
      color: tech.color || '#6366f1',
      category: tech.category,
    }

    const updated = [newEntry, ...list]
    set({ myCurrentTechnologies: updated, isAddTechModalOpen: false })
    await saveUserPracticeStack(updated)
    toast.success(`Added ${tech.name} to My Current Technologies!`)
  },

  // Remove technology from "My Current Technologies"
  removeCurrentTech: async (techId) => {
    const list = get().myCurrentTechnologies
    const target = list.find((t) => t.id === techId)
    const updated = list.filter((t) => t.id !== techId)

    set({ myCurrentTechnologies: updated })
    await saveUserPracticeStack(updated)
    toast.success(`Removed ${target?.name || 'technology'} from your practice stack.`)
  },

  // Modal actions
  openTechDetail: (tech) => set({ activeTechDetail: tech }),
  closeTechDetail: () => set({ activeTechDetail: null }),

  openPracticeModal: (tech) => set({ activePracticeModal: tech }),
  closePracticeModal: () => set({ activePracticeModal: null }),

  openAddTechModal: () => set({ isAddTechModalOpen: true }),
  closeAddTechModal: () => set({ isAddTechModalOpen: false }),
}))
