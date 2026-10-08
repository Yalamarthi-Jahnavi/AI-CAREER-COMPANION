import { create } from 'zustand'

/**
 * App-wide UI state store.
 * Handles sidebar, theme, and active section state.
 */
export const useAppStore = create((set, get) => ({
  // Sidebar
  sidebarCollapsed: false,
  sidebarMobileOpen: false,

  // Active section (for breadcrumbs, page titles)
  activeSection: 'dashboard',

  // Theme (dark-only for now, extensible)
  theme: 'dark',

  // Loading overlay
  globalLoading: false,

  // Actions
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSidebarCollapsed: (collapsed) =>
    set({ sidebarCollapsed: collapsed }),

  toggleMobileSidebar: () =>
    set((state) => ({ sidebarMobileOpen: !state.sidebarMobileOpen })),

  closeMobileSidebar: () =>
    set({ sidebarMobileOpen: false }),

  setActiveSection: (section) =>
    set({ activeSection: section }),

  setGlobalLoading: (loading) =>
    set({ globalLoading: loading }),

  setTheme: (theme) => {
    set({ theme })
    document.documentElement.className = theme
  },
}))
