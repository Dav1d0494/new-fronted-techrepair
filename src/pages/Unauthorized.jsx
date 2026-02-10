import React from 'react'
import AppLayout from '@components/layouts/AppLayouts'

export function Unauthorized() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Acceso Denegado</h1>
        <p className="text-gray-600 dark:text-gray-400">No tienes permisos para ver esta página.</p>
      </div>
    </AppLayout>
  )
}

export default Unauthorized
