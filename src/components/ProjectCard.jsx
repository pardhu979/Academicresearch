import React from 'react'
import { Link } from 'react-router-dom'

export default function ProjectCard({ project }) {
  return (
    <article className="card mb-4">
      <div className="flex items-start justify-between">
        <div>
          <h5 className="text-lg font-semibold">{project.title}</h5>
          <p className="text-sm text-slate-500">{project.shortDescription}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-600">Status: <span className="font-medium">{project.status}</span></div>
          <Link to={`/projects/${project.id}`} className="inline-block mt-2 px-3 py-1 text-sm bg-acad-500 text-white rounded">View</Link>
        </div>
      </div>
    </article>
  )
}
