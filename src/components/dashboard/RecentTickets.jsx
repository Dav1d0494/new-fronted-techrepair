import React from 'react'
import Card from '@components/ui/Card'
import Badge from '@components/ui/Badge'

/**
 * RecentTickets - Lista de tickets recientes
 */
export function RecentTickets({ tickets = [] }) {
  const defaultTickets = [
    {
      id: 1,
      title: 'Problema de conexión en Windows',
      status: 'Abierto',
      priority: 'Alta',
      customer: 'Juan García',
    },
    {
      id: 2,
      title: 'Instalación de software',
      status: 'En Progreso',
      priority: 'Media',
      customer: 'María López',
    },
    {
      id: 3,
      title: 'Soporte técnico remoto',
      status: 'Cerrado',
      priority: 'Baja',
      customer: 'Carlos Rodríguez',
    },
  ]

  const ticketList = tickets.length > 0 ? tickets : defaultTickets

  const getStatusColor = (status) => {
    const colors = {
      'Abierto': 'warning',
      'En Progreso': 'info',
      'Cerrado': 'success',
    }
    return colors[status] || 'secondary'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      'Alta': 'danger',
      'Media': 'warning',
      'Baja': 'success',
    }
    return colors[priority] || 'secondary'
  }

  return (
    <Card>
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Tickets Recientes
      </h3>
      <div className="space-y-3">
        {ticketList.map((ticket) => (
          <div
            key={ticket.id}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {ticket.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {ticket.customer}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getPriorityColor(ticket.priority)} size="sm">
                {ticket.priority}
              </Badge>
              <Badge variant={getStatusColor(ticket.status)} size="sm">
                {ticket.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default RecentTickets
