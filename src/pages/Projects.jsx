import React, { useEffect, useState } from 'react'
import ProjectCard from '../components/ProjectCard.jsx'
import api from '../services/api'

export default function Projects(){
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let mounted = true
    api.get('/projects').then(res=>{
      if(mounted) setProjects(res.data)
    }).catch(()=>{}).finally(()=>mounted && setLoading(false))
    return ()=> mounted = false
  },[])

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-slate-800">Projects</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          {loading ? <div>Loading projects...</div> : projects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
        <aside className="card">
          <h6 className="font-semibold mb-3">Filters</h6>
          <p className="text-sm text-slate-600">Filter options coming soon.</p>
        </aside>
      </div>
    </div>
  )
}
