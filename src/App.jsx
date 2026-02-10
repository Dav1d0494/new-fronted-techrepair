import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Importaciones de páginas
import Login from './pages/Login';
import Register from './pages/Register'; 
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword'; 
// import Settings from './pages/Settings'; // Descomenta cuando el archivo exista

// CORRECCIÓN DE RUTAS: Usamos ./layout/ porque así está en tu carpeta
import AppLayout from './layout/AppLayout';
import ProtectedRoute from './layout/ProtectedRoute';
import { ROLES } from './config/roles';

function App() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Iniciando TechRepair...</div>}>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* RUTAS PROTEGIDAS CON LAYOUT */}
        <Route element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/home" replace />} />
          
          {/* Vista para Leonardo (Cliente) */}
          <Route path="/home" element={<Home />} />
          
          {/* Vista para Cristian (Admin) */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <div className="p-10 text-2xl font-bold">Panel Maestro - Cristian Alarcón</div>
            </ProtectedRoute>
          } />

          {/* Vista para Naín (Técnico) */}
          <Route path="/tecnico/tareas" element={
            <ProtectedRoute allowedRoles={[ROLES.TECNICO, ROLES.ADMIN]}>
              <div className="p-10 text-2xl font-bold text-blue-600">Tareas Técnicas - Naín Zúñiga</div>
            </ProtectedRoute>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;