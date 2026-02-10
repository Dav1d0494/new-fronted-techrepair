import React from 'react';
import { Users, Ticket, Monitor, Activity, ArrowUpRight, ArrowDownRight, MoreVertical, Smartphone, Laptop } from 'lucide-react';

export default function Dashboard() {
  // Datos simulados para diseño
  const stats = [
    { label: 'Usuarios Totales', value: '2,543', change: '+12.5%', icon: Users, trend: 'up' },
    { label: 'Tickets Abiertos', value: '45', change: '-2.4%', icon: Ticket, trend: 'down' },
    { label: 'Dispositivos Online', value: '1,208', change: '+5.2%', icon: Monitor, trend: 'up' },
    { label: 'Tiempo de Respuesta', value: '14m', change: '-1m', icon: Activity, trend: 'good' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Banner de Bienvenida */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#333333]">Resumen General</h1>
          <p className="text-[#6B6B6B] mt-1">Bienvenido al centro de comando de TechRepair.</p>
        </div>
        <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-[#E0E0E0] text-[#333333] rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm transition-all">
                Descargar Reporte
            </button>
            <button className="px-4 py-2 bg-[#7F00FF] text-white rounded-lg text-sm font-medium shadow-md shadow-purple-200 hover:bg-[#5E00CC] transition-all flex items-center gap-2">
                <span>+</span> Nuevo Dispositivo
            </button>
        </div>
      </div>

      {/* Grid de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-[#F0F0F0] hover:translate-y-[-2px] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-[#F7F7F7]">
                <stat.icon className="w-6 h-6 text-[#7F00FF]" />
              </div>
              <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                stat.trend === 'up' || stat.trend === 'good' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
              }`}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight size={14} className="ml-1"/> : <ArrowDownRight size={14} className="ml-1"/>}
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-[#333333] tracking-tight">{stat.value}</h3>
              <p className="text-sm text-[#6B6B6B] font-medium mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sección Inferior: Tickets y Dispositivos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tabla de Tickets Recientes (Ocupa 2 columnas) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#E0E0E0] overflow-hidden">
          <div className="p-6 border-b border-[#F7F7F7] flex justify-between items-center">
            <h3 className="font-bold text-[#333333] text-lg">Tickets Recientes</h3>
            <button className="text-[#7F00FF] text-sm font-bold hover:text-[#5E00CC]">Ver todos</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9FAFB]">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Usuario</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Asunto</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Estado</th>
                  <th className="text-right py-4 px-6 text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F7F7]">
                {[1, 2, 3].map((item) => (
                  <tr key={item} className="hover:bg-[#F7F7F7] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#E0E0E0] flex items-center justify-center text-xs font-bold text-[#6B6B6B]">JP</div>
                        <span className="font-medium text-sm text-[#333333]">Juan Pérez</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-[#6B6B6B]">Error conexión VPN</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-100">Pendiente</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-[#D1D1D1] hover:text-[#7F00FF] transition-colors"><MoreVertical size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Estado de Dispositivos (Ocupa 1 columna) */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E0E0E0] p-6 flex flex-col">
          <h3 className="font-bold text-[#333333] text-lg mb-6">Salud del Parque Informático</h3>
          
          <div className="space-y-6 flex-1">
             {/* Item 1 */}
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-purple-50 rounded-lg text-[#7F00FF]"><Laptop size={20}/></div>
                   <div>
                      <p className="text-sm font-bold text-[#333333]">Laptops Corporativas</p>
                      <p className="text-xs text-[#6B6B6B]">850 Activas</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-xs font-bold text-green-600">98% Online</p>
                </div>
             </div>

             {/* Item 2 */}
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Smartphone size={20}/></div>
                   <div>
                      <p className="text-sm font-bold text-[#333333]">Móviles / Tablets</p>
                      <p className="text-xs text-[#6B6B6B]">358 Activos</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-xs font-bold text-yellow-600">92% Online</p>
                </div>
             </div>
          </div>
          
          <button className="mt-6 w-full py-2 border border-[#E0E0E0] rounded-lg text-sm font-bold text-[#6B6B6B] hover:bg-[#F7F7F7] hover:text-[#7F00FF] transition-all">
            Ver Reporte Completo
          </button>
        </div>

      </div>
    </div>
  );
}