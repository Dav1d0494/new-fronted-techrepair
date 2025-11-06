import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function Header({ theme, setTheme, isConnected, remoteInfo }) {
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header className="w-full bg-white dark:bg-[#071026] border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md flex items-center justify-center bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold">
            TR
          </div>
          <div>
            <div className="text-lg font-semibold">TechRepair Cliente</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Soporte remoto y asistencia técnica</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            isConnected
              ? 'bg-green-600/10 text-green-400'
              : 'bg-gray-200/60 text-gray-600 dark:bg-white/6 dark:text-gray-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
            }`}></span>
            {isConnected ? 'ONLINE' : 'OFFLINE'}
          </span>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
