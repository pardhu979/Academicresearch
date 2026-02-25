# Best Practices: Frontend & Backend Code Examples

## Part 1: Frontend (React/JavaScript) Best Practices

### Example 1: Proper Error Handling in Register Component

```jsx
// ✅ GOOD - Comprehensive error handling
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { validateEmail, passwordFeedback, isPasswordStrong } from '../utils/validation'

export default function Register() {
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  
  const [state, setState] = useState({
    error: '',
    loading: false,
    success: false,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (state.error) setState(prev => ({ ...prev, error: '' }))
  }

  const validate = () => {
    const { name, email, password } = form
    const nameTrim = String(name || '').trim()
    const emailNorm = String(email || '').trim().toLowerCase()
    const passwordTrim = String(password || '').trim()

    if (!nameTrim || !emailNorm || !passwordTrim) {
      return 'Please fill all fields'
    }
    if (!validateEmail(emailNorm)) {
      return 'Invalid email format'
    }
    const pwFeedback = passwordFeedback(passwordTrim)
    if (pwFeedback) {
      return pwFeedback
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate before submission
    const validationError = validate()
    if (validationError) {
      setState(prev => ({ ...prev, error: validationError }))
      return
    }

    setState(prev => ({ ...prev, loading: true, error: '' }))

    try {
      const { name, email, password } = form
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
      })
      
      setState(prev => ({ ...prev, success: true }))
      // Auto redirect after success
      setTimeout(() => navigate('/dashboard'), 1500)
      
    } catch (err) {
      // Parse different error types
      let errorMsg = 'Registration failed'
      
      try {
        if (err.response) {
          // Backend returned error
          const status = err.response.status
          const data = err.response.data
          
          switch (status) {
            case 409:
              errorMsg = 'Email already registered'
              break
            case 400:
              errorMsg = data?.error || 'Please check your input'
              break
            case 500:
              errorMsg = 'Server error. Try again later'
              break
            default:
              errorMsg = data?.error || 'Registration failed'
          }
        } else if (err.request) {
          // Request made but no response
          errorMsg = 'Network error: Backend server is not responding'
        } else if (err.message?.includes('timeout')) {
          errorMsg = 'Request timeout. Server is slow'
        } else {
          errorMsg = err.message || 'Unknown error'
        }
      } catch (parseErr) {
        // Fallback if error parsing fails
        errorMsg = err?.message || 'Registration failed'
      }
      
      setState(prev => ({ ...prev, error: errorMsg }))
      console.error('[Register] Error details:', err)
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const { name, email, password } = form
  const { error, loading, success } = state

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="card">
        <h4 className="mb-3 text-lg font-semibold">Create Account</h4>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-3 text-sm">
            ⚠️ {error}
          </div>
        )}
        
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded mb-3 text-sm">
            ✓ Account created! Redirecting...
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              disabled={loading}
              placeholder="John Doe"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              disabled={loading}
              placeholder="john@example.com"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {email && !validateEmail(email) && (
              <p className="text-red-500 text-xs mt-1">Invalid email</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Password *</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              disabled={loading}
              placeholder="At least 6 characters + 1 number"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="text-xs mt-1">
              {password ? (
                isPasswordStrong(password) ? (
                  <span className="text-green-600">✓ Strong password</span>
                ) : (
                  <span className="text-amber-600">{passwordFeedback(password)}</span>
                )
              ) : (
                <span className="text-gray-500">At least 6 chars and 1 number</span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !name.trim() || !validateEmail(email) || !isPasswordStrong(password)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin mr-2">⌛</span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account? {' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </div>
      </div>
    </div>
  )
}
```

### Example 2: Proper Axios Interceptor Setup

```javascript
// ✅ GOOD - Full interceptor with error mapping
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (err) {
      console.warn('Failed to set auth token:', err)
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.debug('[API Request]', {
        method: config.method,
        url: `${config.baseURL}${config.url}`,
        data: config.data,
      })
    }

    return config
  },
  (error) => {
    console.error('[API Request Error]', error.message)
    return Promise.reject(error)
  }
)

// Response interceptor - handle responses and 401s
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.debug('[API Response]', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      })
    }
    return response
  },
  (error) => {
    // Enhanced error object with helpful messages
    const enhancedError = error

    try {
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response
        
        switch (status) {
          case 400:
            enhancedError.message = data?.error || 'Invalid request'
            break
          case 401:
            // Handle auth expiry
            localStorage.removeItem('authToken')
            window.location.href = '/login'
            enhancedError.message = 'Session expired. Please login again'
            break
          case 409:
            enhancedError.message = data?.error || 'Resource conflict'
            break
          case 500:
            enhancedError.message = 'Server error. Please try again later'
            break
          default:
            enhancedError.message = data?.error || `Error: ${status}`
        }
      } else if (error.request) {
        // Request made but no response
        if (error.code === 'ECONNABORTED') {
          enhancedError.message = 'Request timeout. Server took too long'
        } else if (error.code === 'ECONNREFUSED') {
          enhancedError.message = 'Cannot reach server. Is it running?'
        } else {
          enhancedError.message = 'Network error. No response from server'
        }
      } else {
        // Error in request setup
        enhancedError.message = error.message || 'Request failed'
      }
    } catch (err) {
      // Fallback
      enhancedError.message = error.message || 'Unknown error'
    }

    console.error('[API Error]', {
      message: enhancedError.message,
      status: error.response?.status,
      url: error.config?.url,
    })

    return Promise.reject(enhancedError)
  }
)

export default api
```

---

## Part 2: Backend (Node.js/Express) Best Practices

### Example 1: Proper User Registration Endpoint

```javascript
// ✅ GOOD - Complete registration with validation
import express from 'express'
import fs from 'fs'
import { resolve } from 'path'

const app = express()
app.use(express.json())

// Validation helper
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const validatePassword = (password) => {
  return password && password.length >= 6 && /\d/.test(password)
}

// POST /users - Register new user
app.post('/users', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, password',
        code: 'MISSING_FIELDS',
      })
    }

    // Sanitize inputs
    const nameTrim = String(name).trim()
    const emailNorm = String(email).trim().toLowerCase()
    const passwordTrim = String(password).trim()

    if (nameTrim.length === 0) {
      return res.status(400).json({
        error: 'Name cannot be empty',
        code: 'INVALID_NAME',
      })
    }

    if (!validateEmail(emailNorm)) {
      return res.status(400).json({
        error: 'Invalid email format',
        code: 'INVALID_EMAIL',
      })
    }

    if (!validatePassword(passwordTrim)) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters and contain a number',
        code: 'WEAK_PASSWORD',
      })
    }

    // Load database
    const dbPath = resolve(process.cwd(), 'db.json')
    const dbContent = fs.readFileSync(dbPath, 'utf8')
    const db = JSON.parse(dbContent)

    // Check for duplicate email (case-insensitive)
    const existingUser = db.users.find(
      u => u.email?.toLowerCase() === emailNorm
    )
    if (existingUser) {
      return res.status(409).json({
        error: 'Email already registered',
        code: 'DUPLICATE_EMAIL',
      })
    }

    // Create new user
    const newUser = {
      id: Math.max(...db.users.map(u => u.id || 0), 0) + 1,
      name: nameTrim,
      email: emailNorm,
      password: passwordTrim, // In production: hash this!
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Save to database
    db.users.push(newUser)
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))

    // Return user WITHOUT password
    const { password: _, ...userRes } = newUser
    res.status(201).json(userRes)

  } catch (error) {
    console.error('[POST /users] Error:', error.message)
    
    if (error instanceof SyntaxError) {
      return res.status(500).json({
        error: 'Database format error',
        code: 'DB_ERROR',
      })
    }

    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    })
  }
})

// GET /users - Check if email exists
app.get('/users', async (req, res) => {
  try {
    const { email, password } = req.query

    const dbPath = resolve(process.cwd(), 'db.json')
    const dbContent = fs.readFileSync(dbPath, 'utf8')
    const db = JSON.parse(dbContent)

    if (email && password) {
      // Login check
      const emailNorm = String(email).trim().toLowerCase()
      const user = db.users.find(
        u => u.email?.toLowerCase() === emailNorm && u.password === password
      )
      return res.json(user ? [user] : [])
    }

    if (email) {
      // Email existence check
      const emailNorm = String(email).trim().toLowerCase()
      const users = db.users.filter(
        u => u.email?.toLowerCase() === emailNorm
      )
      return res.json(users)
    }

    // Return all users (without passwords)
    const usersWithoutPasswords = db.users.map(({ password: _, ...u }) => u)
    res.json(usersWithoutPasswords)

  } catch (error) {
    console.error('[GET /users] Error:', error.message)
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    })
  }
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`)
})
```

### Example 2: CORS Middleware Setup

```javascript
// ✅ GOOD - Proper CORS configuration
import express from 'express'

const app = express()

// CORS middleware - allow frontend requests
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://yourdomain.com',
  ]

  const origin = req.headers.origin
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  } else if (process.env.NODE_ENV === 'development') {
    res.header('Access-Control-Allow-Origin', '*')
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Max-Age', '86400') // 24 hours

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }

  next()
})

// JSON parser with size limit
app.use(express.json({ limit: '10mb' }))

// Your routes...
app.post('/users', (req, res) => {
  // Routes come here
})
```

### Example 3: Error Response Standards

```javascript
// ✅ GOOD - Consistent error format
const sendError = (res, statusCode, message, code = 'ERROR') => {
  res.status(statusCode).json({
    error: message,
    code,
    timestamp: new Date().toISOString(),
  })
}

app.post('/users', (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return sendError(res, 400, 'Missing required fields', 'MISSING_FIELDS')
  }

  if (!validateEmail(email)) {
    return sendError(res, 400, 'Invalid email format', 'INVALID_EMAIL')
  }

  // Success response
  res.status(201).json({
    success: true,
    data: {
      id: 1,
      name,
      email,
      createdAt: new Date().toISOString(),
    },
  })
})
```

---

## Part 3: HTTP Status Codes Cheat Sheet

```
200 OK - Request succeeded
201 Created - Resource created successfully
400 Bad Request - Invalid input/missing fields
401 Unauthorized - Missing/invalid auth token
403 Forbidden - Not allowed to perform action
404 Not Found - Resource doesn't exist
409 Conflict - Duplicate resource (e.g., email exists)
500 Internal Server Error - Server error
503 Service Unavailable - Server overloaded
```

---

## Part 4: Content-Type Headers

```javascript
// JSON requests
headers: {
  'Content-Type': 'application/json'
}

// Form data
headers: {
  'Content-Type': 'application/x-www-form-urlencoded'
}

// File upload
headers: {
  'Content-Type': 'multipart/form-data'
  // Note: axios auto-sets this when sending FormData
}

// Authorization
headers: {
  'Authorization': 'Bearer <token>'
}
```

---

## Summary

✅ **Frontend**: Comprehensive error handling, clear user feedback, proper validation
✅ **Backend**: Input validation, duplicate checking, proper HTTP status codes, CORS headers
✅ **Communication**: Structured error responses, consistent status codes
✅ **Security**: Sanitize inputs, never expose passwords, validate all data
✅ **Debugging**: Log requests/responses, include error codes, meaningful error messages
