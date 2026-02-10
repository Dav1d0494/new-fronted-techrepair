import React, { useState } from 'react'
import { 
  Monitor, 
  Wifi, 
  Shield, 
  Bell, 
  Moon, 
  Sun, 
  CheckCircle, 
  XCircle, 
  Laptop,
  Check
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme' // Ahora esto funcionará gracias al PASO 1

export default function Settings() {
  const [activeTab, setActiveTab] = useState('interface')
  const { theme, toggleTheme } = useTheme()
  const [isOnline, setIsOnline] = useState(true)

  // Menú lateral igual al de AnyDesk
  const menuItems = [
    { id: 'interface', label: 'Interfaz de usuario', icon: Monitor },
    { id: 'connection', label: 'Conexión', icon: Wifi },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'privacy', label: 'Privacidad', icon: Shield },
  ]

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
      
      {/* 1. SIDEBAR ROJO/GRIS (Estilo AnyDesk) */}
      <aside className="w-64 bg-gray-50 dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 flex flex-col">
        <div className="p-5">
          <h2 className="text-xl font-normal text-red-500 mb-4">Configuración</h2>
          <input 
            type="text" 
            placeholder="Buscar" 
            className="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-sm focus:border-red-400 outline-none"
          />
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-2 text-sm transition-colors border-l-4 ${
                activeTab === item.id
                  ? 'border-red-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-medium'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-4 h-4 opacity-70" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* 2. CONTENIDO DERECHO */}
      <main className="flex-1 overflow-y-auto p-8 bg-white dark:bg-slate-800">
        
        {/* === PESTAÑA: INTERFAZ DE USUARIO === */}
        {activeTab === 'interface' && (
          <div className="max-w-2xl space-y-8 animate-in fade-in duration-300">
            
            {/* Idioma */}
            <section>
              <h3 className="text-base font-normal text-gray-900 dark:text-white mb-2">Idioma</h3>
              <select className="w-full p-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-sm text-sm focus:border-red-400 outline-none">
                <option>Selección automática</option>
                <option>Español</option>
                <option>English</option>
              </select>
            </section>

            {/* Tema (MOVIDO AQUÍ) */}
            <section>
              <h3 className="text-base font-normal text-gray-900 dark:text-white mb-2">Tema</h3>
              <div 
                onClick={toggleTheme}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-sm text-sm flex justify-between items-center cursor-pointer hover:border-gray-400"
              >
                <span>{theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}</span>
                {theme === 'dark' ? <Moon className="w-4 h-4 text-purple-500"/> : <Sun className="w-4 h-4 text-orange-500"/>}
              </div>
            </section>

            {/* Diversos (Checkboxes idénticos a la imagen) */}
            <section>
              <h3 className="text-base font-normal text-gray-900 dark:text-white mb-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                Diversos
              </h3>
              <div className="space-y-2">
                {[
                  'Si TechRepair está maximizado, solapar barra de inicio propia',
                  'Realizar comentarios al cerrar sesión',
                  'Abrir libreta de direcciones al iniciar el programa',
                  'Mostrar la ventana de sesiones entrantes cuando se recibe mensaje',
                  'Mostrar notificaciones sobre invitaciones a sesiones entrantes',
                  'Sonido en la solicitud de conexión entrante',
                  'Transferir las teclas rápidas'
                ].map((label, idx) => (
                  <label key={idx} className="flex items-start gap-3 cursor-pointer select-none">
                    <div className="relative flex items-center">
                      <input type="checkbox" className="peer h-4 w-4 cursor-pointer appearance-none rounded-sm border border-gray-300 checked:bg-red-500 checked:border-red-500" defaultChecked={idx === 4 || idx === 6} />
                      <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* === PESTAÑA: CONEXIÓN (ONLINE/OFFLINE) === */}
        {activeTab === 'connection' && (
          <div className="max-w-2xl space-y-8 animate-in fade-in duration-300">
            <section>
              <h3 className="text-base font-normal text-gray-900 dark:text-white mb-4 border-b border-gray-200 pb-2">
                Estado de Disponibilidad
              </h3>
              
              <div className={`flex items-center justify-between p-6 rounded-lg border ${isOnline ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${isOnline ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    <Laptop className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      {isOnline ? 'Estás en línea' : 'Estás desconectado'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {isOnline 
                        ? 'Tu equipo es visible y puedes recibir conexiones.' 
                        : 'No recibirás solicitudes de conexión hasta que te conectes.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOnline(!isOnline)}
                  className={`px-6 py-2 rounded shadow-sm font-medium text-white transition-colors ${
                    isOnline 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isOnline ? 'Desconectar' : 'Conectar'}
                </button>
              </div>
            </section>
          </div>
        )}

      </main>
    </div>
  )
}