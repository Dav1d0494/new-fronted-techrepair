import { useLocalStorage } from '../hooks/useLocalStorage'

/**
 * Servicio para sincronización offline
 * Almacena las acciones cuando no hay conexión
 */

export const offlineService = {
  /**
   * Guardar acción pendiente
   */
  savePendingAction: (action, data) => {
    const [pendingActions, setPendingActions] = useLocalStorage('pending_actions', [])
    
    const newAction = {
      id: Date.now(),
      action,
      data,
      timestamp: new Date().toISOString(),
    }
    
    setPendingActions([...pendingActions, newAction])
    return newAction
  },

  /**
   * Obtener acciones pendientes
   */
  getPendingActions: () => {
    const [pendingActions] = useLocalStorage('pending_actions', [])
    return pendingActions
  },

  /**
   * Eliminar acción pendiente
   */
  removePendingAction: (id) => {
    const [pendingActions, setPendingActions] = useLocalStorage('pending_actions', [])
    setPendingActions(pendingActions.filter(action => action.id !== id))
  },

  /**
   * Limpiar todas las acciones pendientes
   */
  clearPendingActions: () => {
    localStorage.removeItem('pending_actions')
  },

  /**
   * Guardar datos en caché
   */
  cacheData: (key, data) => {
    const cacheEntry = {
      data,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(`cache_${key}`, JSON.stringify(cacheEntry))
  },

  /**
   * Obtener datos cacheados
   */
  getCachedData: (key, maxAge = 3600000) => {
    const cached = localStorage.getItem(`cache_${key}`)
    if (!cached) return null

    try {
      const cacheEntry = JSON.parse(cached)
      const age = Date.now() - new Date(cacheEntry.timestamp).getTime()
      
      if (age > maxAge) {
        localStorage.removeItem(`cache_${key}`)
        return null
      }

      return cacheEntry.data
    } catch (error) {
      console.error('Error reading cache:', error)
      return null
    }
  },

  /**
   * Verificar estado de conexión
   */
  isOnline: () => {
    return navigator.onLine
  },

  /**
   * Escuchar cambios de conexión
   */
  onConnectionChange: (callback) => {
    window.addEventListener('online', () => callback(true))
    window.addEventListener('offline', () => callback(false))

    return () => {
      window.removeEventListener('online', () => callback(true))
      window.removeEventListener('offline', () => callback(false))
    }
  },
}

export default offlineService
