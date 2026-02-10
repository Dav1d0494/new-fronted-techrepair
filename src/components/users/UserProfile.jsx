import React from 'react'
import Card from '@components/ui/Card'
import Avatar from '@components/ui/Avatar'
import Badge from '@components/ui/Badge'
import Button from '@components/ui/Button'
import { Edit2, Mail, Phone } from 'lucide-react'

/**
 * UserProfile - Perfil de usuario
 */
export function UserProfile({ user, onEdit }) {
  if (!user) return null

  return (
    <Card>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} src={user.avatar} size="xl" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {user.name}
            </h2>
            <Badge variant="primary" size="md" className="mt-2">
              {user.role}
            </Badge>
          </div>
        </div>
        <Button
          variant="primary"
          icon={Edit2}
          onClick={() => onEdit?.()}
        >
          Editar
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Email
          </h3>
          <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Mail size={18} />
            {user.email}
          </div>
        </div>

        {user.phone && (
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Teléfono
            </h3>
            <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Phone size={18} />
              {user.phone}
            </div>
          </div>
        )}

        {user.department && (
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Departamento
            </h3>
            <p className="text-gray-900 dark:text-gray-100">{user.department}</p>
          </div>
        )}

        {user.joinDate && (
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Se unió
            </h3>
            <p className="text-gray-900 dark:text-gray-100">
              {new Date(user.joinDate).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {user.bio && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Bio
          </h3>
          <p className="text-gray-900 dark:text-gray-100">{user.bio}</p>
        </div>
      )}
    </Card>
  )
}

export default UserProfile
