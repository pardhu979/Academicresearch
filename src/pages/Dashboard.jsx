import React from 'react'
import ProjectCard from '../components/ProjectCard.jsx'

const dummyProjects = [
  { id: 1, title: 'Quantum Materials', shortDescription: 'Study of 2D superconductors', status: 'Ongoing' },
  { id: 2, title: 'AI for Biology', shortDescription: 'ML models for genomics', status: 'Completed' },
]

export default function Dashboard(){
  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-slate-800">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <h6 className="text-sm">Total Projects</h6>
          <h3 className="text-2xl font-semibold">{dummyProjects.length}</h3>
        </div>
        <div className="card text-center">
          <h6 className="text-sm">Active Users</h6>
          <h3 className="text-2xl font-semibold">12</h3>
        </div>
        <div className="card text-center">
          <h6 className="text-sm">Recent Activity</h6>
          <p className="text-sm text-slate-500">No recent activity.</p>
        </div>
      </div>

      <h5 className="text-xl font-bold mb-4">Recent Projects</h5>
      <div className="space-y-3">
        {dummyProjects.map(p => <ProjectCard key={p.id} project={p} />)}
      </div>
    </div>
  )
}
