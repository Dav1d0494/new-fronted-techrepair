import React, { useState } from 'react';
import { Monitor, Keyboard, MousePointer } from 'lucide-react';

export default function Permissions() {
  const [permissions, setPermissions] = useState({ screen: true, keyboard: false, mouse: false });

  const toggle = (k) => setPermissions(prev => ({ ...prev, [k]: !prev[k] }));

  const Item = ({ icon, label, state, onToggle }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 dark:bg-white/6 border border-white/4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-white/6 dark:bg-white/10">{icon}</div>
        <div>
          <div className="font-medium">{label}</div>
          <div className="text-xs text-gray-400">Actívelo durante la sesión si requiere control</div>
        </div>
      </div>
      <div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={state} onChange={onToggle} className="sr-only" />
          <span className={`w-11 h-6 rounded-full transition-colors ${state ? 'bg-purple-600' : 'bg-gray-400'}`}></span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-[#081122] p-6 rounded-2xl border border-white/5 shadow-sm">
      <h3 className="font-semibold text-lg">Permisos de Acceso</h3>
      <p className="text-xs text-gray-400 mt-1">Puede activar o desactivar permisos en cualquier momento.</p>

      <div className="mt-4 space-y-3">
        <Item icon={<Monitor size={20} />} label="Compartir Pantalla" state={permissions.screen} onToggle={() => toggle('screen')} />
        <Item icon={<Keyboard size={20} />} label="Control de Teclado" state={permissions.keyboard} onToggle={() => toggle('keyboard')} />
        <Item icon={<MousePointer size={20} />} label="Control de Mouse" state={permissions.mouse} onToggle={() => toggle('mouse')} />
      </div>
    </div>
);
}
