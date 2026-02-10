import React from 'react'
import Card from '@components/ui/Card'
import Badge from '@components/ui/Badge'

/**
 * TicketCard - Tarjeta individual de ticket
 */
export function TicketCard({ ticket, onClick }) {
  const getStatusColor = (status) => {
    const colors = {
      'Abierto': 'warning',
      'En Progreso': 'info',
      'Resuelto': 'success',
      'Cerrado': 'secondary',
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
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-md border-l-4 border-l-purple-600"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 dark:text-gray-100">
            #{ticket.id} - {ticket.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {ticket.customer}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant={getPriorityColor(ticket.priority)} size="sm">
            {ticket.priority}
          </Badge>
          <Badge variant={getStatusColor(ticket.status)} size="sm">
            {ticket.status}
          </Badge>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
        {ticket.description}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Asignado a: {ticket.assignee || 'Sin asignar'}</span>
        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
      </div>
    </Card>
  )
}

export default TicketCard
