import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Card from '@components/ui/Card'

/**
 * ActivityChart - Gráfico de actividad
 */
export function ActivityChart({ data = [] }) {
  // Datos de ejemplo si no se proporcionan
  const defaultData = [
    { name: 'Lun', tickets: 65, conexiones: 45 },
    { name: 'Mar', tickets: 78, conexiones: 52 },
    { name: 'Mié', tickets: 89, conexiones: 68 },
    { name: 'Jue', tickets: 72, conexiones: 54 },
    { name: 'Vie', tickets: 95, conexiones: 78 },
    { name: 'Sáb', tickets: 45, conexiones: 32 },
    { name: 'Dom', tickets: 38, conexiones: 28 },
  ]

  const chartData = data.length > 0 ? data : defaultData

  return (
    <Card>
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">
        Actividad de la Semana
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
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
          <Line
            type="monotone"
            dataKey="tickets"
            stroke="#a78bfa"
            strokeWidth={2}
            dot={false}
            name="Tickets"
          />
          <Line
            type="monotone"
            dataKey="conexiones"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
            name="Conexiones"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default ActivityChart
