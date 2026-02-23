import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  return (
    <header className="bg-gradient-to-r from-acad-600 to-acad-700 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <Link className="text-2xl font-bold text-white drop-shadow-sm" to="/dashboard">
          🎓 AcademicCollab
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate-600">{user.name}</span>
              <button className="px-3 py-1 border rounded text-sm text-slate-700 hover:bg-slate-50" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="text-sm text-slate-600 hover:text-acad-700" to="/login">Login</Link>
              <Link className="text-sm text-acad-500 font-medium" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
