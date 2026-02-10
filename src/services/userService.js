import apiClient from './api'

/**
 * Servicio de Usuarios
 */

export const userService = {
  /**
   * Obtener lista de usuarios
   */
  getUsers: async (params = {}) => {
    const response = await apiClient.get('/users', { params })
    return response.data
  },

  /**
   * Obtener usuario por ID
   */
  getUserById: async (id) => {
    const response = await apiClient.get(`/users/${id}`)
    return response.data
  },

  /**
   * Crear nuevo usuario
   */
  createUser: async (data) => {
    const response = await apiClient.post('/users', data)
    return response.data
  },

  /**
   * Actualizar usuario
   */
  updateUser: async (id, data) => {
    const response = await apiClient.put(`/users/${id}`, data)
    return response.data
  },

  /**
   * Eliminar usuario
   */
  deleteUser: async (id) => {
    const response = await apiClient.delete(`/users/${id}`)
    return response.data
  },

  /**
   * Obtener técnicos disponibles
   */
  getAvailableTechnicians: async () => {
    const response = await apiClient.get('/users/technicians/available')
    return response.data
  },

  /**
   * Cambiar rol de usuario
   */
  changeUserRole: async (id, role) => {
    const response = await apiClient.post(`/users/${id}/change-role`, { role })
    return response.data
  },

  /**
   * Activar/desactivar usuario
   */
  toggleUserStatus: async (id) => {
    const response = await apiClient.post(`/users/${id}/toggle-status`)
    return response.data
  },

  /**
   * Obtener estadísticas de usuarios
   */
  getStats: async () => {
    const response = await apiClient.get('/users/stats')
    return response.data
  },
}

export default userService
