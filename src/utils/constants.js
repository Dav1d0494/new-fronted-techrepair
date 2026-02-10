/**
 * Constantes globales de la aplicación
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
export const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws'

export const ROLES = {
  ADMIN: 'administrador',
  TECHNICIAN: 'tecnico',
  CLIENT: 'cliente',
}

export const TICKET_STATUS = {
  OPEN: 'abierto',
  IN_PROGRESS: 'en_progreso',
  RESOLVED: 'resuelto',
  CLOSED: 'cerrado',
}

export const TICKET_PRIORITY = {
  LOW: 'baja',
  MEDIUM: 'media',
  HIGH: 'alta',
}

export const SESSION_TIMEOUT = import.meta.env.VITE_SESSION_TIMEOUT || 1800000 // 30 minutos

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
}

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
}

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
}
