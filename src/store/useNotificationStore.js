import { create } from 'zustand'

/**
 * Notification store.
 * Ready to connect to a real notification API/WebSocket.
 */

const DEMO_NOTIFICATIONS = [
  {
    id: '1',
    type: 'info',
    title: 'Resume analyzed!',
    message: 'Your resume scored 78/100. View detailed feedback.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
    action: { label: 'View', href: '/app/resume-analyzer' },
  },
  {
    id: '2',
    type: 'success',
    title: 'Interview prep complete',
    message: 'You completed 5 mock interview questions today.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
    action: { label: 'Continue', href: '/app/mock-interview' },
  },
  {
    id: '3',
    type: 'warning',
    title: 'Skill gap detected',
    message: 'You have 3 missing skills for Senior React Developer roles.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    action: { label: 'Analyze', href: '/app/skill-gap-analyzer' },
  },
  {
    id: '4',
    type: 'info',
    title: 'New roadmap available',
    message: 'AI/ML Engineering roadmap for 2025 has been updated.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    action: { label: 'Explore', href: '/app/technology-roadmap' },
  },
  {
    id: '5',
    type: 'success',
    title: 'Deadline reminder',
    message: 'Project submission due in 2 days.',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    read: true,
    action: { label: 'View planner', href: '/app/deadline-planner' },
  },
]

export const useNotificationStore = create((set, get) => ({
  notifications: DEMO_NOTIFICATIONS,
  isOpen: false,

  // Computed
  get unreadCount() {
    return get().notifications.filter((n) => !n.read).length
  },

  // Actions
  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
  closePanel: () => set({ isOpen: false }),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        { ...notification, id: Date.now().toString(), timestamp: new Date().toISOString(), read: false },
        ...state.notifications,
      ],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearAll: () => set({ notifications: [] }),
}))
