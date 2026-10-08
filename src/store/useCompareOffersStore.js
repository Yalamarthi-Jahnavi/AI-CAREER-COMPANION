import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { compareTwoOffers, PRESET_OFFER_COMPARISONS } from '../api/compareOffersApi'

export const useCompareOffersStore = create(
  persist(
    (set, get) => ({
      // Input Offers
      offerA: PRESET_OFFER_COMPARISONS.sampleA,
      offerB: PRESET_OFFER_COMPARISONS.sampleB,

      // Active comparison results
      comparisonResult: null,
      isComparing: false,
      error: null,

      // Setters
      setOfferAField: (field, val) =>
        set((state) => ({ offerA: { ...state.offerA, [field]: val } })),

      setOfferBField: (field, val) =>
        set((state) => ({ offerB: { ...state.offerB, [field]: val } })),

      setOfferA: (offer) => set({ offerA: offer }),
      setOfferB: (offer) => set({ offerB: offer }),

      loadPreset: (presetKey = 'standardVsStartup') => {
        const presets = PRESET_OFFER_COMPARISONS[presetKey]
        if (presets) {
          set({
            offerA: presets.offerA,
            offerB: presets.offerB,
          })
          get().runComparison()
        }
      },

      runComparison: async () => {
        const { offerA, offerB } = get()
        set({ isComparing: true, error: null })
        try {
          const result = await compareTwoOffers(offerA, offerB)
          set({ comparisonResult: result, isComparing: false })
        } catch (err) {
          set({ error: err.message || 'Comparison failed', isComparing: false })
        }
      },
    }),
    {
      name: 'compare-offers-storage',
      partialize: (state) => ({
        offerA: state.offerA,
        offerB: state.offerB,
        comparisonResult: state.comparisonResult,
      }),
    }
  )
)
