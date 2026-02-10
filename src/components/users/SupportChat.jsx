import React from 'react';
import { Send } from 'lucide-react';

export const SupportChat = () => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex flex-col h-[500px] animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-purple-600 p-4 text-white">
        <h3 className="font-bold">Soporte Directo</h3>
        <p className="text-xs opacity-80">En línea ahora</p>
      </div>
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none max-w-[80%] text-sm text-gray-700">
          Hola, soy tu asistente técnico. ¿Qué problema presenta tu equipo hoy?
        </div>
      </div>
      <div className="p-4 border-t border-gray-50 flex gap-2">
        <input type="text" placeholder="Escribe tu mensaje..." className="flex-1 bg-gray-50 border-none rounded-xl px-4 text-sm focus:ring-2 focus:ring-purple-500" />
        <button className="bg-purple-600 p-3 rounded-xl text-white hover:bg-purple-700 transition-colors">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};