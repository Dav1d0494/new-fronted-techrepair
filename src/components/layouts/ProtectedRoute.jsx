import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserRole } from '../config/roles';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-10 text-center">Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const role = getUserRole(user.email);

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Si no tiene permiso, lo mandamos a su área correspondiente
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'tecnico') return <Navigate to="/tecnico/tareas" replace />;
    return <Navigate to="/home" replace />;
  }

  return children;
}