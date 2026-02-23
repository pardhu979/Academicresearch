import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="sidebar hidden md:block">
      <h5 className="brand mb-4">Navigation</h5>
      <nav className="flex flex-col gap-2">
        <NavLink to="/dashboard" className={({isActive})=>`px-3 py-2 rounded ${isActive? 'bg-acad-50 text-acad-700' : 'text-slate-700 hover:bg-slate-100'}`}>Dashboard</NavLink>
        <NavLink to="/projects" className={({isActive})=>`px-3 py-2 rounded ${isActive? 'bg-acad-50 text-acad-700' : 'text-slate-700 hover:bg-slate-100'}`}>Projects</NavLink>
        <NavLink to="/documents" className={({isActive})=>`px-3 py-2 rounded ${isActive? 'bg-acad-50 text-acad-700' : 'text-slate-700 hover:bg-slate-100'}`}>Documents</NavLink>
        <NavLink to="/messages" className={({isActive})=>`px-3 py-2 rounded ${isActive? 'bg-acad-50 text-acad-700' : 'text-slate-700 hover:bg-slate-100'}`}>Messages</NavLink>
        <NavLink to="/admin" className={({isActive})=>`px-3 py-2 rounded ${isActive? 'bg-acad-50 text-acad-700' : 'text-slate-700 hover:bg-slate-100'}`}>Admin</NavLink>
      </nav>
    </aside>
  )
}
