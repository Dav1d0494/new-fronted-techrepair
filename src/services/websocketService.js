/**
 * Servicio de WebSocket
 * Maneja eventos en tiempo real
 */

class WebSocketService {
  constructor() {
    this.socket = null
    this.listeners = {}
  }

  /**
   * Conectar al servidor WebSocket
   */
  connect(socket) {
    this.socket = socket
    
    // Registrar todos los listeners previos
    Object.entries(this.listeners).forEach(([event, callbacks]) => {
      callbacks.forEach(callback => {
        this.socket.on(event, callback)
      })
    })
  }

  /**
   * Desconectar del servidor WebSocket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  /**
   * Escuchar evento
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)

    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  /**
   * Escuchar evento una sola vez
   */
  once(event, callback) {
    if (this.socket) {
      this.socket.once(event, callback)
    }
  }

  /**
   * Dejar de escuchar evento
   */
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback)
    }
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }

  /**
   * Emitir evento
   */
  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data)
    }
  }

  /**
   * Obtener estado de conexión
   */
  isConnected() {
    return this.socket?.connected || false
  }
}

export default new WebSocketService()
