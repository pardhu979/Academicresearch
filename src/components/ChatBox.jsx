import React, { useState, useRef, useEffect } from 'react'

export default function ChatBox({ messages = [], onSend }) {
  const [text, setText] = useState('')
  const boxRef = useRef()

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight
  }, [messages])

  const send = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onSend({ text: text.trim(), date: new Date().toISOString(), sender: 'me' })
    setText('')
  }

  return (
    <div>
      <div ref={boxRef} className="mb-3 p-3 rounded bg-slate-50 overflow-y-auto" style={{height:240}}>
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-2 rounded ${m.sender === 'me' ? 'bg-acad-500 text-white' : 'bg-white border'}`} style={{maxWidth: '75%'}}>
              <div className="text-sm">{m.text}</div>
              <small className="text-xs text-slate-400">{new Date(m.date).toLocaleString()}</small>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={send} className="flex gap-2">
        <input className="flex-1 px-3 py-2 border rounded" value={text} onChange={(e)=>setText(e.target.value)} placeholder="Type a message" />
        <button className="px-4 py-2 bg-acad-500 text-white rounded" type="submit">Send</button>
      </form>
    </div>
  )
}
