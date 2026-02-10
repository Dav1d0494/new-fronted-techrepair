import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Básico */}
      <aside className="w-64 bg-purple-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold">TechRepair Admin</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/dashboard" className="block p-2 hover:bg-purple-700 rounded">Dashboard</Link>
          <Link to="/admin/users" className="block p-2 hover:bg-purple-700 rounded">Usuarios</Link>
          <Link to="/admin/tickets" className="block p-2 hover:bg-purple-700 rounded">Tickets</Link>
        </nav>
        <button onClick={handleLogout} className="p-4 bg-purple-800 hover:bg-purple-900 text-left">
          Cerrar Sesión
        </button>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}