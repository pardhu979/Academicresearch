import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, AuthContext } from './context/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Projects from './pages/Projects.jsx'
import ProjectDetails from './pages/ProjectDetails.jsx'
import Documents from './pages/Documents.jsx'
import Messages from './pages/Messages.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import './App.css'

function PrivateRoute({ children }){
  const { user, loading } = useContext(AuthContext)
  if (loading) return <div className="p-4">Loading...</div>
  return user ? children : <Navigate to="/login" />
}

function AppLayout({children}){
  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 min-h-screen bg-slate-50">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default function App(){
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
          <Route path="/projects" element={<PrivateRoute><AppLayout><Projects /></AppLayout></PrivateRoute>} />
          <Route path="/projects/:id" element={<PrivateRoute><AppLayout><ProjectDetails /></AppLayout></PrivateRoute>} />
          <Route path="/documents" element={<PrivateRoute><AppLayout><Documents /></AppLayout></PrivateRoute>} />
          <Route path="/messages" element={<PrivateRoute><AppLayout><Messages /></AppLayout></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AppLayout><AdminDashboard /></AppLayout></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
