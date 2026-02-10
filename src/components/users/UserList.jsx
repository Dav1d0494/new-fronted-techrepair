import React from 'react'
import Card from '@components/ui/Card'
import Avatar from '@components/ui/Avatar'
import Badge from '@components/ui/Badge'
import Button from '@components/ui/Button'
import { Edit2, Trash2 } from 'lucide-react'

/**
 * UserList - Lista de usuarios
 */
export function UserList({ users = [], onEdit, onDelete }) {
  const defaultUsers = [
    {
      id: 1,
      name: 'Juan García',
      email: 'juan@example.com',
      role: 'Técnico',
      status: 'Activo',
      avatar: null,
    },
    {
      id: 2,
      name: 'María López',
      email: 'maria@example.com',
      role: 'Administrador',
      status: 'Activo',
      avatar: null,
    },
    {
      id: 3,
      name: 'Carlos Rodríguez',
      email: 'carlos@example.com',
      role: 'Cliente',
      status: 'Inactivo',
      avatar: null,
    },
  ]

  const userList = users.length > 0 ? users : defaultUsers

  const getRoleColor = (role) => {
    const colors = {
      'Administrador': 'danger',
      'Técnico': 'primary',
      'Cliente': 'info',
    }
    return colors[role] || 'secondary'
  }

  const getStatusColor = (status) => {
    return status === 'Activo' ? 'success' : 'secondary'
  }

  return (
    <div className="overflow-x-auto">
      <Card>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-slate-700">
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                Usuario
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                Email
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                Rol
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                Estado
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} src={user.avatar} />
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                  {user.email}
                </td>
                <td className="py-3 px-4">
                  <Badge variant={getRoleColor(user.role)} size="sm">
                    {user.role}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <Badge variant={getStatusColor(user.status)} size="sm">
                    {user.status}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit2}
                      onClick={() => onEdit?.(user.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() => onDelete?.(user.id)}
                      className="text-red-600 hover:text-red-700"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

export default UserList
