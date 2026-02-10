import React from 'react'
import { Bell, X } from 'lucide-react'
import Badge from '@components/ui/Badge'
import Button from '@components/ui/Button'

/**
 * NotificationCenter - Centro de notificaciones
 */
export function NotificationCenter() {
  const [notifications, setNotifications] = React.useState([
    {
      id: 1,
      type: 'ticket',
      title: 'Nuevo ticket asignado',
      message: 'Se te ha asignado el ticket #123',
      read: false,
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: 2,
      type: 'connection',
      title: 'Conexión establecida',
      message: 'Conexión remota con Juan García iniciada',
      read: false,
      timestamp: new Date(Date.now() - 600000),
    },
    {
      id: 3,
      type: 'message',
      title: 'Nuevo mensaje',
      message: 'El cliente ha respondido a tu mensaje',
      read: true,
      timestamp: new Date(Date.now() - 900000),
    },
  ])

  const [isOpen, setIsOpen] = React.useState(false)

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const getTypeColor = (type) => {
    const colors = {
      ticket: 'primary',
      connection: 'success',
      message: 'info',
    }
    return colors[type] || 'secondary'
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <Badge variant="danger" size="sm" className="absolute -top-1 -right-1">
            {unreadCount}
          </Badge>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-slate-700">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Notificaciones
            </h3>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No hay notificaciones
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-gray-50 dark:bg-slate-700/30' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={getTypeColor(notification.type)} size="sm">
                          {notification.type}
                        </Badge>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {notification.title}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationCenter
