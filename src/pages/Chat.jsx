import React from 'react'
import AppLayout from '@components/layouts/AppLayouts'
import { ChatWindow } from '@components/chat/ChatWindow'

export function Chat() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Chat</h1>
          <p className="text-gray-600 dark:text-gray-400">Mensajería en tiempo real con clientes</p>
        </div>

        <ChatWindow />
      </div>
    </AppLayout>
  )
}

export default Chat
