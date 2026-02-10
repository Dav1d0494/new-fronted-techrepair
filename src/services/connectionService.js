import apiClient from './api'

/**
 * Servicio de Conexiones Remotas
 */

export const connectionService = {
  /**
   * Obtener lista de conexiones
   */
  getConnections: async (params = {}) => {
    const response = await apiClient.get('/connections', { params })
    return response.data
  },

  /**
   * Obtener conexión por ID
   */
  getConnectionById: async (id) => {
    const response = await apiClient.get(`/connections/${id}`)
    return response.data
  },

  /**
   * Crear nueva conexión
   */
  createConnection: async (data) => {
    const response = await apiClient.post('/connections', data)
    return response.data
  },

  /**
   * Iniciar sesión remota
   */
  startSession: async (connectionId) => {
    const response = await apiClient.post(`/connections/${connectionId}/start`)
    return response.data
  },

  /**
   * Finalizar sesión remota
   */
  endSession: async (connectionId) => {
    const response = await apiClient.post(`/connections/${connectionId}/end`)
    return response.data
  },

  /**
   * Solicitar acceso remoto
   */
  requestAccess: async (data) => {
    const response = await apiClient.post('/connections/request-access', data)
    return response.data
  },

  /**
   * Aprobar acceso remoto
   */
  approveAccess: async (requestId) => {
    const response = await apiClient.post(`/connections/approve/${requestId}`)
    return response.data
  },

  /**
   * Rechazar acceso remoto
   */
  denyAccess: async (requestId) => {
    const response = await apiClient.post(`/connections/deny/${requestId}`)
    return response.data
  },

  /**
   * Obtener historial de conexiones
   */
  getHistory: async (params = {}) => {
    const response = await apiClient.get('/connections/history', { params })
    return response.data
  },

  /**
   * Obtener estadísticas de conexiones
   */
  getStats: async () => {
    const response = await apiClient.get('/connections/stats')
    return response.data
  },
}

export default connectionService
