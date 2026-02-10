import React from 'react';
import { Users, Ticket, Monitor, Activity, ArrowUpRight, ArrowDownRight, MoreVertical } from 'lucide-react';

export default function AdminDashboard() {
  // Datos de ejemplo para visualizar el diseño
  const stats = [
    { label: 'Usuarios Activos', value: '1,234', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Tickets Pendientes', value: '42', change: '-5%', icon: Ticket, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Dispositivos Online', value: '856', change: '+8%', icon: Monitor, color: 'text-[#7F00FF]', bg: 'bg-purple-50' },
    { label: 'Tiempo Respuesta', value: '14m', change: '-2m', icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Welcome Banner */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Resumen General</h1>
          <p className="text-gray-500 mt-1">Bienvenido de nuevo, aquí tienes lo que está pasando hoy.</p>
        </div>
        <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm transition-all">
                Descargar Reporte
            </button>
            <button className="px-4 py-2 bg-[#7F00FF] text-white rounded-lg text-sm font-medium shadow-lg shadow-purple-200 hover:bg-[#6b00d6] transition-all">
                + Nuevo Ticket
            </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                {stat.change.startsWith('+') ? <ArrowUpRight size={14} className="mr-1"/> : <ArrowDownRight size={14} className="mr-1"/>}
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-gray-800">{stat.value}</h3>
              <p className="text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Tickets Table (Takes 2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 text-lg">Solicitudes Recientes</h3>
            <button className="text-[#7F00FF] text-sm font-bold hover:underline">Ver todo</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Usuario</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Problema</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[1, 2, 3, 4].map((item) => (
                  <tr key={item} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">JP</div>
                        <div>
                            <p className="font-bold text-sm text-gray-800">Juan Pérez</p>
                            <p className="text-xs text-gray-400">Hace 2 horas</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                        <p className="text-sm font-medium text-gray-700">Error en VPN corporativa</p>
                        <p className="text-xs text-gray-400">Redes</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-100">
                        En Progreso
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                        <button className="text-gray-400 hover:text-[#7F00FF] p-2 rounded-full hover:bg-purple-50 transition-colors">
                            <MoreVertical size={16} />
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Server Status / Mini Devices (Takes 1 column) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 text-lg mb-6">Estado del Sistema</h3>
            
            <div className="space-y-6">
                {/* Metric 1 */}
                <div>
                    <div className="flex justify-between text-sm font-medium mb-2">
                        <span className="text-gray-600">Servidor Principal (US-East)</span>
                        <span className="text-green-600 font-bold">98%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                </div>

                {/* Metric 2 */}
                <div>
                    <div className="flex justify-between text-sm font-medium mb-2">
                        <span className="text-gray-600">Base de Datos</span>
                        <span className="text-[#7F00FF] font-bold">45%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-[#7F00FF] h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                </div>

                {/* Mini Device List */}
                <div className="mt-8">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Dispositivos Críticos</h4>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <Monitor size={16} className="text-gray-400"/>
                                <span className="text-sm font-bold text-gray-700">SRV-Database-01</span>
                            </div>
                            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <Monitor size={16} className="text-gray-400"/>
                                <span className="text-sm font-bold text-gray-700">Backup-Unit-A</span>
                            </div>
                            <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}