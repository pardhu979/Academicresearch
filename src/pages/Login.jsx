import React, { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { validateEmail } from '../utils/validation'

export default function Login() {
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const emailNorm = String(email || '').trim().toLowerCase()
    const passwordTrim = String(password || '').trim()
    if (!emailNorm || !passwordTrim) {
      setError('Please fill all fields')
      return
    }
    if (!validateEmail(emailNorm)) {
      setError('Please enter a valid email address')
      return
    }
    if (passwordTrim.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try{
      // Get users from localStorage (offline mode)
      const usersJSON = localStorage.getItem('appUsers') || '[]'
      const users = JSON.parse(usersJSON)
      const found = users.find(u => u.email && String(u.email).trim().toLowerCase() === emailNorm)
      
      if (found && String(found.password) === passwordTrim) {
        const token = `mock-token-${found.id}`
        login({ id: found.id, name: found.name, email: found.email }, token)
      } else {
        setError('Invalid email or password')
      }
    }catch(err){
      console.error('[login] error', err)
      setError('Login failed')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="card">
        <h4 className="mb-3 text-lg font-semibold">Login</h4>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input className="w-full border border-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-acad-50" value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input type="password" className="w-full border border-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-acad-50" value={password} onChange={(e)=>setPassword(e.target.value)} />
          </div>
          <button className="px-4 py-2 bg-acad-500 text-white rounded inline-flex items-center" disabled={loading || !validateEmail((email||'').trim()) || (String(password||'').trim().length < 6)}>{loading ? 'Signing in...' : 'Login'}</button>
        </form>
        <div className="mt-3 text-sm flex justify-between">
          <div>
            Don't have an account? <Link to="/register" className="text-acad-500 font-medium">Sign Up</Link>
          </div>
          <div>
            <Link to="/forgot-password" className="text-acad-500">Forgot Password?</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
