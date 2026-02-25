import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

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
    const res = await api.get(`/users?email_like=${encodeURIComponent(emailNorm)}`)
    const exists = (res.data || []).find(u => u.email && u.email.toLowerCase() === emailNorm)
    if (exists) {
      throw new Error('Email already registered')
    }
    // create user (store normalized email)
    const createRes = await api.post('/users', { name, email: emailNorm, password })
    const created = createRes.data
    const token = `mock-token-${created.id}`
    login({ id: created.id, name: created.name, email: created.email }, token)
    return created
  }

  const requestPasswordReset = async (email) => {
    const res = await api.get(`/users?email_like=${encodeURIComponent(email)}`)
    const found = (res.data || []).find(u => u.email && u.email.toLowerCase() === String(email).toLowerCase())
    if (found) {
      // mock behaviour: in production you'd send an email
      return { success: true }
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
