import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

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

app.use((req, res, next) => {
  const path = req.path
  const method = req.method

  // Allow login and register without token
  if ((method === 'GET' || method === 'POST') && path === '/users') {
    return next()
  }

  // All other requests require Authorization header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: missing or invalid token' })
  }

  next()
})

// Simple file-based routing for mock data
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

app.post('/users', (req, res) => {
  const db = JSON.parse(fs.readFileSync(resolve(__dirname, 'db.json'), 'utf8'))
  const newUser = { id: Math.max(...db.users.map(u => u.id), 0) + 1, ...req.body }
  db.users.push(newUser)
  fs.writeFileSync(resolve(__dirname, 'db.json'), JSON.stringify(db, null, 2))
  res.status(201).json(newUser)
})

app.get('/projects', (req, res) => {
  const db = JSON.parse(fs.readFileSync(resolve(__dirname, 'db.json'), 'utf8'))
  res.json(db.projects)
})

app.get('/projects/:id', (req, res) => {
  const db = JSON.parse(fs.readFileSync(resolve(__dirname, 'db.json'), 'utf8'))
  const project = db.projects.find(p => p.id === Number(req.params.id))
  res.json(project || {})
})

app.post('/projects', (req, res) => {
  const db = JSON.parse(fs.readFileSync(resolve(__dirname, 'db.json'), 'utf8'))
  const newProject = { id: Math.max(...db.projects.map(p => p.id), 0) + 1, ...req.body }
  db.projects.push(newProject)
  fs.writeFileSync(resolve(__dirname, 'db.json'), JSON.stringify(db, null, 2))
  res.status(201).json(newProject)
})

app.delete('/projects/:id', (req, res) => {
  const db = JSON.parse(fs.readFileSync(resolve(__dirname, 'db.json'), 'utf8'))
  db.projects = db.projects.filter(p => p.id !== Number(req.params.id))
  fs.writeFileSync(resolve(__dirname, 'db.json'), JSON.stringify(db, null, 2))
  res.json({ success: true })
})

app.get('/documents', (req, res) => {
  const db = JSON.parse(fs.readFileSync(resolve(__dirname, 'db.json'), 'utf8'))
  const projectId = req.query.projectId ? Number(req.query.projectId) : null
  const docs = projectId ? db.documents.filter(d => d.projectId === projectId) : db.documents
  res.json(docs)
})

app.post('/documents', (req, res) => {
  const db = JSON.parse(fs.readFileSync(resolve(__dirname, 'db.json'), 'utf8'))
  const newDoc = { id: Math.max(...db.documents.map(d => d.id), 0) + 1, ...req.body }
  db.documents.push(newDoc)
  fs.writeFileSync(resolve(__dirname, 'db.json'), JSON.stringify(db, null, 2))
  res.status(201).json(newDoc)
})

app.get('/messages', (req, res) => {
  const db = JSON.parse(fs.readFileSync(resolve(__dirname, 'db.json'), 'utf8'))
  const projectId = req.query.projectId ? Number(req.query.projectId) : null
  const msgs = projectId ? db.messages.filter(m => m.projectId === projectId) : db.messages
  res.json(msgs)
})

app.post('/messages', (req, res) => {
  const db = JSON.parse(fs.readFileSync(resolve(__dirname, 'db.json'), 'utf8'))
  const newMsg = { id: Math.max(...db.messages.map(m => m.id), 0) + 1, ...req.body }
  db.messages.push(newMsg)
  fs.writeFileSync(resolve(__dirname, 'db.json'), JSON.stringify(db, null, 2))
  res.status(201).json(newMsg)
})

const PORT = 4000
app.listen(PORT, () => {
  console.log(`\n( ˶ˆ ᗜ ˆ˵ )\n`)
  console.log(`Mock API Server with Token Validation running on PORT :${PORT}`)
  console.log('\nEndpoints:')
  console.log(`  http://localhost:${PORT}/users (no auth required)`)
  console.log(`  http://localhost:${PORT}/projects`)
  console.log(`  http://localhost:${PORT}/documents`)
  console.log(`  http://localhost:${PORT}/messages`)
  console.log('\n✓ Token validation enabled for all endpoints except login/register')
  console.log('Press CTRL-C to stop\n')
})
