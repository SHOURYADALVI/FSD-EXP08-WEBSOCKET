import React, { useEffect, useMemo, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:3001'

export default function App() {
  const socket = useMemo(() => io(SOCKET_URL, { autoConnect: false }), [])
  const [isConnected, setIsConnected] = useState(false)
  const [socketId, setSocketId] = useState('')
  const [username, setUsername] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    socket.connect()

    socket.on('connect', () => {
      setIsConnected(true)
      setSocketId(socket.id)
      console.log('✅ Connected to server')
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
      console.log('❌ Disconnected from server')
    })

    socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error.message)
      setIsConnected(false)
    })

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, { ...data, timestamp: new Date() }])
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('connect_error')
      socket.off('receive_message')
      socket.disconnect()
    }
  }, [socket])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend(e) {
    e.preventDefault()
    const trimmed = messageInput.trim()
    if (!trimmed) return
    const outgoing = {
      id: crypto.randomUUID(),
      text: trimmed,
      senderId: socketId,
      senderName: username || 'Anonymous',
      timestamp: new Date()
    }
    socket.emit('send_message', outgoing)
    setMessageInput('')
    inputRef.current?.focus()
  }

  function formatTime(date) {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  return (
    <div className="app">
      <header className="header">
        <h1>💬 Chat App</h1>
        <div className="statusContainer">
          <div className={`status ${isConnected ? 'online' : 'offline'}`}></div>
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </header>

      <section className="controls">
        <label className="nameLabel">
          Name
          <input
            className="nameInput"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
      </section>

      <section className="messages">
        {messages.length === 0 ? (
          <div className="emptyState">
            <div className="emptyStateIcon">💭</div>
            <div className="emptyStateText">
              <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No messages yet</p>
              <p>Start chatting by sending a message below!</p>
            </div>
          </div>
        ) : (
          messages.map((m) => {
            const isSelf = m.senderId === socketId
            return (
              <div key={m.id} className={`row ${isSelf ? 'self' : 'other'}`}>
                {!isSelf && (
                  <div className="avatar" title={m.senderName}>
                    {m.senderName?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                <div className={`bubble ${isSelf ? 'right' : 'left'}`}>
                  {!isSelf && <div className="meta">{m.senderName}</div>}
                  <div className="text">{m.text}</div>
                  {m.timestamp && <div className="time">{formatTime(m.timestamp)}</div>}
                </div>
                {isSelf && (
                  <div className="avatar selfAvatar" title="You">
                    {username?.[0]?.toUpperCase() || 'Y'}
                  </div>
                )}
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </section>

      <form className="composer" onSubmit={handleSend}>
        <input
          ref={inputRef}
          className="messageInput"
          placeholder={username ? `Type a message, ${username}...` : 'Enter your name above to start chatting...'}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          disabled={!isConnected}
          autoFocus
        />
        <button 
          className="sendBtn" 
          type="submit"
          disabled={!messageInput.trim() || !isConnected}
        >
          Send
        </button>
      </form>
    </div>
  )
}


