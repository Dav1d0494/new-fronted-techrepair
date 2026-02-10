import React from 'react';
import { 
  LayoutDashboard, 
  Ticket, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Settings,
  History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Sidebar = ({ role }) => {
  const navigate = useNavigate();

  // Definimos los menús según el rol
  const menuItems = {
    admin: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/home' },
      { name: 'Usuarios', icon: Users, path: '/users' },
      { name: 'Reportes', icon: BarChart3, path: '/reports' },
      { name: 'Configuración', icon: Settings, path: '/settings' },
    ],
    tecnico: [
      { name: 'Mis Tickets', icon: Ticket, path: '/home' },
      { name: 'Chat Soporte', icon: MessageSquare, path: '/chat' },
      { name: 'Historial', icon: History, path: '/history' },
    ],
    cliente: [
      { name: 'Inicio', icon: LayoutDashboard, path: '/home' },
      { name: 'Mis Solicitudes', icon: Ticket, path: '/history' },
      { name: 'Perfil', icon: Users, path: '/profile' },
    ]
  };

  const currentMenu = menuItems[role] || menuItems.cliente;

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen hidden md:flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Menu Principal
        </h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {currentMenu.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all duration-200 group"
          >
            <item.icon size={20} className="group-hover:text-purple-400" />
            <span className="font-medium text-sm">{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800/50 p-4 rounded-2xl">
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Rol Actual</p>
          <p className="text-sm font-bold text-purple-400 capitalize">{role}</p>
        </div>
      </div>
    </aside>
  );
};