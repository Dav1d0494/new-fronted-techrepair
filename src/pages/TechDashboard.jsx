import React from 'react';
import { MessageSquare, Monitor, Clock } from 'lucide-react';

export const TechDashboard = () => {
  const tickets = [
    { id: 'TK-102', user: 'Leonardo', issue: 'Error de Pantalla Azul', priority: 'Alta' },
    { id: 'TK-105', user: 'Ana Maria', issue: 'Instalación de Drivers', priority: 'Media' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Panel de Intervenciones</h2>
      <div className="grid gap-4">
        {tickets.map(ticket => (
          <div key={ticket.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Monitor size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{ticket.user} - <span className="text-indigo-600">{ticket.id}</span></h4>
                <p className="text-sm text-gray-500">{ticket.issue}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold flex items-center gap-2">
                <MessageSquare size={16} /> Atender
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};