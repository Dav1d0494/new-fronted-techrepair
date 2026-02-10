/**
 * Control de permisos y roles
 */

export const PERMISSIONS = {
  // Tickets
  VIEW_TICKETS: 'view_tickets',
  CREATE_TICKET: 'create_ticket',
  EDIT_TICKET: 'edit_ticket',
  DELETE_TICKET: 'delete_ticket',
  ASSIGN_TICKET: 'assign_ticket',
  CLOSE_TICKET: 'close_ticket',

  // Usuarios
  VIEW_USERS: 'view_users',
  CREATE_USER: 'create_user',
  EDIT_USER: 'edit_user',
  DELETE_USER: 'delete_user',
  CHANGE_USER_ROLE: 'change_user_role',

  // Conexiones
  START_CONNECTION: 'start_connection',
  END_CONNECTION: 'end_connection',
  VIEW_CONNECTIONS: 'view_connections',

  // Sistema
  VIEW_REPORTS: 'view_reports',
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_ANALYTICS: 'view_analytics',
}

/**
 * Mapeo de roles a permisos
 */
export const ROLE_PERMISSIONS = {
  administrador: [
    PERMISSIONS.VIEW_TICKETS,
    PERMISSIONS.CREATE_TICKET,
    PERMISSIONS.EDIT_TICKET,
    PERMISSIONS.DELETE_TICKET,
    PERMISSIONS.ASSIGN_TICKET,
    PERMISSIONS.CLOSE_TICKET,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.EDIT_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.CHANGE_USER_ROLE,
    PERMISSIONS.START_CONNECTION,
    PERMISSIONS.END_CONNECTION,
    PERMISSIONS.VIEW_CONNECTIONS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  tecnico: [
    PERMISSIONS.VIEW_TICKETS,
    PERMISSIONS.CREATE_TICKET,
    PERMISSIONS.EDIT_TICKET,
    PERMISSIONS.ASSIGN_TICKET,
    PERMISSIONS.CLOSE_TICKET,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.START_CONNECTION,
    PERMISSIONS.END_CONNECTION,
    PERMISSIONS.VIEW_CONNECTIONS,
    PERMISSIONS.VIEW_REPORTS,
  ],
  cliente: [
    PERMISSIONS.VIEW_TICKETS,
    PERMISSIONS.CREATE_TICKET,
    PERMISSIONS.VIEW_CONNECTIONS,
  ],
}

/**
 * Verificar si el usuario tiene un permiso
 */
export const hasPermission = (userRole, permission) => {
  const permissions = ROLE_PERMISSIONS[userRole] || []
  return permissions.includes(permission)
}

/**
 * Verificar si el usuario tiene alguno de los permisos
 */
export const hasAnyPermission = (userRole, permissions) => {
  return permissions.some(permission => hasPermission(userRole, permission))
}

/**
 * Verificar si el usuario tiene todos los permisos
 */
export const hasAllPermissions = (userRole, permissions) => {
  return permissions.every(permission => hasPermission(userRole, permission))
}

/**
 * Obtener permisos del usuario por rol
 */
export const getUserPermissions = (userRole) => {
  return ROLE_PERMISSIONS[userRole] || []
}
