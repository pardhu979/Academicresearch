import React, { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { validateEmail } from '../utils/validation'

export default function Login() {
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('researcher') // chosen role tab
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
      const res = await api.post('/auth/login', { email: emailNorm, password: passwordTrim })
      const { user: userData, token } = res.data
      // ensure user role matches the selected tab
      if (userData.role !== role) {
        setError(`You are logging in as a ${userData.role}. Please choose the correct role above.`)
      } else {
        login(userData, token)
      }
    }catch(err){
      console.error('[login] error', err)
      if (err.response && err.response.status === 401) {
        setError('Invalid email or password')
      } else {
        setError('Login failed')
      }
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="card">
        <h4 className="mb-3 text-lg font-semibold">Login</h4>
        {/* role selector tabs */}
        <div className="mb-4 flex space-x-4">
          <button
            type="button"
            className={`px-3 py-1 rounded ${role==='researcher' ? 'bg-acad-500 text-white' : 'bg-gray-200'}`}
            onClick={()=>setRole('researcher')}
          >Researcher</button>
          <button
            type="button"
            className={`px-3 py-1 rounded ${role==='admin' ? 'bg-acad-500 text-white' : 'bg-gray-200'}`}
            onClick={()=>setRole('admin')}
          >Admin</button>
        </div>
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
