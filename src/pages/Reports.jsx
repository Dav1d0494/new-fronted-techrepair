import React from 'react'
import AppLayout from '@components/layouts/AppLayouts'
import Card from '@components/ui/Card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

/**
 * Página de Reportes
 */
export function Reports() {
  const ticketData = [
    { name: 'Lun', completados: 12, pendientes: 5 },
    { name: 'Mar', completados: 19, pendientes: 3 },
    { name: 'Mié', completados: 15, pendientes: 4 },
    { name: 'Jue', completados: 22, pendientes: 2 },
    { name: 'Vie', completados: 25, pendientes: 6 },
    { name: 'Sáb', completados: 8, pendientes: 2 },
    { name: 'Dom', completados: 5, pendientes: 1 },
  ]

  const priorityData = [
    { name: 'Alta', value: 25 },
    { name: 'Media', value: 45 },
    { name: 'Baja', value: 30 },
  ]

  const COLORS = ['#ef4444', '#eab308', '#22c55e']

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Reportes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Análisis y estadísticas de tu actividad
          </p>
        </div>

        {/* Tickets Chart */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Tickets Completados por Día
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ticketData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis
                dataKey="name"
                stroke="rgba(148, 163, 184, 0.5)"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="rgba(148, 163, 184, 0.5)"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="completados" fill="#a78bfa" name="Completados" />
              <Bar dataKey="pendientes" fill="#60a5fa" name="Pendientes" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Priority Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Distribución por Prioridad
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Stats Summary */}
          <Card>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Resumen
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-slate-700">
                <span className="text-gray-600 dark:text-gray-400">Total de Tickets</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">142</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-slate-700">
                <span className="text-gray-600 dark:text-gray-400">Completados</span>
                <span className="text-2xl font-bold text-green-600">126</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-slate-700">
                <span className="text-gray-600 dark:text-gray-400">Pendientes</span>
                <span className="text-2xl font-bold text-yellow-600">16</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tiempo Promedio</span>
                <span className="text-2xl font-bold text-purple-600">45 min</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

export default Reports
