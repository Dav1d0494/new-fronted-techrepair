/**
 * Funciones auxiliares de la aplicación
 */

/**
 * Formatear objeto de errores a mensaje de string
 */
export const formatErrors = (errors) => {
  if (typeof errors === 'string') return errors
  if (Array.isArray(errors)) return errors.join(', ')
  if (typeof errors === 'object') {
    return Object.values(errors).flatMap(e => Array.isArray(e) ? e : [e]).join(', ')
  }
  return 'Error desconocido'
}

/**
 * Obtener mensaje de error HTTP
 */
export const getErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message
  }
  if (error?.message) {
    return error.message
  }
  return 'Error en la solicitud'
}

/**
 * Debounce para funciones
 */
export const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Throttle para funciones
 */
export const throttle = (func, limit) => {
  let inThrottle
  return (...args) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Esperar tiempo
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Copiar al portapapeles
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Error copying to clipboard:', error)
    return false
  }
}

/**
 * Descargar archivo
 */
export const downloadFile = (data, filename) => {
  const url = URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Obtener parámetros de URL
 */
export const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search)
  const result = {}
  for (const [key, value] of params) {
    result[key] = value
  }
  return result
}

/**
 * Construir URL con parámetros
 */
export const buildQueryString = (params) => {
  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, value)
    }
  })
  return queryParams.toString()
}
