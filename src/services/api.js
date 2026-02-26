/**
 * Front‑end only mock API backed by localStorage.
 *
 * The original version of this project used axios to hit a
 * backend running on localhost:4000.  To support a completely
 * offline, frontend‑only experience we replace the network
 * layer with a tiny helper that understands the endpoints used
 * by the app and persist data in localStorage collections.
 *
 * Any call made through the old api interface (get/post/put/
 * delete) now resolves immediately and never issues a network
 * request.  Existing pages/components can remain unchanged.
 */

// helper functions -------------------------------------------------

function readCollection(name) {
  const raw = localStorage.getItem(name)
  return raw ? JSON.parse(raw) : []
}

function writeCollection(name, data) {
  localStorage.setItem(name, JSON.stringify(data))
}

function getNextId(list) {
  if (!Array.isArray(list) || list.length === 0) return 1
  return Math.max(...list.map((it) => it.id || 0)) + 1
}

function makeError(status, message) {
  const err = new Error(message || 'Error')
  err.response = { status, data: { error: message } }
  return err
}

function parseQuery(q) {
  if (!q) return {}
  return Object.fromEntries(
    q
      .split('&')
      .map((p) => p.split('='))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  )
}

function simulate(data) {
  // mimic axios response shape
  return Promise.resolve({ data })
}

const api = {
  get(url) {
    const [path, query] = url.split('?')
    const params = parseQuery(query)

    if (path === '/users') {
      let users = readCollection('users')
      if (params.email) {
        users = users.filter((u) => u.email === params.email)
      }
      return simulate(users)
    }

    if (path.startsWith('/users/')) {
      const id = Number(path.split('/')[2])
      const users = readCollection('users')
      const usr = users.find((u) => u.id === id)
      return simulate(usr || null)
    }

    if (path === '/projects') {
      return simulate(readCollection('projects'))
    }

    if (path.startsWith('/projects/')) {
      const id = Number(path.split('/')[2])
      const projs = readCollection('projects')
      const p = projs.find((p) => p.id === id)
      return simulate(p || null)
    }

    if (path === '/documents') {
      let docs = readCollection('documents')
      if (params.projectId) {
        docs = docs.filter((d) => String(d.projectId) === String(params.projectId))
      }
      return simulate(docs)
    }

    if (path === '/messages') {
      let msgs = readCollection('messages')
      if (params.projectId) {
        msgs = msgs.filter((m) => String(m.projectId) === String(params.projectId))
      }
      return simulate(msgs)
    }

    return simulate(null)
  },

  post(url, body) {
    const [path] = url.split('?')

    if (path === '/auth/register') {
      const { name, email, password, role } = body
      if (!name || !email || !password) {
        return Promise.reject(makeError(400, 'Missing fields'))
      }
      const users = readCollection('users')
      if (users.find((u) => u.email === email)) {
        return Promise.reject(makeError(409, 'Email already registered'))
      }
      const newUser = {
        id: getNextId(users),
        name,
        email,
        password,
        role: role || 'researcher',
      }
      users.push(newUser)
      writeCollection('users', users)
      return simulate({ user: newUser, token: 'fake-jwt-token' })
    }

    if (path === '/auth/login') {
      const { email, password } = body
      const users = readCollection('users')
      const usr = users.find((u) => u.email === email && u.password === password)
      if (!usr) {
        return Promise.reject(makeError(401, 'Invalid email or password'))
      }
      return simulate({ user: usr, token: 'fake-jwt-token' })
    }

    if (path === '/auth/forgot-password') {
      // we don't actually send emails in the frontend-only version; just pretend success
      return simulate({})
    }

    if (path === '/projects') {
      const projects = readCollection('projects')
      const newProj = { id: getNextId(projects), ...body }
      projects.push(newProj)
      writeCollection('projects', projects)
      return simulate(newProj)
    }

    if (path === '/documents') {
      const docs = readCollection('documents')
      const newDoc = { id: getNextId(docs), date: Date.now(), ...body }
      docs.push(newDoc)
      writeCollection('documents', docs)
      return simulate(newDoc)
    }

    if (path === '/messages') {
      const msgs = readCollection('messages')
      const newMsg = { id: getNextId(msgs), date: Date.now(), ...body }
      msgs.push(newMsg)
      writeCollection('messages', msgs)
      return simulate(newMsg)
    }

    return simulate(null)
  },

  delete(url) {
    const [path] = url.split('?')
    if (path.startsWith('/projects/')) {
      const id = Number(path.split('/')[2])
      let projects = readCollection('projects')
      projects = projects.filter((p) => p.id !== id)
      writeCollection('projects', projects)
      return simulate(null)
    }
    if (path.startsWith('/users/')) {
      const id = Number(path.split('/')[2])
      let users = readCollection('users')
      users = users.filter((u) => u.id !== id)
      writeCollection('users', users)
      return simulate(null)
    }
    return simulate(null)
  },
}

export default api

