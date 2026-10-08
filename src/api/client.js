import axios from 'axios'

/**
 * Axios API client.
 * Configured for future backend integration.
 * Replace BASE_URL with real API endpoint in Stage 2.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle global errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message || error.message

    if (status === 401) {
      // TODO: Redirect to login / clear auth state
      localStorage.removeItem('auth_token')
    }

    if (status === 403) {
      console.warn('Access denied:', message)
    }

    if (status >= 500) {
      console.error('Server error:', message)
    }

    return Promise.reject({ status, message, original: error })
  }
)

export default apiClient
