# Network Error Debugging Guide for Sign Up

## Step 1: Verify Backend Server is Running

### Check if server is running:
```powershell
# Terminal 1: Start the mock server
npm run mock:server

# You should see:
# Server running on http://localhost:4000
```

### Test the endpoint directly:
```powershell
# Terminal 2: Test POST to /users
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "Pass123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:4000/users" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

---

## Step 2: Check API Endpoint URL Configuration

### Verify environment variables:
```bash
# Check if VITE_API_URL is set
echo $env:VITE_API_URL  # PowerShell

# Or check your frontend in browser console:
console.log(import.meta.env.VITE_API_URL)
```

### Set correct API URL for development:
```powershell
# PowerShell - set environment variable for dev
$env:VITE_API_URL = "http://localhost:4000"

# Then start your dev server
npm run dev
```

### Or create a .env file:
```
VITE_API_URL=http://localhost:4000
```

---

## Step 3: Check for CORS Issues

### Browser Console Steps:
1. Open DevTools (F12)
2. Go to **Network** tab
3. Try creating account
4. Look for requests to `/users`
5. Check the **Response Headers** for:
   - `Access-Control-Allow-Origin: *`
   - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
   - `Access-Control-Allow-Headers: Content-Type, Authorization`

### If you see CORS error:
- Ensure server.js has CORS middleware before routes
- Check if backend is actually running

---

## Step 4: Verify Request Headers & Content-Type

### In Browser Console, run:
```javascript
// Check what API client is sending
api.defaults.headers.common  // View all headers

// Check a specific request
axios.get('http://localhost:4000/users?email=test@example.com')
  .then(r => console.log('Success:', r))
  .catch(e => console.error('Error:', e.response || e.message))
```

### Expected request headers:
- `Content-Type: application/json`
- `Authorization: Bearer mock-token-X` (after first login, optional for registration)

---

## Step 5: Debug Axios/Fetch Errors

### Check browser console for error details:
- Look for `[api] response error:` logs from api.js interceptor
- This shows: message, URL, status code, response data

### Common network errors:
- **Error: Network Error** → Backend not running or wrong URL
- **Error: timeout of 10000ms exceeded** → Backend too slow or hanging
- **Error: ECONNREFUSED** → Server not listening on port
- **Error: 404** → Endpoint doesn't exist
- **Error: 401** → Missing or invalid authorization token

---

## Step 6: Check Query Parameter Mismatch

### Issue Found:
- Frontend uses: `/users?email_like=...`
- Backend expects: `/users?email=...`

### What breaks:
```javascript
// WRONG - in AuthContext.jsx
api.get(`/users?email_like=${encodeURIComponent(emailNorm)}`)

// This sends email_like parameter but server checks req.query.email
// Result: email check fails, might throw unrelated error
```

---

## Step 7: Verify Backend Validation

### Add detailed logging to debug:
```javascript
// In browser console after form submission:
localStorage.getItem('token')      // Check if token was set
localStorage.getItem('user')       // Check if user was stored

// Check network request/response:
// Look at browser Network tab → click failed /users POST request
// Check Response tab for actual error message
```

---

## Step 8: Check HTTPS/HTTP Mismatch

### If deployed (not local dev):
- Frontend: `https://yourdomain.com` 
- Backend: `http://api.yourdomain.com` → ❌ MIXED CONTENT ERROR

### Fix: Ensure both use same protocol
- Use `https://` for both in production
- Use `http://` for both in development

---

## Full Debugging Checklist

- [ ] Backend running: `npm run mock:server` on port 4000
- [ ] Frontend running: `npm run dev` on port 5173
- [ ] X-ray Network tab for failed requests
- [ ] Check `[api]` logs in console
- [ ] Verify VITE_API_URL = http://localhost:4000
- [ ] Check Content-Type headers
- [ ] Verify no CORS errors
- [ ] Check Bearer token in headers (none needed for signup)
- [ ] Monitor db.json for new user entry
- [ ] Check email_like vs email parameter

---

## Next: See FIXES_NEEDED.md for code corrections
