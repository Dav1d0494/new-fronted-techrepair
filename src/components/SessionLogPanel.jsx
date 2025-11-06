import React from 'react';

export default function SessionLogPanel({ isConnected }) {
  return (
    <div className="bg-white dark:bg-[#081122] p-4 rounded-2xl border border-white/5 shadow-sm">
      <h4 className="font-semibold text-md mb-2">Registro de Sesión</h4>
      <p className="text-xs text-gray-400 mb-4">{isConnected ? 'La sesión está activa. Se registrarán los eventos.' : 'La sesión no está activa.'}</p>
      <div className="h-20 overflow-y-auto bg-white/10 rounded-md p-2 text-xs text-gray-400">
        {isConnected ? <div>Sin eventos por ahora.</div> : <div>Conéctese para iniciar registro.</div>}
      </div>
    </div>
);
}
