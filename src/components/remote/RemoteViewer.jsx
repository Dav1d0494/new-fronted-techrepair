import React from 'react'
import Card from '@components/ui/Card'
import { Monitor, Eye, Share2 } from 'lucide-react'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'

/**
 * RemoteViewer - Visor de pantalla remota
 */
export function RemoteViewer({ isConnected = false, onStartShare, onEndShare }) {
  return (
    <Card className="relative overflow-hidden bg-black h-96">
      {/* Remote screen area */}
      <div className="w-full h-full bg-gradient-dark flex items-center justify-center">
        {isConnected ? (
          <div className="relative w-full h-full">
            {/* Simulated screen content */}
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              <div className="text-center">
                <Monitor size={48} className="text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Pantalla remota conectada</p>
              </div>
            </div>

            {/* Status badge */}
            <div className="absolute top-4 right-4">
              <Badge variant="success" size="md" className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Conectado
              </Badge>
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <Button variant="secondary" icon={Eye}>
                Ver Completo
              </Button>
              <Button variant="danger" onClick={onEndShare}>
                Finalizar
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Share2 size={48} className="text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No hay sesión remota activa</p>
            <Button variant="primary" icon={Share2} onClick={onStartShare}>
              Iniciar Compartición
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

export default RemoteViewer
