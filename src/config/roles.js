// Archivo: src/config/roles.js

export const ROLES = {
  ADMIN: 'admin',
  TECNICO: 'tecnico',
  CLIENTE: 'cliente',
};

// Mapeo exacto de tus credenciales
export const getUserRole = (email) => {
  if (!email) return null;
  const normalizedEmail = email.toLowerCase().trim();

  if (normalizedEmail === 'cristian.alarcon@itegperformance.com') {
    return ROLES.ADMIN;
  } 
  // Soporte para ñ y n por si acaso
  if (normalizedEmail === 'nain.zuñiga@itegperformance.com' || normalizedEmail === 'nain.zuniga@itegperformance.com') {
    return ROLES.TECNICO;
  } 
  if (normalizedEmail === 'leonardo.martinez@gmail.com') {
    return ROLES.CLIENTE;
  }
  
  return ROLES.CLIENTE; // Por defecto, cualquier otro es cliente
};