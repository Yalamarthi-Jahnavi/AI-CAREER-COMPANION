import { create } from 'zustand'
import { adminApi } from '../api/adminApi'
import toast from 'react-hot-toast'

export const useAdminStore = create((set, get) => ({
  stats: null,
  users: [],
  securityLogs: [],
  emailsOutbox: [],
  contactMessages: [],
  uploadedFiles: [],
  settings: null,
  isLoading: false,
  activeTab: 'overview', // 'overview' | 'users' | 'emails' | 'security' | 'messages' | 'files' | 'settings'
  searchQuery: '',
  roleFilter: 'all',

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setRoleFilter: (filter) => set({ roleFilter: filter }),

  // Load All Admin Data
  loadAllAdminData: async () => {
    set({ isLoading: true })
    try {
      const [statsData, usersData, emailsData, logsData, msgsData, filesData, settingsData] =
        await Promise.allSettled([
          adminApi.getStats(),
          adminApi.getUsers(),
          adminApi.getEmails(),
          adminApi.getSecurityLogs(),
          adminApi.getContactMessages(),
          adminApi.getFiles(),
          adminApi.getSettings(),
        ])

      set({
        stats: statsData.status === 'fulfilled' ? statsData.value : null,
        users: usersData.status === 'fulfilled' ? usersData.value.users : [],
        emailsOutbox: emailsData.status === 'fulfilled' ? emailsData.value.emails : [],
        securityLogs: logsData.status === 'fulfilled' ? logsData.value.logs : [],
        contactMessages: msgsData.status === 'fulfilled' ? msgsData.value.messages : [],
        uploadedFiles: filesData.status === 'fulfilled' ? filesData.value.files : [],
        settings: settingsData.status === 'fulfilled' ? settingsData.value.settings : null,
        isLoading: false,
      })
    } catch (err) {
      console.error('Failed to load admin data', err)
      set({ isLoading: false })
    }
  },

  // Toggle user role between 'user' and 'admin'
  toggleUserRole: async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    try {
      await adminApi.updateUserRole(userId, newRole)
      set((state) => ({
        users: state.users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      }))
      toast.success(`Role updated: user is now an ${newRole.toUpperCase()}`)
      get().loadAllAdminData()
    } catch (err) {
      toast.error('Failed to update user role')
    }
  },

  // Toggle user status between 'active' and 'suspended'
  toggleUserStatus: async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
    try {
      await adminApi.updateUserStatus(userId, newStatus)
      set((state) => ({
        users: state.users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)),
      }))
      toast.success(`User account is now ${newStatus.toUpperCase()}`)
      get().loadAllAdminData()
    } catch (err) {
      toast.error('Failed to update user status')
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      await adminApi.deleteUser(userId)
      set((state) => ({
        users: state.users.filter((u) => u.id !== userId),
      }))
      toast.success('User permanently deleted')
    } catch (err) {
      toast.error('Failed to delete user')
    }
  },

  // Send manual notification or test email
  sendEmail: async ({ to, subject, body, fromType }) => {
    try {
      const res = await adminApi.sendManualEmail({ to, subject, body, fromType })
      if (res?.email) {
        set((state) => ({
          emailsOutbox: [res.email, ...state.emailsOutbox],
        }))
      }
      toast.success(`Email dispatched to ${to}!`)
      return true
    } catch (err) {
      toast.error('Failed to send email')
      return false
    }
  },

  // Save Website Settings
  saveSettings: async (newSettings) => {
    try {
      const res = await adminApi.updateSettings(newSettings)
      if (res?.settings) {
        set({ settings: res.settings })
      }
      toast.success('Website settings updated successfully')
    } catch (err) {
      toast.error('Failed to update website settings')
    }
  },
}))
