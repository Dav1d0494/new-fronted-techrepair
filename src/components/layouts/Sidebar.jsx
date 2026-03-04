import React from "react";
import {
  Bot,
  History,
  LayoutDashboard,
  MessageSquare,
  Shield,
  Ticket,
  Users,
  Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Sidebar = ({ role }) => {
  const navigate = useNavigate();

  const menuItems = {
    admin: [
      { name: "Panel Ejecutivo", icon: LayoutDashboard, path: "/home?panel=overview" },
      { name: "Control Maestro", icon: Users, path: "/home?panel=control" },
      { name: "Seguridad", icon: Shield, path: "/home?panel=security" },
      { name: "Automatizacion", icon: Bot, path: "/home?panel=automation" },
    ],
    tecnico: [
      { name: "Mis Tickets", icon: Ticket, path: "/home" },
      { name: "Chat Soporte", icon: MessageSquare, path: "/home" },
      { name: "Historial", icon: History, path: "/home" },
    ],
    cliente: [
      { name: "Inicio", icon: LayoutDashboard, path: "/home" },
      { name: "Mis Solicitudes", icon: Ticket, path: "/home" },
      { name: "Perfil", icon: Wrench, path: "/home" },
    ],
  };

  const currentMenu = menuItems[role] || menuItems.cliente;

  return (
    <aside className="w-72 bg-gradient-to-b from-[#0B1226] to-[#0F1B3D] text-white h-screen hidden md:flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-black bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
          Menu Principal
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {currentMenu.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
          >
            <item.icon size={20} className="group-hover:text-violet-300" />
            <span className="font-medium text-sm">{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="bg-white/5 p-4 rounded-2xl">
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Rol Actual</p>
          <p className="text-sm font-bold text-violet-300 capitalize">{role}</p>
        </div>
      </div>
    </aside>
  );
};
