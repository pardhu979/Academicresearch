import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import DocumentUpload from '../components/DocumentUpload'
import ChatBox from '../components/ChatBox'
import api from '../services/api'

export default function ProjectDetails(){
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [files, setFiles] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
}
export { default } from './ProjectDetails.jsx'
}
