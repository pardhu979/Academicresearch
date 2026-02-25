# Complete Testing & Troubleshooting Guide

## ✅ Changes Applied

The following fixes have been applied to your code:

### 1. **AuthContext.jsx** - Fixed query parameter
   - Changed: `email_like` → `email`
   - Impact: Email existence check now works correctly

### 2. **server.js** - Enhanced /users GET endpoint
   - Added case-insensitive email comparison
   - Added null safety checks
   - Added try-catch error handling
   - Better logging

### 3. **server.js** - Enhanced /users POST endpoint
   - Added field validation (name, email, password required)
   - Added duplicate email checking (case-insensitive)
   - Normalized email to lowercase
   - Removed password from response
   - Added timestamps
   - Added try-catch error handling

### 4. **api.js** - Improved error messages
   - Detects "Network error" vs "Server error" vs "Connection refused"
   - More helpful messages about starting backend
   - Better logging

### 5. **Register.jsx** - Enhanced error handling
   - Specific error messages for different scenarios
   - Shows 409 (duplicate email) vs 400 (validation) vs network errors
   - Better user feedback

### 6. **vite.config.js** - Added development proxy
   - Better handling of API calls during development
   - Configured for both HTTP and WebSocket

---

## 🧪 Testing Procedure

### Step 1: Verify All Services Are Stopped
```powershell
# Kill any existing processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process npm -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Step 2: Start Backend Server
```powershell
# Terminal 1: Backend
cd c:\Users\Pardhu Swaroop\OneDrive\Documents\full\Academic-research
npm run mock:server

# You should see:
# ( ˶ˆ ᗜ ˆ˵ )
# Mock API Server with Token Validation running on PORT :4000
```

### Step 3: Start Frontend Dev Server
```powershell
# Terminal 2: Frontend (different terminal)
cd c:\Users\Pardhu Swaroop\OneDrive\Documents\full\Academic-research
npm run dev

# You should see:
#   VITE v8.0.0-beta.13  ready in ... ms
#   
#   ➜  Local:   http://localhost:5173/
```

### Step 4: Test Registration Flow

1. **Open Browser**: Go to `http://localhost:5173`
2. **Click Sign Up / Go to Register page**
3. **Fill in the form**:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "SecurePass123"
4. **Check validation**: "Looks good" should appear under password
5. **Click "Create Account"**

### Step 5: Monitor for Success

**Expected Success Flow**:
1. Button shows "Creating..."
2. Browser console shows:
   ```
   [api] request: {method: "GET", url: "http://localhost:4000/users?email=john@example.com"}
   [api] response: {status: 200, data: []}
   [api] request: {method: "POST", url: "http://localhost:4000/users", data: {...}}
   [api] response: {status: 201, data: {id: X, name: "John Doe", email: "john@example.com", createdAt: "..."}}
   ```
3. Page redirects to Dashboard
4. User stays logged in

### Step 6: Test Edge Cases

#### Test 1: Duplicate Email
```
Clear localStorage (DevTools > Application > Local Storage > Clear All)
Go back to Register
Try registering with "john@example.com" again
Expected: Error message: "Email already registered"
```

#### Test 2: Empty Fields
```
Try submitting with empty fields
Expected: Error: "Please fill all fields"
OR button stays disabled (grayed out)
```

#### Test 3: Invalid Email
```
Try: "invalid-email"
Expected: Error: "Please enter a valid email"
```

#### Test 4: Weak Password
```
Try: "pass" (less than 6 chars)
Expected: Error: "At least 6 chars and a number"
```

#### Test 5: Network Error Simulation
```
Stop the backend (Ctrl+C in Terminal 1)
Try registering again
Expected Error: "Network error: No response from server. Is the backend running on http://localhost:4000?"
```

---

## 🐛 Debugging Checklist

### If you still see "Network Error":

- [ ] **Check backend is running**
  ```powershell
  # In any PowerShell terminal:
  Test-NetConnection -ComputerName localhost -Port 4000
  # Should show: TcpTestSucceeded : True
  ```

- [ ] **Check backend logs for errors**
  - Look at Terminal 1 running `npm run mock:server`
  - Should show no errors

- [ ] **Check frontend logs**
  - Open DevTools (F12)
  - Go to Console tab
  - Look for `[api]` prefixed logs
  - They show exact request/response details

- [ ] **Verify .env file**
  ```powershell
  # Check file exists and has correct URL
  Get-Content .env | Select-String "VITE_API_URL"
  # Should show: VITE_API_URL=http://localhost:4000
  ```

- [ ] **Clear browser cache**
  - DevTools > Application > Cache Storage > Delete
  - DevTools > Application > Local Storage > Clear All

- [ ] **Hard refresh frontend**
  - Ctrl+Shift+R (or Cmd+Shift+R on Mac)
  - Or: DevTools > Network tab > Disable cache > Refresh

- [ ] **Verify db.json exists**
  ```powershell
  Test-Path db.json
  # Should return: True
  ```

- [ ] **Check for port conflicts**
  ```powershell
  # Check if port 4000 is in use by another app
  netstat -ano | findstr :4000
  
  # Check if port 5173 is in use
  netstat -ano | findstr :5173
  ```

---

## 📊 Monitoring Backend Responses

### Using PowerShell to test API directly:

```powershell
# Test 1: Check if /users endpoint works
$url = "http://localhost:4000/users"
$response = Invoke-WebRequest -Uri $url -Method GET
$response.StatusCode  # Should be 200
$response.Content | ConvertFrom-Json  # Should show user list

# Test 2: Register a new user
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "TestPass123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri $url -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
$response.StatusCode  # Should be 201
$response.Content | ConvertFrom-Json  # Should show created user

# Test 3: Try duplicate email (should fail)
$response = Invoke-WebRequest -Uri $url -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
# Should get 409 Conflict error
```

---

## 📝 Checking db.json for User Data

```powershell
# View all users stored in db.json
Get-Content db.json | ConvertFrom-Json | Select-Object -ExpandProperty users

# Format as table
Get-Content db.json | ConvertFrom-Json | 
  Select-Object -ExpandProperty users | 
  Format-Table id, name, email, createdAt
```

---

## 🔗 Network Timeline Example

### Successful signup should show this in Network tab:

1. **GET /users** (check if email exists)
   - Status: 200
   - Response: [] (empty array)

2. **POST /users** (create new user)
   - Status: 201
   - Response: {id: 1, name: "...", email: "...", createdAt: "..."}
   - NO password in response ✓

3. **Navigation to /dashboard**
   - Status: 200
   - Shows dashboard page

---

## 🆘 Getting More Help

If you still have issues, collect this information:

1. **Full error message** from browser console (copy the `[api] response error:` log)
2. **Backend logs** - Screenshot of Terminal 1 output
3. **Network tab details** - Screenshot showing failed request status/headers/response
4. **db.json contents** - Verify file exists and has proper JSON structure
5. **Port status** - Output from `netstat` command above
6. **Environment check** - Output from `Get-Content .env | Select-String "VITE_API_URL"`

---

## ✨ Summary

You now have:
- ✅ Fixed query parameter mismatch
- ✅ Case-insensitive email handling
- ✅ Duplicate email detection
- ✅ Input validation
- ✅ Better error messages
- ✅ Development proxy setup
- ✅ Comprehensive logging

The signup should now work! 🚀
