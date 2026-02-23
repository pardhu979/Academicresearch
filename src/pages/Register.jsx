import React, { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'
import api from '../services/api'

export default function Register() {
  const { login } = useContext(AuthContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!name || !email || !password) {
      setError('Please fill all fields')
      return
    }
    setLoading(true)
    try{
      const exists = await api.get(`/users?email=${encodeURIComponent(email)}`)
      if (exists.data && exists.data.length > 0) {
        setError('User already exists')
        setLoading(false)
        return
      }
      const res = await api.post('/users', { name, email, password })
      const user = res.data
      const token = `mock-token-${user.id}`
      login({ id: user.id, name: user.name, email: user.email }, token)
    }catch(err){
      setError('Registration failed')
    }finally{ setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="card">
        <h4 className="mb-3 text-lg font-semibold">Register</h4>
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
          </div>
          <button className="px-4 py-2 bg-acad-500 text-white rounded inline-flex items-center" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
        </form>
      </div>
    </div>
  )
}
