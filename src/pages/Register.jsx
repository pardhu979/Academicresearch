import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { validateEmail, passwordFeedback, isPasswordStrong } from '../utils/validation'

export default function Register(){
  const { register } = useContext(AuthContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [adminCode, setAdminCode] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const nameTrim = String(name || '').trim()
    const emailNorm = String(email || '').trim().toLowerCase()
    const passwordTrim = String(password || '').trim()
    if (!nameTrim || !emailNorm || !passwordTrim) {
      setError('Please fill all fields')
      return
    }
    if (!validateEmail(emailNorm)) {
      setError('Please enter a valid email')
      return
    }
    const pwFeedback = passwordFeedback(passwordTrim)
    if (pwFeedback) {
      setError(pwFeedback)
      return
    }
    setLoading(true)
    try{
      // determine role; a real app would verify separately
      const role = adminCode === 'ADMIN123' ? 'admin' : 'researcher'
      await register({ name: nameTrim, email: emailNorm, password: passwordTrim, role })
      // register will auto-login and navigate
    }catch(err){
      let errorMsg = 'Registration failed'
      
      if (err.response?.status === 409) {
        errorMsg = 'Email already registered'
      } else if (err.response?.status === 400) {
        errorMsg = err.response.data?.error || 'Invalid input'
      } else if (err.message?.includes('Network error')) {
        errorMsg = err.message
      } else if (err.message?.includes('Cannot connect')) {
        errorMsg = err.message
      } else if (err.message?.includes('timeout')) {
        errorMsg = 'Request timeout. Server is slow to respond.'
      } else {
        errorMsg = err?.response?.data?.error || err?.message || 'Registration failed'
      }
      
      setError(errorMsg)
      console.error('[Register] Error:', err)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="card">
        <h4 className="mb-3 text-lg font-semibold">Sign Up</h4>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input className="w-full border border-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-acad-50" value={name} onChange={(e)=>setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input className="w-full border border-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-acad-50" value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input type="password" className="w-full border border-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-acad-50" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <div className="text-xs mt-1">
              {password ? (isPasswordStrong(password) ? <span className="text-green-600">Looks good</span> : <span className="text-yellow-600">{passwordFeedback(password)}</span>) : <span className="text-gray-500">At least 6 chars and a number</span>}
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Admin Code (optional)</label>
            <input className="w-full border border-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-acad-50" value={adminCode} onChange={(e)=>setAdminCode(e.target.value)} placeholder="leave blank for researcher" />
          </div>
          <button className="px-4 py-2 bg-acad-500 text-white rounded inline-flex items-center" disabled={loading || !name.trim() || !validateEmail(email) || !isPasswordStrong(password)}>{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <div className="mt-3 text-sm">
          Already have an account? <Link to="/login" className="text-acad-500">Login</Link>
        </div>
      </div>
    </div>
  )
}
