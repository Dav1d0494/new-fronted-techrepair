import { useContext } from 'react'
import { WebSocketContext } from '../context/WebSocketContext'

/**
 * Hook para acceder al contexto de WebSocket
 */
export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket debe ser usado dentro de WebSocketProvider')
  }
  return context
}
