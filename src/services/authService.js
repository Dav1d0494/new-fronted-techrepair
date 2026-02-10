import apiClient from './api'

/**
 * Servicio de Autenticación
 */

export const authService = {
  /**
   * Registrar un nuevo usuario
   */
  register: async (data) => {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  /**
   * Iniciar sesión
   * - En entorno de desarrollo (`import.meta.env.DEV`) acepta credenciales mock
   *   para pruebas sin backend. Si no hay match, cae al API real.
   */
  login: async (email, password) => {
    // Mocks de desarrollo (según petición del usuario)
    if (import.meta.env.DEV) {
      const mocks = [
        {
          email: 'Cristian.alarcon@itegperformance.com',
          password: 'Admin0001',
          role: 'admin',
          name: 'Cristian Alarcón',
        },
        {
          email: 'Nain.zuñiga@itegperformance.com',
          password: 'Performance2026#',
          role: 'technician',
          name: 'Nain Zuñiga',
        },
        {
          email: 'leonardo.martinez@gmail.com',
          password: 'leonardom00',
          role: 'user',
          name: 'Leonardo Martínez',
        },
      ]

      const match = mocks.find(
        (m) => m.email.toLowerCase() === String(email).toLowerCase() && m.password === password,
      )

      if (match) {
        // Simular respuesta del servidor
        return {
          user: {
            id: match.email,
            name: match.name,
            email: match.email,
            role: match.role,
          },
          token: `dev-token-${match.role}-${Date.now()}`,
        }
      }
      // Si no matchea, caerá al API real (útil si quieres probar con backend)
    }

    const response = await apiClient.post('/auth/login', { email, password })
    return response.data
  },

  /**
   * Cerrar sesión
   */
  logout: async () => {
    const response = await apiClient.post('/auth/logout')
    return response.data
  },

  /**
   * Verificar email
   */
  verifyEmail: async (code) => {
    const response = await apiClient.post('/auth/verify-email', { code })
    return response.data
  },

  /**
   * Solicitar recuperación de contraseña
   */
  requestPasswordReset: async (email) => {
    const response = await apiClient.post('/auth/request-password-reset', { email })
    return response.data
  },

  /**
   * Restablecer contraseña
   */
  resetPassword: async (token, newPassword) => {
    const response = await apiClient.post('/auth/reset-password', { token, newPassword })
    return response.data
  },

  /**
   * Refrescar token
   */
  refreshToken: async () => {
    const response = await apiClient.post('/auth/refresh-token')
    return response.data
  },

  /**
   * Obtener perfil actual
   */
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile')
    return response.data
  },

  /**
   * Actualizar perfil
   */
  updateProfile: async (data) => {
    const response = await apiClient.put('/auth/profile', data)
    return response.data
  },
}

export default authService
