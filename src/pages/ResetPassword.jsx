import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { passwordFeedback, isPasswordStrong } from '../utils/validation'

export default function ResetPassword() {
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    if (!token.trim() || !password.trim()) {
      setError('Please fill all fields')
      return
    }
    const feedback = passwordFeedback(password.trim())
    if (feedback) {
      setError(feedback)
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/auth/reset-password', { token: token.trim(), newPassword: password.trim() })
      if (res.data?.success) {
        setMessage('Password updated, you can now log in')
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setError('Unable to reset password')
      }
    } catch (err) {
      console.error('[ResetPassword] error', err)
      setError(err.response?.data?.error || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="card">
        <h4 className="mb-3 text-lg font-semibold">Reset Password</h4>
        {message && <div className="text-green-600 mb-2">{message}</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Reset Token</label>
            <input value={token} onChange={e => setToken(e.target.value)} className="w-full border border-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-acad-50" />
          </div>
          <div>
            <label className="block text-sm mb-1">New Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border border-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-acad-50" />
            <div className="text-xs mt-1">
              {password ? (isPasswordStrong(password) ? <span className="text-green-600">Looks good</span> : <span className="text-yellow-600">{passwordFeedback(password)}</span>) : <span className="text-gray-500">At least 6 chars and a number</span>}
            </div>
          </div>
          <button className="px-4 py-2 bg-acad-500 text-white rounded inline-flex items-center" disabled={loading || !token.trim() || !isPasswordStrong(password)}>{loading ? 'Updating...' : 'Update Password'}</button>
        </form>
        <div className="mt-3 text-sm">
          <Link to="/login" className="text-acad-500">Back to login</Link>
        </div>
      </div>
    </div>
  )
}
