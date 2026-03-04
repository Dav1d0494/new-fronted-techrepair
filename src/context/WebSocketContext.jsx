import React, { createContext, useEffect, useState, useCallback, useRef } from 'react'
import { io } from 'socket.io-client'

/**
 * WebSocketContext - Maneja la conexión WebSocket
 */
export const WebSocketContext = createContext(null)

export function WebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef(null)

  useEffect(() => {
    // Inicializar conexión WebSocket
    const resolveWsUrl = () => {
      const envUrl = import.meta.env.VITE_WS_URL
      if (envUrl) {
        try {
          const parsed = new URL(envUrl)
          if (parsed.hostname === 'localhost' && typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
            parsed.hostname = window.location.hostname
            return parsed.toString()
          }
          return envUrl
        } catch (_error) {
          return envUrl
        }
      }

      if (typeof window !== 'undefined') {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        return `${protocol}//${window.location.hostname}:8080/ws`
      }

      return 'ws://localhost:8080/ws'
    }

    const wsUrl = resolveWsUrl()
    const token = localStorage.getItem('token')

    if (!token) return

    const newSocket = io(wsUrl, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    })

    newSocket.on('connect', () => {
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
    })

    newSocket.on('error', (error) => {
      console.error('WebSocket error:', error)
    })

    socketRef.current = newSocket
    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  const emit = useCallback((event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data)
    }
  }, [])

  const on = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback)
      return () => socketRef.current.off(event, callback)
    }
  }, [])

  const value = {
    socket,
    isConnected,
    emit,
    on,
  }

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  )
}
