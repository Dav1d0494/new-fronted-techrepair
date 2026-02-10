import React, { useState } from 'react'
import AppLayout from '@components/layouts/AppLayouts'
import Card from '@components/ui/Card'
import { RemoteViewer } from '@components/remote/RemoteViewer'
import { ChatWindow } from '@components/chat/ChatWindow'
import Badge from '@components/ui/Badge'
import Button from '@components/ui/Button'
import { Clock, Phone, Share2 } from 'lucide-react'

/**
 * Página de Sesión Remota
 */
export function RemoteSession() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Sesión Remota
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Soporte remoto a tiempo real
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isConnected && (
              <>
                <Badge variant="success" size="md" className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Conectado
                </Badge>
              </>
            )}
          </div>
        </div>

        {/* Session info */}
        {isConnected && (
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Usuario Remoto
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Juan García
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Sistema Operativo
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Windows 10 Pro
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                    <Clock size={16} />
                    Duración
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    5m 32s
                  </p>
                </div>
                <Button variant="danger" icon={Phone}>
                  Finalizar
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Remote viewer */}
          <div className="lg:col-span-2">
            <RemoteViewer
              isConnected={isConnected}
              onStartShare={() => setIsConnected(true)}
              onEndShare={() => setIsConnected(false)}
            />
          </div>

          {/* Chat */}
          <ChatWindow />
        </div>
      </div>
    </AppLayout>
  )
}

export default RemoteSession
