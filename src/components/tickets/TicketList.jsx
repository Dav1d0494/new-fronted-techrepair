import React from 'react'
import { Spinner } from '@components/ui/Spinner'
import TicketCard from './TicketCard'

/**
 * TicketList - Lista de tickets
 */
export function TicketList({ tickets = [], loading = false, onTicketClick }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No se encontraron tickets
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          onClick={() => onTicketClick?.(ticket.id)}
        />
      ))}
    </div>
  )
}

export default TicketList
