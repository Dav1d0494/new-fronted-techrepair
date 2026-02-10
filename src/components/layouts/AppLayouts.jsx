import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Puedes añadir aquí un Navbar general si lo deseas */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}