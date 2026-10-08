import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const INITIAL_HISTORY = [
  {
    id: 'offer-history-1',
    companyName: 'Acme Corp Technologies',
    jobTitle: 'Senior Software Engineer',
    salary: '$140,000 / year (Fixed) + $15,000 Bonus',
    joiningDate: '2026-10-15',
    dateAnalyzed: new Date(Date.now() - 86400000 * 3).toISOString(),
    inputType: 'pdf',
    fileName: 'Offer_Letter_AcmeCorp.pdf',
    safetyLevel: 'LOW',
    safetyLabel: 'Low Concern — Standard Tech Offer',
    concernsCount: 1,
    missingCount: 2,
  },
  {
    id: 'offer-history-2',
    companyName: 'Nexus AI Labs',
    jobTitle: 'Full Stack Engineer',
    salary: '₹18,000,000 CTC (30% Variable)',
    joiningDate: '2026-11-01',
    dateAnalyzed: new Date(Date.now() - 86400000 * 7).toISOString(),
    inputType: 'screenshots',
    fileName: 'Screenshot_Offer_Clause.png',
    safetyLevel: 'MEDIUM',
    safetyLabel: 'Medium Concern — 90-Day Notice & Unclear Variable Pay',
    concernsCount: 3,
    missingCount: 4,
  },
]

export const useOfferAnalyzerStore = create(
  persist(
    (set, get) => ({
      // ── Active Input State ─────────────────────────────────────
      inputType: 'pdf', // 'pdf' | 'image' | 'screenshots' | 'text'
      uploadedFile: null, // { name, size, type }
      rawText: '',
      screenshots: [], // [{ id, name, url, order }]

      // ── Analysis Output State ─────────────────────────────────
      isAnalyzing: false,
      analysisResult: null,

      // ── Saved History State ───────────────────────────────────
      history: INITIAL_HISTORY,

      // ── Input Actions ──────────────────────────────────────────
      setInputType: (type) => set({ inputType: type }),

      setUploadedFile: (fileMeta) => set({ uploadedFile: fileMeta }),

      setRawText: (text) => set({ rawText: text }),

      addScreenshot: (screenshotObj) =>
        set((s) => {
          const newScreenshots = [...s.screenshots, screenshotObj]
          return { screenshots: newScreenshots }
        }),

      removeScreenshot: (id) =>
        set((s) => ({
          screenshots: s.screenshots.filter((sc) => sc.id !== id),
        })),

      reorderScreenshots: (reorderedList) => set({ screenshots: reorderedList }),

      setIsAnalyzing: (val) => set({ isAnalyzing: val }),

      setAnalysisResult: (result) => {
        set((s) => {
          const historyEntry = {
            id: 'offer-history-' + Date.now(),
            companyName: result.summary.company || 'Unknown Employer',
            jobTitle: result.summary.role || 'Position Not Mentioned',
            salary: result.summary.salary || 'Not Mentioned',
            joiningDate: result.summary.joiningDate || 'Not Mentioned',
            dateAnalyzed: new Date().toISOString(),
            inputType: s.inputType,
            fileName: s.uploadedFile?.name || (s.screenshots.length > 0 ? `${s.screenshots.length} Screenshots` : 'Pasted Text'),
            safetyLevel: result.safetyAssessment.level,
            safetyLabel: result.safetyAssessment.label,
            concernsCount: (result.clauses || []).filter((c) => c.concernLevel === 'HIGH' || c.concernLevel === 'MEDIUM').length,
            missingCount: (result.missingInfo || []).filter((m) => m.status === 'missing').length,
            fullResult: result,
          }

          return {
            analysisResult: result,
            history: [historyEntry, ...s.history],
          }
        })
      },

      toggleChecklistItem: (id) => {
        set((s) => {
          if (!s.analysisResult) return {}
          const updatedChecklist = (s.analysisResult.checklist || []).map((item) =>
            item.id === id ? { ...item, completed: !item.completed } : item
          )
          return {
            analysisResult: {
              ...s.analysisResult,
              checklist: updatedChecklist,
            },
          }
        })
      },

      clearActiveInput: () =>
        set({
          uploadedFile: null,
          rawText: '',
          screenshots: [],
          analysisResult: null,
          isAnalyzing: false,
        }),

      deleteHistoryItem: (id) =>
        set((s) => ({
          history: s.history.filter((item) => item.id !== id),
        })),
    }),
    {
      name: 'ai-career-offer-analyzer-store',
      partialize: (s) => ({
        history: s.history,
      }),
    }
  )
)
