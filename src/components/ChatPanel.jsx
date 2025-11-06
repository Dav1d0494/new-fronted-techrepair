import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPanel({ isConnected, remoteInfo }) {
  const [messages, setMessages] = useState([
    { id: 1, author: 'Carlos Mendoza', text: 'Hola, ¿en qué puedo ayudarte hoy?' }
  ]);
  const [text, setText] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), author: 'Tú', text }]);
    setText('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#081122] rounded-2xl border border-white/5 shadow-sm flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold">C</div>
          <div>
            <div className="font-medium">Chat con técnico</div>
            <div className="text-xs text-gray-400">
              {isConnected ? `Conectado a ${remoteInfo.name || remoteInfo.id}` : 'Técnico disponible'}
            </div>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map(m => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className={`flex ${m.author === 'Tú' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`${m.author === 'Tú' ? 'bg-purple-600 text-white' : 'bg-white/6 text-gray-200'} px-4 py-2 rounded-xl max-w-[70%]`}>
                <div className="text-sm">{m.text}</div>
                <div className="text-[10px] text-gray-400 mt-1 text-right">{m.author}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/6">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Escribe un mensaje..."
            className="flex-1 rounded-xl px-4 py-2 bg-white/5 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
          <button
            onClick={send}
            disabled={!isConnected}
            className={`${isConnected ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-500 cursor-not-allowed'} text-white rounded-xl px-4 py-2 flex items-center gap-2`}
          >
            <Send size={16} />
            <span className="hidden md:inline">Enviar</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
