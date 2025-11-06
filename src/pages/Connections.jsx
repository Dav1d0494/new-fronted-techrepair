import React, { useState } from 'react';
import ChatResizable from '../components/ui/ChatResizable';
import { Copy, MessageSquare } from 'lucide-react';

const Connections = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'Carlos Mendoza',
      text: 'Hola, soy Carlos Mendoza. ¿En qué puedo ayudarte hoy?',
      isUser: false
    },
    {
      id: 2,
      user: 'Tú',
      text: 'Hola Carlos, mi impresora no funciona correctamente.',
      isUser: true
    },
    {
      id: 3,
      user: 'Carlos Mendoza',
      text: 'Entendido. Por favor, comparte el código de acceso de arriba para que pueda empezar a diagnosticar el problema.',
      isUser: false
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      user: 'Tú',
      text: inputText.trim(),
      isUser: true
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        user: 'Carlos Mendoza',
        text: 'Recibido. Déjame revisar eso.',
        isUser: false
      }]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyAccessCode = () => {
    navigator.clipboard.writeText('808 544 541');
    alert('Código copiado al portapapeles');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
            T
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">TechRepair Cliente</h1>
            <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded">
              V 4.5.0
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="text-gray-600 font-medium">OFFLINE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-center mb-4">Su Código de Acceso Remoto</h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              Comparta este código con el técnico para iniciar la sesión
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-center">
              <div className="flex items-center justify-center mb-4 text-purple-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-gray-800 tracking-wider">
                808 544 541
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={copyAccessCode}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
              >
                <Copy size={18} />
                Copiar Código
              </button>
              <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2">
                <MessageSquare size={18} />
                Enviar Vía Chat
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 className="text-lg font-bold">Permisos de Acceso</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">Compartir Pantalla</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  <span className="text-sm font-medium">Control de Teclado</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  <span className="text-sm font-medium">Control de Mouse</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Puede activar o desactivar estos permisos en cualquier momento durante la sesión.
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-red-500 text-white p-4">PRUEBA - SI VES ESTO, EL ARCHIVO SE ESTÁ LEYENDO</div>
<ChatResizable title="Chat con Carlos Mendoza">
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg shadow-sm ${
                        msg.isUser
                          ? 'bg-purple-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 rounded-tl-none border'
                      }`}
                    >
                      <div className="font-medium text-xs opacity-75 mb-1">
                        {msg.user}
                      </div>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t bg-white rounded-b-xl">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={inputText.trim() === ''}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </ChatResizable>
        </div>
      </div>
    </div>
  );
};

export default Connections;