import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import DocumentUpload from '../components/DocumentUpload.jsx'
import ChatBox from '../components/ChatBox.jsx'
import api from '../services/api'

export default function ProjectDetails(){
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [files, setFiles] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let mounted = true
    Promise.all([
      api.get(`/projects/${id}`),
      api.get(`/documents?projectId=${id}`),
      api.get(`/messages?projectId=${id}`),
    ]).then(([p, docs, msgs])=>{
      if(!mounted) return
      setProject(p.data)
      setFiles(docs.data)
      setMessages(msgs.data)
    }).catch(()=>{}).finally(()=> mounted && setLoading(false))
    return ()=> mounted = false
  },[id])

  const handleUpload = async (fileMeta) => {
    try{
      const payload = { ...fileMeta, projectId: Number(id) }
      const res = await api.post('/documents', payload)
      setFiles(prev => [res.data, ...prev])
    }catch(err){ }
  }

  const handleSend = async (msg) => {
    try{
      const payload = { ...msg, projectId: Number(id) }
      const res = await api.post('/messages', payload)
      setMessages(prev => [...prev, res.data])
    }catch(err){ }
  }

  if(loading) return <div className="text-center text-slate-600 py-8">Loading project...</div>
  if(!project) return <div className="text-center text-slate-600 py-8">Project not found</div>

  return (
    <div>
      <h2 className="mb-2 text-3xl font-bold text-slate-800">{project.title}</h2>
      <p className="text-slate-600 mb-6">{project.description}</p>
      
      <div className="mb-6 card bg-slate-100">
        <h6 className="font-semibold text-sm mb-2">Team Members</h6>
        <div className="flex gap-4 text-sm">
          <span>1. BOMMA NAGA VENKATA SAI PARDHA SARADHI</span>
          <span>2. KOKKILIGADDA VENKATA RAMA RAJU</span>
          <span>3. CHOLLANGI PARDHU SWAROOP</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h6 className="font-semibold mb-3">Documents</h6>
          <DocumentUpload onUpload={handleUpload} />
          <ul className="space-y-2">
            {files.map((f) => (
              <li key={f.id} className="flex justify-between items-start p-2 border rounded hover:bg-slate-50">
                <div>
                  <strong className="text-sm">{f.name}</strong>
                  <div className="text-xs text-slate-500">{(f.size/1024).toFixed(1)} KB • {new Date(f.date).toLocaleString()}</div>
                </div>
                <button className="text-xs text-acad-500 whitespace-nowrap ml-2">Download</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h6 className="font-semibold mb-3">Chat</h6>
          <ChatBox messages={messages} onSend={handleSend} />
        </div>
      </div>
    </div>
  )
}
