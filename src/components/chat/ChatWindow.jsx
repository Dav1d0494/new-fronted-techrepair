import React from 'react'
import Card from '@components/ui/Card'
import Input from '@components/ui/Input'
import Button from '@components/ui/Button'
import { Send, Paperclip } from 'lucide-react'

/**
 * ChatWindow - Ventana de chat
 */
export function ChatWindow() {
  const [messages, setMessages] = React.useState([
    { id: 1, sender: 'Soporte', text: 'Hola, ¿en qué puedo ayudarte?', timestamp: new Date(Date.now() - 300000) },
    { id: 2, sender: 'Cliente', text: 'Tengo un problema con mi conexión', timestamp: new Date(Date.now() - 240000) },
    { id: 3, sender: 'Soporte', text: 'No hay problema, te ayudaré a resolver esto', timestamp: new Date(Date.now() - 180000) },
  ])
  const [newMessage, setNewMessage] = React.useState('')

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: 'Tú',
          text: newMessage,
          timestamp: new Date(),
        },
      ])
      setNewMessage('')
    }
  }

  return (
    <Card className="h-96 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'Tú' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === 'Tú'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-gray-100'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
        <Button variant="ghost" size="sm" icon={Paperclip} />
        <Input
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage()
            }
          }}
          className="flex-1 m-0"
        />
        <Button
          variant="primary"
          size="sm"
          icon={Send}
          onClick={handleSendMessage}
        />
      </div>
    </Card>
  )
}

export default ChatWindow
