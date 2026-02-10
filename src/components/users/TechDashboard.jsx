import React from 'react';
import { Monitor, Play, MessageSquare } from 'lucide-react';

export const TechDashboard = () => {
  const tickets = [
    { id: 'TK-99', cliente: 'Leonardo M.', issue: 'Error de Red' },
    { id: 'TK-100', cliente: 'Empresa X', issue: 'Mantenimiento' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-black text-gray-800">Intervenciones Pendientes</h2>
      <div className="space-y-4">
        {tickets.map((t, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><Monitor size={24} /></div>
              <div>
                <p className="font-bold text-gray-800">{t.cliente}</p>
                <p className="text-sm text-gray-500">{t.issue}</p>
              </div>
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors">
              <Play size={16} /> Atender
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};