import React from 'react'
import { Search, Filter } from 'lucide-react'
import Input from '@components/ui/Input'
import Button from '@components/ui/Button'

/**
 * TicketFilters - Filtros para tickets
 */
export function TicketFilters({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [status, setStatus] = React.useState('all')
  const [priority, setPriority] = React.useState('all')

  const handleSearch = (value) => {
    setSearchTerm(value)
    onFilterChange?.({ searchTerm: value, status, priority })
  }

  const handleStatusChange = (value) => {
    setStatus(value)
    onFilterChange?.({ searchTerm, status: value, priority })
  }

  const handlePriorityChange = (value) => {
    setPriority(value)
    onFilterChange?.({ searchTerm, status, priority: value })
  }

  const handleReset = () => {
    setSearchTerm('')
    setStatus('all')
    setPriority('all')
    onFilterChange?.({ searchTerm: '', status: 'all', priority: 'all' })
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          icon={Search}
          placeholder="Buscar tickets..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-500"
        >
          <option value="all">Todos los estados</option>
          <option value="open">Abiertos</option>
          <option value="in-progress">En Progreso</option>
          <option value="resolved">Resueltos</option>
          <option value="closed">Cerrados</option>
        </select>

        <select
          value={priority}
          onChange={(e) => handlePriorityChange(e.target.value)}
          className="px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-500"
        >
          <option value="all">Todas las prioridades</option>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>

        <Button
          variant="secondary"
          icon={Filter}
          onClick={handleReset}
        >
          Limpiar
        </Button>
      </div>
    </div>
  )
}

export default TicketFilters
