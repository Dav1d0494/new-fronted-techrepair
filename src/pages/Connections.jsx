import React from 'react'
import AppLayout from '@components/layouts/AppLayouts'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import { Phone, Clock, X, Video } from 'lucide-react'

/**
 * Página de Conexiones Remotas
 */
export function Connections() {
  const [connections] = React.useState([
    {
      id: 1,
      user: 'Juan García',
      status: 'Activa',
      startTime: new Date(Date.now() - 900000),
      duration: '15 min',
    },
    {
      id: 2,
      user: 'María López',
      status: 'Activa',
      startTime: new Date(Date.now() - 480000),
      duration: '8 min',
    },
    {
      id: 3,
      user: 'Carlos Rodríguez',
      status: 'Pendiente',
      startTime: new Date(Date.now() - 120000),
      duration: '2 min',
    },
  ])

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Conexiones
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Administra tus sesiones remotas activas
            </p>
          </div>
          <Button variant="primary" icon={Phone}>
            Nueva Conexión
          </Button>
        </div>

        {/* Connections List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {connections.map(connection => (
            <Card key={connection.id}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {connection.user}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <Clock size={16} />
                    {connection.duration}
                  </div>
                </div>
                <Badge
                  variant={connection.status === 'Activa' ? 'success' : 'warning'}
                  size="md"
                >
                  {connection.status}
                </Badge>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                <Button
                  variant="primary"
                  icon={Video}
                  className="flex-1"
                >
                  Ver Sesión
                </Button>
                <Button
                  variant="danger"
                  icon={X}
                  className="flex-1"
                >
                  Desconectar
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent History */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Historial de Conexiones
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                    Usuario
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                    Fecha
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                    Duración
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { user: 'Juan García', date: '2024-12-02', duration: '45 min', status: 'Completado' },
                  { user: 'María López', date: '2024-12-01', duration: '30 min', status: 'Completado' },
                  { user: 'Carlos Rodríguez', date: '2024-11-30', duration: '15 min', status: 'Completado' },
                ].map((history, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 px-4">{history.user}</td>
                    <td className="py-3 px-4">{history.date}</td>
                    <td className="py-3 px-4">{history.duration}</td>
                    <td className="py-3 px-4">
                      <Badge variant="success" size="sm">
                        {history.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}

export default Connections
