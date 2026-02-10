import React from 'react'
import Badge from '@components/ui/Badge'
import Card from '@components/ui/Card'
import { Clock, User, Tag } from 'lucide-react'

/**
 * TicketDetail - Detalle completo de un ticket
 */
export function TicketDetail({ ticket, loading = false }) {
  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="space-y-4">
          <div className="h-8 bg-gray-300 dark:bg-slate-700 rounded w-3/4" />
          <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-1/2" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded" />
            <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded" />
            <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-5/6" />
          </div>
        </div>
      </Card>
    )
  }

  if (!ticket) return null

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
    <Card>
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-slate-700 pb-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              #{ticket.id}
            </h1>
            <h2 className="text-xl text-gray-700 dark:text-gray-300 mt-2">
              {ticket.title}
            </h2>
          </div>
          <div className="flex gap-2">
            <Badge variant={getPriorityColor(ticket.priority)} size="md">
              {ticket.priority}
            </Badge>
            <Badge variant={getStatusColor(ticket.status)} size="md">
              {ticket.status}
            </Badge>
          </div>
        </div>

        {/* Meta information */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <User size={16} />
            <span>{ticket.customer}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Tag size={16} />
            <span>{ticket.category}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Clock size={16} />
            <span>{new Date(ticket.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Descripción
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {ticket.description}
        </p>
      </div>

      {/* Assigned to */}
      {ticket.assignee && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Asignado a
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            {ticket.assignee}
          </p>
        </div>
      )}

      {/* Notes */}
      {ticket.notes && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Notas Internas
          </h3>
          <p className="text-gray-700 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700/30">
            {ticket.notes}
          </p>
        </div>
      )}
    </Card>
  )
}

export default TicketDetail
