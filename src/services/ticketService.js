import apiClient from './api'

/**
 * Servicio de Tickets
 */

export const ticketService = {
  /**
   * Obtener lista de tickets
   */
  getTickets: async (params = {}) => {
    const response = await apiClient.get('/tickets', { params })
    return response.data
  },

  /**
   * Obtener ticket por ID
   */
  getTicketById: async (id) => {
    const response = await apiClient.get(`/tickets/${id}`)
    return response.data
  },

  /**
   * Crear nuevo ticket
   */
  createTicket: async (data) => {
    const response = await apiClient.post('/tickets', data)
    return response.data
  },

  /**
   * Actualizar ticket
   */
  updateTicket: async (id, data) => {
    const response = await apiClient.put(`/tickets/${id}`, data)
    return response.data
  },

  /**
   * Cerrar ticket
   */
  closeTicket: async (id, data) => {
    const response = await apiClient.post(`/tickets/${id}/close`, data)
    return response.data
  },

  /**
   * Asignar ticket a técnico
   */
  assignTicket: async (id, technicianId) => {
    const response = await apiClient.post(`/tickets/${id}/assign`, { technicianId })
    return response.data
  },

  /**
   * Agregar comentario a ticket
   */
  addComment: async (id, comment) => {
    const response = await apiClient.post(`/tickets/${id}/comments`, { comment })
    return response.data
  },

  /**
   * Obtener comentarios de ticket
   */
  getComments: async (id) => {
    const response = await apiClient.get(`/tickets/${id}/comments`)
    return response.data
  },

  /**
   * Buscar tickets
   */
  searchTickets: async (query) => {
    const response = await apiClient.get('/tickets/search', { params: { q: query } })
    return response.data
  },

  /**
   * Obtener estadísticas de tickets
   */
  getStats: async () => {
    const response = await apiClient.get('/tickets/stats')
    return response.data
  },
}

export default ticketService
