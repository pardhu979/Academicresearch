# Code Fixes for Network Error Issue

## Bug #1: Query Parameter Mismatch in AuthContext.jsx ⚠️ CRITICAL

**Problem**: Frontend sends `email_like` parameter but backend checks for `email` parameter.

**File**: `src/context/AuthContext.jsx` - Line 34

**Current (BROKEN)**:
```javascript
const res = await api.get(`/users?email_like=${encodeURIComponent(emailNorm)}`)
```

**Fix**:
```javascript
const res = await api.get(`/users?email=${encodeURIComponent(emailNorm)}`)
```

---

## Bug #2: server.js - Case-Insensitive Email Search

**Problem**: Backend email comparison is case-sensitive but should normalize.

**File**: `server.js` - Lines 46-58

**Current (BUGGY)**:
```javascript
app.get('/users', (req, res) => {
  const email = req.query.email
  const password = req.query.password
  const db = JSON.parse(fs.readFileSync(resolve(__dirname, 'db.json'), 'utf8'))
  
  if (email && password) {
    const user = db.users.find(u => u.email === email && u.password === password)
    return res.json(user ? [user] : [])
  }
  if (email) {
    const users = db.users.filter(u => u.email === email)
    return res.json(users)
  }
  res.json(db.users)
})
```

**Fix**:
```javascript
app.get('/users', (req, res) => {
  try {
    const email = req.query.email ? String(req.query.email).trim().toLowerCase() : null
    const password = req.query.password
    const db = JSON.parse(fs.readFileSync(resolve(__dirname, 'db.json'), 'utf8'))
    
    if (email && password) {
      const user = db.users.find(u => 
        u.email?.toLowerCase() === email && u.password === password
      )
      return res.json(user ? [user] : [])
    }
    if (email) {
      const users = db.users.filter(u => 
        u.email?.toLowerCase() === email
      )
      return res.json(users)
    }
    res.json(db.users)
  } catch (err) {
    console.error('[/users GET] Error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})
```

---

## Bug #3: server.js POST /users - No Error Handling

**Problem**: POST /users has no validation or error handling. Duplicate emails will create duplicates.

**File**: `server.js` - Lines 60-65

**Current (RISKY)**:
```javascript
app.post('/users', (req, res) => {
  const db = JSON.parse(fs.readFileSync(resolve(__dirname, 'db.json'), 'utf8'))
  const newUser = { id: Math.max(...db.users.map(u => u.id), 0) + 1, ...req.body }
  db.users.push(newUser)
  fs.writeFileSync(resolve(__dirname, 'db.json'), JSON.stringify(db, null, 2))
  res.status(201).json(newUser)
})
```

**Fix**:
```javascript
app.post('/users', (req, res) => {
  try {
    const { name, email, password } = req.body
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }
    
    const emailNorm = String(email).trim().toLowerCase()
    const db = JSON.parse(fs.readFileSync(resolve(__dirname, 'db.json'), 'utf8'))
    
    // Check for duplicate email (case-insensitive)
    const exists = db.users.find(u => u.email?.toLowerCase() === emailNorm)
    if (exists) {
      return res.status(409).json({ error: 'Email already registered' })
    }
    
    // Create user with normalized email
    const newUser = { 
      id: Math.max(...db.users.map(u => u.id), 0) + 1, 
      name: String(name).trim(),
      email: emailNorm,
      password: String(password),
      createdAt: new Date().toISOString()
    }
    
    db.users.push(newUser)
    fs.writeFileSync(resolve(__dirname, 'db.json'), JSON.stringify(db, null, 2))
    
    // Don't send password in response
    const { password: _, ...userRes } = newUser
    res.status(201).json(userRes)
  } catch (err) {
    console.error('[/users POST] Error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})
```

---

## Enhancement #1: Add Vite Proxy for Development

**Problem**: When frontend runs on port 5173 and backend on 4000, proxy helps with development.

**File**: `vite.config.js`

**Current (NO PROXY)**:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**Fix**:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

Then update `src/services/api.js` to use `/api` prefix in development.

---

## Enhancement #2: Improved Error Handling in api.js

**File**: `src/services/api.js`

**Current** has good logging, but add:
```javascript
api.interceptors.response.use(
  (res) => {
    // ... existing code ...
    return res
  },
  (error) => {
    // ... existing logging code ...
    
    // Provide better error message to throw
    if (error.response) {
      // Server responded with error status
      error.message = error.response.data?.error || error.response.statusText || 'Server error'
    } else if (error.request) {
      // Request made but no response
      error.message = 'Network error: No response from server. Is the backend running?'
    } else {
      // Error in request setup
      error.message = error.message || 'Request failed'
    }
    
    return Promise.reject(error)
  }
)
```

---

## Enhancement #3: Better Error Messages in Register.jsx

**File**: `src/pages/Register.jsx`

**Current catch block**:
```javascript
catch(err){
  setError(err?.message || 'Registration failed')
}
```

**Improved**:
```javascript
catch(err){
  let errorMsg = 'Registration failed'
  
  if (err.response?.status === 409) {
    errorMsg = 'Email already registered'
  } else if (err.response?.status === 400) {
    errorMsg = err.response.data?.error || 'Invalid input'
  } else if (err.message?.includes('Network')) {
    errorMsg = 'Network error. Make sure backend is running on http://localhost:4000'
  } else if (err.message?.includes('timeout')) {
    errorMsg = 'Request timeout. Server is slow to respond.'
  } else {
    errorMsg = err?.response?.data?.error || err?.message || 'Registration failed'
  }
  
  setError(errorMsg)
  console.error('[Register] Error:', err)
}
```

---

## Enhancement #4: Add .env Configuration

**File**: `.env` (create new file)

```env
# Frontend API Configuration
VITE_API_URL=http://localhost:4000
VITE_LOG_LEVEL=debug
```

**Usage**: Environment variables are available via `import.meta.env.VITE_*` in Vite projects.

---

## Summary of Issues Found:

| Issue | Severity | Location | Impact |
|-------|----------|----------|--------|
| email_like vs email param mismatch | 🔴 CRITICAL | AuthContext.jsx:34 | Email check always fails → signup fails |
| Case-insensitive email not handled | 🟡 HIGH | server.js:46-58 | User can't register if email case differs |
| No duplicate email check in POST | 🟡 HIGH | server.js:60-65 | Can create duplicate accounts |
| No error validation in POST | 🟡 HIGH | server.js:60-65 | Empty fields accepted |
| No proxy in Vite config | 🟠 MEDIUM | vite.config.js | CORS issues in development |
| Generic error messages | 🟠 MEDIUM | api.js, Register.jsx | Hard to debug |

---

## Testing Steps After Fixes:

1. **Kill any running processes**: Ctrl+C in all terminals
2. **Start backend**: `npm run mock:server`
3. **Start frontend**: `npm run dev`
4. **Test signup**:
   - Try new account (should succeed)
   - Try same email again (should show "Email already registered")
   - Try with empty fields (should validate)
5. **Monitor browser console** for `[api]` logs
6. **Check db.json** for new user entry

