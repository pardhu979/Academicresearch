import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    navigate('/dashboard')
  }

  const register = async ({ name, email, password }) => {
    // normalize email and check if it exists (case-insensitive)
    const emailNorm = String(email || '').trim().toLowerCase()
    
    // Get users from localStorage (offline mode)
    try {
      const usersJSON = localStorage.getItem('appUsers') || '[]'
      const users = JSON.parse(usersJSON)
      
      // Check if email already exists
      const exists = users.find(u => u.email && u.email.toLowerCase() === emailNorm)
      if (exists) {
        throw new Error('Email already registered')
      }
      
      // Create new user
      const newId = Math.max(...users.map(u => u.id || 0), 0) + 1
      const created = {
        id: newId,
        name: String(name).trim(),
        email: emailNorm,
        password: String(password).trim(),
        createdAt: new Date().toISOString()
      }
      
      // Save to localStorage
      users.push(created)
      localStorage.setItem('appUsers', JSON.stringify(users))
      
      // Login
      const token = `mock-token-${created.id}`
      login({ id: created.id, name: created.name, email: created.email }, token)
      return created
    } catch (err) {
      throw new Error(err.message || 'Registration failed')
    }
  }

  const requestPasswordReset = async (email) => {
    // Check localStorage for user with this email (offline mode)
    const emailNorm = String(email || '').trim().toLowerCase()
    try {
      const usersJSON = localStorage.getItem('appUsers') || '[]'
      const users = JSON.parse(usersJSON)
      const found = users.find(u => u.email && u.email.toLowerCase() === emailNorm)
      if (found) {
        // mock behaviour: in production you'd send an email
        return { success: true }
      }
    } catch (err) {
      console.error('Error checking users:', err)
    }
    return { success: false }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, register, requestPasswordReset }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
