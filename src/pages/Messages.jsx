import React, { useState, useEffect } from 'react'
import ChatBox from '../components/ChatBox.jsx'
import api from '../services/api'

export default function Messages(){
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let mounted = true
    api.get('/messages').then(res=>{ if(mounted) setMessages(res.data) }).catch(()=>{}).finally(()=>mounted && setLoading(false))
    return ()=> mounted = false
  },[])

  const handleSend = async (m) => {
    try{
      const res = await api.post('/messages', m)
      setMessages(prev => [...prev, res.data])
    }catch(err){ }
  }

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-slate-800">Messages</h2>
      {loading ? <div className="text-center text-slate-600 py-8">Loading messages...</div> : (
        <div className="card">
          <ChatBox messages={messages} onSend={handleSend} />
        </div>
      )}
    </div>
  )
}
