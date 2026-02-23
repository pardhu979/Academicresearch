import axios from 'axios'

// Get API URL from environment or default to localhost
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const api = axios.create({ baseURL })

// Attach token if present (mock token stored in localStorage by AuthContext)
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token')
    if (token) config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` }
  } catch (err) {
    // ignore
  }
  return config
})

// Global response handler: if mock backend returns 401, clear auth and redirect to login
api.interceptors.response.use(
  (res) => res,
  (error) => {
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

