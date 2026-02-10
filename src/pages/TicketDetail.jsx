import React from 'react'
import AppLayout from '@components/layouts/AppLayouts'
import TicketDetailComponent from '@components/tickets/TicketDetail'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import { ArrowLeft } from 'lucide-react'

/**
 * Página de Detalle de Ticket
 */
export function TicketDetailPage() {
  const [ticket] = React.useState({
    id: 123,
    title: 'Problema de conexión en Windows',
    description: 'No puedo conectarme al servidor remoto desde mi máquina Windows 10. He intentado varias veces pero siempre obtengo un error de tiempo de espera.',
    customer: 'Juan García',
    customerEmail: 'juan@example.com',
    status: 'En Progreso',
    priority: 'Alta',
    category: 'Soporte Técnico',
    assignee: 'María López',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 3600000),
    notes: 'El cliente reporta que el problema ocurre después de actualizar Windows.',
  })

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" icon={ArrowLeft} onClick={() => window.history.back()}>
            Volver
          </Button>
        </div>

        {/* Ticket Detail */}
        <TicketDetailComponent ticket={ticket} />

        {/* Comments Section */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Comentarios
          </h3>

          <div className="space-y-4">
            {[
              {
                id: 1,
                author: 'María López',
                role: 'Técnico',
                text: 'He revisado el problema. Parece ser un problema de configuración de firewall.',
                timestamp: new Date(Date.now() - 3600000),
              },
              {
                id: 2,
                author: 'Juan García',
                role: 'Cliente',
                text: 'Gracias por tu ayuda, voy a intentar los pasos que me indicaste',
                timestamp: new Date(Date.now() - 1800000),
              },
            ].map((comment) => (
              <div key={comment.id} className="pb-4 border-b border-gray-200 dark:border-slate-700 last:border-b-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    {comment.author[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {comment.author}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {comment.role} · {comment.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 ml-13">
                  {comment.text}
                </p>
              </div>
            ))}
          </div>

          {/* Comment form */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
            <textarea
              placeholder="Agregar un comentario..."
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 transition-colors mb-3"
              rows="3"
            />
            <div className="flex gap-3 justify-end">
              <Button variant="ghost">Cancelar</Button>
              <Button variant="primary">Enviar Comentario</Button>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}

export default TicketDetailPage
