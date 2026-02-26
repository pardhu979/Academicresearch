import React, { useState, useEffect } from 'react'
import api from '../services/api'

export default function AdminDashboard(){
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let mounted = true
    api.get('/projects').then(res=>{ if(mounted) setProjects(res.data) }).catch(()=>{}).finally(()=>mounted && setLoading(false))
    api.get('/users').then(res=>{ if(mounted) setUsers(res.data) }).catch(()=>{})
    return ()=> mounted = false
  },[])

  const addProject = async (e) => {
    e.preventDefault()
    if(!title) return
    try{
      const res = await api.post('/projects', { title, shortDescription: '', status: 'Ongoing', description: '' })
      setProjects(prev => [...prev, res.data])
      setTitle('')
    }catch(err){ }
  }

  const deleteProject = async (id) => {
    try{
      await api.delete(`/projects/${id}`)
      setProjects(prev => prev.filter(p=>p.id!==id))
    }catch(err){ }
  }

  const deleteUser = async (id) => {
    try{
      // the mock server doesn't have user deletion yet; simulate by filtering locally
      await api.delete(`/users/${id}`) // implement server handling if desired
      setUsers(prev=>prev.filter(u=>u.id !== id))
    }catch(err){
      console.error('failed to delete user', err)
    }
  }

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-slate-800">Admin Dashboard</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="card mb-6">
            <h6 className="font-semibold mb-3">Create Project</h6>
            <form onSubmit={addProject} className="flex gap-2">
              <input className="flex-1 border border-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-acad-50" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Project title" />
              <button className="px-4 py-2 bg-acad-500 text-white rounded hover:bg-acad-700">Create</button>
            </form>
          </div>
          <div className="card mb-6">
            <h6 className="font-semibold mb-3">All Projects</h6>
            {loading ? <div className="text-center text-slate-600 py-4">Loading...</div> : (
              <div className="space-y-2">
                {projects.map(p=> (
                  <div key={p.id} className="flex justify-between items-center p-3 border rounded hover:bg-slate-50">
                    <span className="font-medium">{p.title}</span>
                    <button className="text-sm text-red-600 hover:text-red-800 font-medium" onClick={()=>deleteProject(p.id)}>Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="card">
            <h6 className="font-semibold mb-3">Researchers</h6>
            {users.length === 0 ? <p className="text-slate-600">No users</p> : (
              <div className="space-y-2">
                {users.map(u => (
                  <div key={u.id} className="flex justify-between items-center p-3 border rounded hover:bg-slate-50">
                    <span className="font-medium">{u.name} ({u.role})</span>
                    <button className="text-sm text-red-600 hover:text-red-800 font-medium" onClick={() => deleteUser(u.id)}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="card">
            <h6 className="font-semibold mb-4">Platform Stats</h6>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-600 font-medium">TOTAL USERS</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">TOTAL PROJECTS</p>
                <p className="text-2xl font-bold">{projects.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
