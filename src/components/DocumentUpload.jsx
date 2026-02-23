import React, { useState } from 'react'

export default function DocumentUpload({ onUpload }) {
  const [file, setFile] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!file) return
    onUpload({ name: file.name, size: file.size, date: new Date().toISOString() })
    setFile(null)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="flex gap-2">
        <input type="file" className="flex-1" onChange={(e) => setFile(e.target.files[0])} />
        <button className="px-3 py-1 bg-acad-500 text-white rounded" type="submit">Upload</button>
      </div>
    </form>
  )
}
