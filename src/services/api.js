import axios from 'axios'

// Get API URL from environment or default to localhost
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const api = axios.create({ baseURL, timeout: 10000 })

// Attach token if present (mock token stored in localStorage by AuthContext)
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token')
      if (token) config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` }
    } catch (err) {
      // ignore
    }
    // log request details for debugging
    try {
      const safeData = config.data ? config.data : undefined
      console.debug('[api] request:', { method: config.method, url: `${config.baseURL || ''}${config.url}`, data: safeData })
    } catch (e) {}
    return config
  },
  (err) => {
    console.error('[api] request error:', err && err.message ? err.message : err)
    return Promise.reject(err)
  }
)

// Global response handler: log responses and handle 401s (clear auth + redirect)
api.interceptors.response.use(
  (res) => {
    try {
      console.debug('[api] response:', { url: `${res.config?.baseURL || ''}${res.config?.url}`, status: res.status, data: res.data })
    } catch (e) {}
    return res
  },
  (error) => {
    try {
      console.error('[api] response error:', {
        message: error.message,
        url: error.config ? `${error.config.baseURL || ''}${error.config.url}` : undefined,
        status: error.response && error.response.status,
        data: error.response && error.response.data,
      })
    } catch (e) {}

    // Provide better error message to throw
    if (error.response) {
      // Server responded with error status
      error.message = error.response.data?.error || error.response.statusText || 'Server error'
    } else if (error.request) {
      // Request made but no response
      error.message = 'Network error: No response from server. Is the backend running on http://localhost:4000?'
    } else if (error.code === 'ECONNREFUSED') {
      error.message = 'Cannot connect to server. Make sure backend is running: npm run mock:server'
    } else {
      // Error in request setup
      error.message = error.message || 'Request failed'
    }

    if (error.response && error.response.status === 401) {
      try {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } catch (e) {}
      // redirect to login (in dev mock setup we'll just navigate)
      window.location.pathname = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

