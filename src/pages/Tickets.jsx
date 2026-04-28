import React, { useState } from 'react'
import AppLayout from '@components/layouts/AppLayouts'
import { TicketList } from '@components/tickets/TicketList'
import { TicketFilters } from '@components/tickets/TicketFilters'
import Button from '@components/ui/Button'
import { Plus } from 'lucide-react'
import Modal from '@components/ui/Modal'
import TicketForm from '@components/tickets/TicketForm'
import ticketService from '@services/ticketService'
import { useNotifications } from '@hooks/useNotifications'

/**
 * Página de Tickets
 */
export function Tickets() {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      title: 'Problema de conexión en Windows',
      description: 'No puedo conectarme al servidor remoto desde mi máquina Windows 10',
      customer: 'Juan García',
      status: 'Abierto',
      priority: 'Alta',
      assignee: 'María López',
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: 2,
      title: 'Instalación de software',
      description: 'Necesito instalar el software de reportes en mi máquina',
      customer: 'Carlos Rodríguez',
      status: 'En Progreso',
      priority: 'Media',
      assignee: 'Pedro Martínez',
      createdAt: new Date(Date.now() - 172800000),
    },
    {
      id: 3,
      title: 'Soporte técnico remoto',
      description: 'Ayuda con la configuración de la red corporativa',
      customer: 'Ana Fernández',
      status: 'Cerrado',
      priority: 'Baja',
      assignee: 'María López',
      createdAt: new Date(Date.now() - 259200000),
    },
  ])

  const [filters, setFilters] = useState({
    searchTerm: '',
    status: 'all',
    priority: 'all',
  })

  const [showNewTicketModal, setShowNewTicketModal] = useState(false)
  const [creatingTicket, setCreatingTicket] = useState(false)
  const { success, error } = useNotifications()

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                          ticket.customer.toLowerCase().includes(filters.searchTerm.toLowerCase())
    const matchesStatus = filters.status === 'all' || ticket.status.toLowerCase() === filters.status
    const matchesPriority = filters.priority === 'all' || ticket.priority.toLowerCase() === filters.priority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleCreateTicket = async (formData) => {
    try {
      setCreatingTicket(true)
      // call API
      const created = await ticketService.createTicket(formData)

      // normalize fields for UI consistency
      const newTicket = {
        id: created.id || Math.floor(Math.random() * 1000000),
        title: created.title || formData.title,
        description: created.description || formData.description,
        customer: created.customer || formData.customer || 'Cliente',
        status: created.status || 'Abierto',
        priority: (created.priority || formData.priority || 'media').toString(),
        assignee: created.assignee || '',
        createdAt: created.createdAt ? new Date(created.createdAt) : new Date(),
      }

      // Capitalize priority for existing UI mapping
      newTicket.priority = newTicket.priority.charAt(0).toUpperCase() + newTicket.priority.slice(1)

      setTickets(prev => [newTicket, ...prev])
      setShowNewTicketModal(false)
      success('Ticket creado correctamente')
    } catch (err) {
      console.error('Error creando ticket', err)
      error('No se pudo crear el ticket')
    } finally {
      setCreatingTicket(false)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Tickets
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestiona y responde a los tickets de soporte
            </p>
          </div>
          <Button variant="primary" icon={Plus} onClick={() => setShowNewTicketModal(true)}>
            Nuevo Ticket
          </Button>
        </div>

        {/* Filters */}
        <TicketFilters onFilterChange={handleFilterChange} />

        {/* Ticket List */}
        <TicketList
          tickets={filteredTickets}
          onTicketClick={(id) => console.log('Clicked ticket:', id)}
        />

        <Modal
          isOpen={showNewTicketModal}
          onClose={() => setShowNewTicketModal(false)}
          title="Crear nuevo ticket"
          size="lg"
        >
          <TicketForm
            onSubmit={handleCreateTicket}
            loading={creatingTicket}
            onCancel={() => setShowNewTicketModal(false)}
          />
        </Modal>
      </div>
    </AppLayout>
  )
}

export default Tickets
