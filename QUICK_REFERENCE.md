# Quick Troubleshooting Reference

## 🚀 Quick Start (5 minutes)

```powershell
# Terminal 1: Start Backend
npm run mock:server

# Terminal 2: Start Frontend
npm run dev

# Browser: http://localhost:5173 → Register
```

---

## 🔍 Quick Diagnostics

### Symptom: "Network Error" on signup

**Check 1: Is backend running?**
```powershell
Test-NetConnection -ComputerName localhost -Port 4000
# Expected: TcpTestSucceeded : True
```

**Check 2: Open browser console (F12)**
- Look for red error messages
- Search for `[api] response error:` logs
- Look at Network tab → Failed requests

**Check 3: Stop both servers, restart**
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
npm run mock:server
# New terminal:
npm run dev
```

---

### Symptom: "Email already registered" appears twice

✅ This is fixed! The code now checks for duplicates correctly.

---

### Symptom: Form button stays disabled

**Issue**: Frontend validation failing

**Fix**:
- Email must be: `user@domain.com` (valid format)
- Password must be: 6+ chars + 1 number (e.g., `Pass123`)
- All fields must be filled

---

### Symptom: Redirected to login immediately after signup

**Possible causes**:
1. Token not being saved to localStorage
2. Navigate function not working
3. Page reload clearing data

**Debug**:
```javascript
// In console after signup:
localStorage.getItem('token')
localStorage.getItem('user')
```

---

### Symptom: Can create account with empty name

**Status**: ✅ Fixed

Backend now validates:
- name required
- name not empty after trim
- email valid format
- password has length + number

---

## 📋 File Changes Summary

| File | Change | Impact |
|------|--------|--------|
| `AuthContext.jsx` | `email_like` → `email` | ✅ Email check works |
| `server.js` GET | Case-insensitive + validation | ✅ Proper email search |
| `server.js` POST | Validation + duplicate check | ✅ Prevents bad data |
| `api.js` | Better error messages | ✅ Clear feedback |
| `Register.jsx` | Enhanced error handling | ✅ Shows specific errors |
| `vite.config.js` | Added proxy | ✅ Dev server fixed |
| `.env` | Already correct | ✓ No change needed |

---

## 🧪 Test Scenarios

### Test 1: Happy Path ✅
```
Name: John Doe
Email: john@example.com  
Password: Pass123
→ Should succeed and redirect to dashboard
```

### Test 2: Duplicate Email ✅
```
Register same email twice
→ Should show: "Email already registered"
```

### Test 3: Weak Password ✅
```
Password: Pass
→ Should show: "At least 6 chars and a number"
```

### Test 4: Invalid Email ✅
```
Email: notanemail
→ Should show: "Invalid email format"
```

### Test 5: Offline ✅
```
Stop backend (Ctrl+C)
Try signup
→ Should show helpful message about backend
```

---

## 📊 Database File Check

```powershell
# View db.json structure
Get-Content db.json | ConvertFrom-Json

# Count users
(Get-Content db.json | ConvertFrom-Json).users.Count

# Check user details
(Get-Content db.json | ConvertFrom-Json).users | Format-Table id, name, email
```

---

## 🔗 API Endpoint Reference

```
GET /users                    Check user exists or list all
GET /users?email=...          Check if specific email exists  
POST /users                   Create new user
GET /projects                 List projects
POST /projects                Create project
GET /documents               List documents
POST /documents              Create document
GET /messages                List messages
POST /messages               Create message
```

---

## ⚡ Performance Tips

1. **Clear browser cache before testing**
   - DevTools > Application > Clear All
   
2. **Hard refresh page**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

3. **Check Network tab**
   - Disable cache while DevTools is open
   - Filter by XHR to see API calls only

4. **Monitor file size**
   - db.json will grow as you add users
   - Each user adds ~100 bytes

---

## 🐛 Common Mistakes

❌ **DON'T**:
- Forget to start backend before frontend
- Leave old processes running (use Task Manager)
- Use `email_like` parameter (now fixed)
- Expose password in JSON responses (now fixed)
- Mix HTTPS and HTTP URLs

✅ **DO**:
- Always check browser console first
- Verify port 4000 and 5173 are available
- Use consistent email format (normalized)
- Test with proper validation data
- Monitor Network tab in DevTools

---

## 📞 Support Info to Gather

If issues persist, collect:

1. **Browser console output** (full error from `[api]` logs)
2. **Network tab screenshot** (failed request details)
3. **Backend terminal output** (any errors there?)
4. **db.json contents** (does it have corrupt data?)
5. **Port status** (run `netstat -ano | findstr :4000`)
6. **Exact error message** (what does user see?)

---

## ✅ Verification Checklist

- [ ] Backend: `npm run mock:server` runs without errors
- [ ] Frontend: `npm run dev` shows "ready in ... ms"
- [ ] Browser: Can navigate to http://localhost:5173
- [ ] Form: All fields render correctly
- [ ] Validation: "Looks good" appears for valid password
- [ ] Submit: Creates user in db.json
- [ ] Redirect: Goes to /dashboard after signup
- [ ] Error handling: Shows proper error for duplicates
- [ ] Offline: Shows connection error when backend down

---

## 🎯 Next Steps

1. ✅ Apply all code fixes (done)
2. 🎯 **Start servers and test (you are here)**
3. 🎯 Verify db.json updates with new users
4. 🎯 Test all error scenarios
5. 🎯 Monitor console logs during signup
6. 🎯 Once working, deploy to production

---

## 🚀 When It Works

You'll see:
```
[api] request: {method: "POST", url: "http://localhost:4000/users", ...}
[api] response: {status: 201, ...}
→ Page redirects to dashboard
→ localStorage has token and user data
→ db.json has new user entry
```

If you still see "Network Error", it's usually:
1. Backend not running (fix: `npm run mock:server`)
2. Port conflict (fix: `netstat` to check)
3. Stale browser cache (fix: Ctrl+Shift+R)
4. db.json corrupted (fix: restore from backup)

---

Good luck! 🎉 Your signup should now work perfectly.
