import React, { useState, useEffect } from 'react'
import DocumentUpload from '../components/DocumentUpload.jsx'
import api from '../services/api'

export default function Documents(){
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let mounted = true
    api.get('/documents').then(res=>{
      if(mounted) setFiles(res.data)
    }).catch(()=>{}).finally(()=>mounted && setLoading(false))
    return ()=> mounted = false
  },[])

  const handleUpload = async (f) => {
    try{
      const res = await api.post('/documents', { ...f, date: new Date().toISOString() })
      setFiles(prev => [res.data, ...prev])
    }catch(err){ }
  }

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-slate-800">Documents</h2>
      <div className="card mb-6">
        <h6 className="font-semibold mb-3">Upload Document</h6>
        <DocumentUpload onUpload={handleUpload} />
      </div>
      {loading ? <div className="text-center text-slate-600 py-8">Loading documents...</div> : (
        <div className="card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-600 border-b"><th className="pb-3">Name</th><th className="pb-3">Size</th><th className="pb-3">Uploaded</th><th className="pb-3"></th></tr>
            </thead>
            <tbody>
              {files.map((f)=>(
                <tr key={f.id} className="border-t hover:bg-slate-50"><td className="py-3">{f.name}</td><td className="py-3">{(f.size/1024).toFixed(1)} KB</td><td className="py-3">{new Date(f.date).toLocaleString()}</td><td className="py-3"><button className="text-sm text-acad-500 hover:underline">Download</button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
