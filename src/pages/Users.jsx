import React, { useState } from 'react'
import AppLayout from '@components/layouts/AppLayouts'
import { UserList } from '@components/users/UserList'
import Button from '@components/ui/Button'
import { Plus } from 'lucide-react'

/**
 * Página de Usuarios
 */
export function Users() {
  const [users] = useState([
    {
      id: 1,
      name: 'Juan García',
      email: 'juan@example.com',
      role: 'Técnico',
      status: 'Activo',
      avatar: null,
      joinDate: new Date('2023-01-15'),
    },
    {
      id: 2,
      name: 'María López',
      email: 'maria@example.com',
      role: 'Administrador',
      status: 'Activo',
      avatar: null,
      joinDate: new Date('2022-06-10'),
    },
    {
      id: 3,
      name: 'Carlos Rodríguez',
      email: 'carlos@example.com',
      role: 'Cliente',
      status: 'Inactivo',
      avatar: null,
      joinDate: new Date('2023-03-20'),
    },
  ])

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Usuarios
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestiona los usuarios de la plataforma
            </p>
          </div>
          <Button variant="primary" icon={Plus}>
            Nuevo Usuario
          </Button>
        </div>

        {/* User List */}
        <UserList
          users={users}
          onEdit={(id) => console.log('Edit user:', id)}
          onDelete={(id) => console.log('Delete user:', id)}
        />
      </div>
    </AppLayout>
  )
}

export default Users
