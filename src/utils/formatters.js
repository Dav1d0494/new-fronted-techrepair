/**
 * Funciones de formateo
 */

/**
 * Formatear fecha a string legible
 */
export const formatDate = (date, locale = 'es-ES') => {
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString(locale)
}

/**
 * Formatear fecha y hora
 */
export const formatDateTime = (date, locale = 'es-ES') => {
  const dateObj = new Date(date)
  return dateObj.toLocaleString(locale)
}

/**
 * Formatear hora
 */
export const formatTime = (date, locale = 'es-ES') => {
  const dateObj = new Date(date)
  return dateObj.toLocaleTimeString(locale)
}

/**
 * Formatear hace cuánto tiempo
 */
export const formatTimeAgo = (date) => {
  const now = new Date()
  const diffMs = now - new Date(date)
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'hace unos segundos'
  if (diffMins < 60) return `hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`
  if (diffHours < 24) return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
  if (diffDays < 7) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`

  return formatDate(date)
}

/**
 * Formatear moneda
 */
export const formatCurrency = (amount, currency = 'EUR', locale = 'es-ES') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Formatear número
 */
export const formatNumber = (number, decimals = 0) => {
  return Number(number).toFixed(decimals)
}

/**
 * Formatear bytes
 */
export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Capitalizar string
 */
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convertir a slug
 */
export const toSlug = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Truncar texto
 */
export const truncate = (str, length = 50, suffix = '...') => {
  if (str.length <= length) return str
  return str.substring(0, length) + suffix
}

/**
 * Formatear duraciones
 */
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const parts = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (secs > 0) parts.push(`${secs}s`)

  return parts.join(' ') || '0s'
}
