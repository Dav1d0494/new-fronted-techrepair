import React from 'react'
import AppLayout from '@components/layouts/AppLayouts'
import Card from '@components/ui/Card'
import Badge from '@components/ui/Badge'
import Button from '@components/ui/Button'

const statusMap = {
  in_progress: { label: 'En atención', variant: 'warning', message: 'Estamos trabajando en tu solicitud' },
  waiting: { label: 'Esperando respuesta', variant: 'default', message: 'Esperamos respuesta del equipo' },
  done: { label: 'Finalizado', variant: 'success', message: 'Tu solicitud fue completada' },
}

export function MisSolicitudes() {
  const [requests] = React.useState([
    { id: 1, title: 'No enciende mi equipo', status: 'in_progress', date: '2024-12-05' },
    { id: 2, title: 'Problema con conexión Wi-Fi', status: 'waiting', date: '2024-12-03' },
    { id: 3, title: 'Instalar software de ofimática', status: 'done', date: '2024-11-28' },
  ])

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Mis solicitudes</h1>
          <p className="text-gray-600 dark:text-gray-400">Aquí puedes ver el estado de tus solicitudes y conversar con soporte.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((r) => {
            const st = statusMap[r.status] || { label: r.status, variant: 'default', message: '' }
            return (
              <Card key={r.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{r.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{st.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">Creada: {r.date}</p>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <Badge variant={st.variant} size="sm">{st.label}</Badge>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => window.location.href = '/chat'}>Contactar</Button>
                      <Button variant="secondary" size="sm">Ver</Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}

export default MisSolicitudes
