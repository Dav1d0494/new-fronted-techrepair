import React from "react";
import { LogOut, User } from "lucide-react";
import { auth } from "../../lib/firebase"; // Subimos dos niveles para llegar a lib

export const Header = ({ user }) => {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-2">
        <div className="bg-purple-600 p-2 rounded-lg text-white font-bold text-xl">TR</div>
        <span className="text-xl font-black text-gray-800 tracking-tight">TechRepair</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-gray-800">{user?.name || "Usuario"}</p>
          <p className="text-[10px] text-purple-600 font-bold uppercase tracking-widest">{user?.role || "Cliente"}</p>
        </div>
        <button 
          onClick={() => auth.signOut()}
          className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};