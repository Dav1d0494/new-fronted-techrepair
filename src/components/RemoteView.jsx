import React from 'react';

export default function RemoteView({ isConnected, remoteInfo, onDisconnect }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-[#081222] p-6 rounded-2xl border border-white/5 shadow-inner">
        {!isConnected ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold">Vista previa del equipo remoto</h3>
            <p className="text-sm text-gray-400 mt-2">Cuando inicie la sesión aparecerá la pantalla remota aquí.</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Conectado a: {remoteInfo.name}</h3>
                <div className="text-xs text-gray-400">ID: {remoteInfo.id}</div>
              </div>
              <button onClick={onDisconnect} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Finalizar sesión</button>
            </div>

            <div className="h-60 overflow-hidden rounded-md border border-white/6 bg-gradient-to-br from-black/30 to-black/10 flex items-center justify-center">
              <span className="text-sm text-gray-400">[ Aquí se mostrará la pantalla remota ]</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
