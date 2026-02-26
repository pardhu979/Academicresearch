import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import fs from 'fs'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'
const TOKEN_EXPIRY = '2h' // tokens expire in 2 hours

// helper helpers for database
function loadDB() {
  return JSON.parse(fs.readFileSync(resolve(__dirname, 'db.json'), 'utf8'))
}
function saveDB(db) {
  fs.writeFileSync(resolve(__dirname, 'db.json'), JSON.stringify(db, null, 2))
}

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

// JSON parser
app.use(express.json())

// authentication middleware - applied to protected routes later
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: missing token' })
  }
  const token = authHeader.slice(7)
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

function authorizeRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
    if (req.user.role !== role) return res.status(403).json({ error: `Forbidden: requires ${role}` })
    next()
  }
}

// public auth routes
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' })
    }
    const db = loadDB()
    const normEmail = String(email).trim().toLowerCase()
    const existing = db.users.find(u => u.email === normEmail)
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' })
    }
    const hash = await bcrypt.hash(password, 10)
    const newUser = {
      id: Math.max(...db.users.map(u => Number(u.id) || 0), 0) + 1,
      name: String(name).trim(),
      email: normEmail,
      password: hash,
      role: role === 'admin' ? 'admin' : 'researcher',
      createdAt: new Date().toISOString(),
    }
    db.users.push(newUser)
    saveDB(db)
    const { password: pw, ...userNoPass } = newUser
    const token = jwt.sign({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
    res.status(201).json({ user: userNoPass, token })
  } catch (err) {
    console.error('[/auth/register] error', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }
    const db = loadDB()
    const user = db.users.find(u => u.email === String(email).trim().toLowerCase())
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const { password: pw, ...userNoPass } = user
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
    res.json({ user: userNoPass, token })
  } catch (err) {
    console.error('[/auth/login] error', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/auth/forgot-password', (req, res) => {
  try {
    const { email } = req.body
    const db = loadDB()
    const user = db.users.find(u => u.email === String(email).trim().toLowerCase())
    if (!user) {
      // do not reveal whether email exists
      return res.json({ success: true })
    }
    // generate a simple token and store it temporarily
    const resetToken = Math.random().toString(36).substring(2, 15)
    user.resetToken = resetToken
    user.resetTokenExpiry = Date.now() + 3600 * 1000 // 1 hour
    saveDB(db)
    // in a real app you'd email the link containing the token
    console.log('[mock email] password reset token for', user.email, resetToken)
    res.json({ success: true })
  } catch (err) {
    console.error('[/auth/forgot-password] error', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password required' })
    }
    const db = loadDB()
    const user = db.users.find(u => u.resetToken === token && u.resetTokenExpiry > Date.now())
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' })
    }
    user.password = await bcrypt.hash(newPassword, 10)
    delete user.resetToken
    delete user.resetTokenExpiry
    saveDB(db)
    res.json({ success: true })
  } catch (err) {
    console.error('[/auth/reset-password] error', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// protect all routes that follow
app.use(authenticate)

// user listing (admin only)
app.get('/users', authorizeRole('admin'), (req, res) => {
  const db = loadDB()
  const users = db.users.map(({ password, resetToken, resetTokenExpiry, ...u }) => u)
  res.json(users)
})

// delete a user (admin only)
app.delete('/users/:id', authorizeRole('admin'), (req, res) => {
  const db = loadDB()
  const userId = Number(req.params.id)
  db.users = db.users.filter(u => Number(u.id) !== userId)
  saveDB(db)
  res.json({ success: true })
})

// project/document/message routes remain, but enforce roles on modifications
app.get('/projects', (req, res) => {
  const db = loadDB()
  res.json(db.projects)
})

app.get('/projects/:id', (req, res) => {
  const db = loadDB()
  const project = db.projects.find(p => p.id === Number(req.params.id))
  res.json(project || {})
})

app.post('/projects', authorizeRole('admin'), (req, res) => {
  const db = loadDB()
  const newProject = { id: Math.max(...db.projects.map(p => Number(p.id) || 0), 0) + 1, ...req.body }
  db.projects.push(newProject)
  saveDB(db)
  res.status(201).json(newProject)
})

app.delete('/projects/:id', authorizeRole('admin'), (req, res) => {
  const db = loadDB()
  db.projects = db.projects.filter(p => p.id !== Number(req.params.id))
  saveDB(db)
  res.json({ success: true })
})

// documents and messages require authentication but anyone can post
app.get('/documents', (req, res) => {
  const db = loadDB()
  const projectId = req.query.projectId ? Number(req.query.projectId) : null
  const docs = projectId ? db.documents.filter(d => d.projectId === projectId) : db.documents
  res.json(docs)
})

app.post('/documents', (req, res) => {
  const db = loadDB()
  const newDoc = { id: Math.max(...db.documents.map(d => Number(d.id) || 0), 0) + 1, ...req.body }
  db.documents.push(newDoc)
  saveDB(db)
  res.status(201).json(newDoc)
})

app.get('/messages', (req, res) => {
  const db = loadDB()
  const projectId = req.query.projectId ? Number(req.query.projectId) : null
  const msgs = projectId ? db.messages.filter(m => m.projectId === projectId) : db.messages
  res.json(msgs)
})

app.post('/messages', (req, res) => {
  const db = loadDB()
  const newMsg = { id: Math.max(...db.messages.map(m => Number(m.id) || 0), 0) + 1, ...req.body }
  db.messages.push(newMsg)
  saveDB(db)
  res.status(201).json(newMsg)
})

const PORT = 4000
app.listen(PORT, () => {
  console.log(`\n( ˶ˆ ᗜ ˆ˵ )\n`)
  console.log(`Secure mock API Server with JWT running on PORT :${PORT}`)
  console.log('\nAuth Endpoints:')
  console.log(`  POST http://localhost:${PORT}/auth/register`)
  console.log(`  POST http://localhost:${PORT}/auth/login`)
  console.log(`  POST http://localhost:${PORT}/auth/forgot-password`)
  console.log(`  POST http://localhost:${PORT}/auth/reset-password`)
  console.log('\nData Endpoints (require Authorization header):')
  console.log(`  GET/POST/DELETE http://localhost:${PORT}/projects`)
  console.log(`  GET/POST http://localhost:${PORT}/documents`)
  console.log(`  GET/POST http://localhost:${PORT}/messages`)
  console.log(`  GET http://localhost:${PORT}/users  (admin only)`)
  console.log('\n✓ JWT validation enabled, password hashing applied')
  console.log('Press CTRL-C to stop\n')
})


