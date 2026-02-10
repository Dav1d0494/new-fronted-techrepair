import React from 'react'
import Card from '@components/ui/Card'
import Input from '@components/ui/Input'
import Button from '@components/ui/Button'
import Avatar from '@components/ui/Avatar'
import { Camera } from 'lucide-react'

/**
 * ProfileSettings - Configuración de perfil
 */
export function ProfileSettings() {
  const [profile, setProfile] = React.useState({
    name: 'Juan García',
    email: 'juan@example.com',
    phone: '+34 123 456 789',
    bio: 'Técnico de soporte con 5 años de experiencia',
  })

  const [isSaving, setIsSaving] = React.useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Configuración de Perfil
      </h2>

      {/* Avatar */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Foto de Perfil
        </h3>
        <div className="flex items-center gap-4">
          <Avatar name={profile.name} size="lg" />
          <Button variant="secondary" icon={Camera}>
            Cambiar Foto
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4 mb-6">
        <Input
          label="Nombre Completo"
          name="name"
          value={profile.name}
          onChange={handleChange}
        />
        <Input
          label="Email"
          name="email"
          type="text"
          value={profile.email}
          onChange={handleChange}
          disabled
        />
        <Input
          label="Teléfono"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 transition-colors"
            rows="4"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-end pt-4 border-t border-gray-200 dark:border-slate-700">
        <Button variant="ghost">
          Cancelar
        </Button>
        <Button
          variant="primary"
          loading={isSaving}
          onClick={handleSave}
        >
          Guardar Cambios
        </Button>
      </div>
    </Card>
  )
}

export default ProfileSettings
