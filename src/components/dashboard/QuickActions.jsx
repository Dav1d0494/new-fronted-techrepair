import React from 'react'
import { Plus, Zap, MessageSquare } from 'lucide-react'
import Button from '@components/ui/Button'
import Card from '@components/ui/Card'

/**
 * QuickActions - Acciones rápidas
 */
export function QuickActions() {
  return (
    <Card>
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Acciones Rápidas
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button
          variant="primary"
          icon={Plus}
          className="w-full justify-center"
        >
          Nuevo Ticket
        </Button>
        <Button
          variant="secondary"
          icon={Zap}
          className="w-full justify-center"
        >
          Nueva Conexión
        </Button>
        <Button
          variant="outline"
          icon={MessageSquare}
          className="w-full justify-center"
        >
          Iniciar Chat
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-center"
        >
          Ver Reportes
        </Button>
      </div>
    </Card>
  )
}

export default QuickActions
