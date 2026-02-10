import React from 'react'
import AppLayout from '@components/layouts/AppLayouts'
import { UserProfile } from '@components/users/UserProfile'

/**
 * Página de Perfil del Usuario
 */
export function Profile() {
  const currentUser = {
    id: 1,
    name: 'Juan García',
    email: 'juan@example.com',
    phone: '+34 123 456 789',
    role: 'Técnico',
    department: 'Soporte Técnico',
    joinDate: new Date('2023-01-15'),
    bio: 'Técnico de soporte con 5 años de experiencia en resolución de problemas',
    avatar: null,
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <UserProfile user={currentUser} />
      </div>
    </AppLayout>
  )
}

export default Profile
