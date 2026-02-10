import React from 'react'
import AppLayout from '@components/layouts/AppLayouts'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import EditableSection from '@components/ui/EditableSection'

/**
 * Página de Historial
 */
export function History() {
  const [history, setHistory] = React.useState([
    {
      id: 1,
      date: '2024-12-02',
      action: 'Creó ticket #123',
      description: 'Problema de conexión en Windows',
      category: 'Tickets',
    },
    {
      id: 2,
      date: '2024-12-02',
      action: 'Asignó ticket #122',
      description: 'Instalación de software',
      category: 'Asignaciones',
    },
    {
      id: 3,
      date: '2024-12-01',
      action: 'Completó sesión remota',
      description: 'Con Juan García (45 min)',
      category: 'Conexiones',
    },
  ])

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Historial</h1>

        <Card>
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {item.action}
                  </p>
                  <EditableSection
                    value={item.description}
                    title={`Editar descripción - ${item.action}`}
                    onSave={(newValue) => {
                      setHistory((prev) => prev.map((h) => (h.id === item.id ? { ...h, description: newValue } : h)))
                    }}
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                  </EditableSection>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {item.date}
                  </p>
                </div>
                <div>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm rounded-full font-medium">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}

export default History
