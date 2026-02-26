import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { validateEmail } from '../utils/validation'

export default function ForgotPassword(){
  const { requestPasswordReset } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    const emailNorm = String(email || '').trim().toLowerCase()
    if (!emailNorm) {
      setError('Please enter your email')
      return
    }
    if (!validateEmail(emailNorm)) {
      setError('Please enter a valid email')
      return
    }
    setLoading(true)
    try{
      const res = await requestPasswordReset(emailNorm)
      if (res.success) {
        setMessage('Password reset link sent (mock)')
      } else {
        setError('Email not found')
      }
    }catch(err){
      console.error('[ForgotPassword] error', err)
      setError('Request failed')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="card">
        <h4 className="mb-3 text-lg font-semibold">Forgot Password</h4>
        {message && <div className="text-green-600 mb-2">{message}</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input className="w-full border border-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-acad-50" value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>
          <button className="px-4 py-2 bg-acad-500 text-white rounded inline-flex items-center" disabled={loading || !validateEmail((email||'').trim())}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
        </form>
        <div className="mt-3 text-sm">
          Remembered your password? <Link to="/login" className="text-acad-500">Login</Link>
        </div>
      </div>
    </div>
  )
}
