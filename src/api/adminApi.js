import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach user role & token
client.interceptors.request.use((config) => {
  try {
    const rawUserStore = localStorage.getItem('ai_career_user_store')
    if (rawUserStore) {
      const parsed = JSON.parse(rawUserStore)
      const user = parsed?.state?.user
      if (user?.role) {
        config.headers['X-User-Role'] = user.role
      }
      config.headers['Authorization'] = user?.role === 'admin' ? 'Bearer jwt_mock_admin_token' : 'Bearer jwt_mock_user_token'
    }
  } catch (err) {
    console.error('Failed to attach auth headers', err)
  }
  return config
})

export const adminApi = {
  // Statistics
  getStats: async () => {
    const res = await client.get('/admin/stats')
    return res.data
  },

  // Users Management
  getUsers: async (params = {}) => {
    const res = await client.get('/admin/users', { params })
    return res.data
  },

  updateUserRole: async (userId, role) => {
    const res = await client.put(`/admin/users/${userId}/role`, { role })
    return res.data
  },

  updateUserStatus: async (userId, status) => {
    const res = await client.put(`/admin/users/${userId}/status`, { status })
    return res.data
  },

  deleteUser: async (userId) => {
    const res = await client.delete(`/admin/users/${userId}`)
    return res.data
  },

  // Security Logs
  getSecurityLogs: async () => {
    const res = await client.get('/admin/security-logs')
    return res.data
  },

  // Email Management & Outbox
  getEmails: async () => {
    const res = await client.get('/admin/emails')
    return res.data
  },

  sendManualEmail: async (emailPayload) => {
    const res = await client.post('/admin/emails/send', emailPayload)
    return res.data
  },

  // Contact Messages
  getContactMessages: async () => {
    const res = await client.get('/admin/contact-messages')
    return res.data
  },

  sendContactMessage: async (msgPayload) => {
    const res = await client.post('/contact', msgPayload)
    return res.data
  },

  // Uploaded Files
  getFiles: async () => {
    const res = await client.get('/admin/files')
    return res.data
  },

  // Settings
  getSettings: async () => {
    const res = await client.get('/admin/settings')
    return res.data
  },

  updateSettings: async (settings) => {
    const res = await client.put('/admin/settings', settings)
    return res.data
  },

  // Password Reset
  requestPasswordReset: async (email) => {
    const res = await client.post('/auth/forgot-password', { email })
    return res.data
  },
}
