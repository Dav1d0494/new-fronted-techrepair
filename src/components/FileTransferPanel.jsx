import React from 'react';

export default function FileTransferPanel({ isConnected }) {
  return (
    <div className="bg-white dark:bg-[#081122] p-4 rounded-2xl border border-white/5 shadow-sm">
      <h4 className="font-semibold text-md mb-2">Transferencia de Archivos</h4>
      <p className="text-xs text-gray-400 mb-4">{isConnected ? 'Puede enviar y recibir archivos.' : 'Conéctese para habilitar esta función.'}</p>
      <button disabled={!isConnected} className={`w-full py-2 rounded-lg text-white ${isConnected ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-500 cursor-not-allowed'}`}>Enviar archivo</button>
    </div>
);
}
