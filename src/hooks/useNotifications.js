import { useCallback } from 'react'
import toast from 'react-hot-toast'

/**
 * Hook para mostrar notificaciones
 */
export function useNotifications() {
  const success = useCallback((message, options = {}) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      ...options,
    })
  }, [])

  const error = useCallback((message, options = {}) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
      ...options,
    })
  }, [])

  const info = useCallback((message, options = {}) => {
    toast(message, {
      icon: 'ℹ️',
      duration: 4000,
      position: 'top-right',
      ...options,
    })
  }, [])

  const loading = useCallback((message, options = {}) => {
    return toast.loading(message, {
      position: 'top-right',
      ...options,
    })
  }, [])

  const dismiss = useCallback((toastId) => {
    toast.dismiss(toastId)
  }, [])

  return {
    success,
    error,
    info,
    loading,
    dismiss,
  }
}
