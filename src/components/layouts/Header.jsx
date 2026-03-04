import React from "react";
import { LogOut } from "lucide-react";
import { auth } from "../../lib/firebase";
import { getUserRole } from "../../config/roles";
import logo from "../../assets/logo.png";

export const Header = ({ user }) => {
  const role = getUserRole(user?.email) || user?.role || "cliente";
  const roleLabel = role === "admin" ? "ADMINISTRADOR" : role.toUpperCase();

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-3">
        <img src={logo} alt="TechRepair" className="h-10 w-10 object-contain rounded-lg border border-gray-100 p-1" />
        <div>
          <p className="text-xl font-black text-gray-800 tracking-tight">TechRepair</p>
          <p className="text-[11px] font-semibold text-violet-700">Centro de Soporte Inteligente</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-gray-800">{user?.displayName || user?.email || "Usuario"}</p>
          <p className="text-[10px] text-purple-600 font-bold uppercase tracking-widest">{roleLabel}</p>
        </div>
        <button
          onClick={() => auth.signOut()}
          className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
          title="Cerrar sesión"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};
