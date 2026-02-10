/**
 * Funciones de validación
 */

/**
 * Validar email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validar contraseña
 */
export const validatePassword = (password) => {
  // Mínimo 8 caracteres, al menos un número y una mayúscula
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/
  return passwordRegex.test(password)
}

/**
 * Validar teléfono
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  return phoneRegex.test(phone)
}

/**
 * Validar URL
 */
export const validateUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validar que un campo no esté vacío
 */
export const isNotEmpty = (value) => {
  return value && value.toString().trim().length > 0
}

/**
 * Validar longitud de string
 */
export const validateLength = (value, min, max) => {
  const length = value.toString().length
  return length >= min && length <= max
}

/**
 * Validar que el objeto tenga todos los campos requeridos
 */
export const validateRequiredFields = (obj, requiredFields) => {
  return requiredFields.every(field => {
    const value = obj[field]
    return value !== null && value !== undefined && value !== ''
  })
}

/**
 * Validar formato de fecha
 */
export const validateDate = (dateString) => {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date)
}

/**
 * Validar que dos valores sean iguales
 */
export const validateMatch = (value1, value2) => {
  return value1 === value2
}
