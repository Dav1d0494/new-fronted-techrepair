import React, { useState } from 'react';
import { Copy, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccessCodeCard({ code = '808 544 541', onConnect, isConnected }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // ignore
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#081122] rounded-2xl p-8 border border-white/5 shadow-md">
      <h2 className="text-2xl font-bold">Su Código de Acceso</h2>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xl">
        Comparta este código con el técnico para iniciar la sesión remota.
      </p>

      <div className="mt-6 flex items-center gap-4">
        <div className="rounded-lg bg-gradient-to-br from-gray-100/40 to-gray-200/10 dark:from-white/6 dark:to-white/3 px-6 py-4 shadow-inner border border-white/3">
          <div className="text-5xl font-extrabold tracking-widest text-gray-900 dark:text-white">{code}</div>
        </div>

        <div className="flex flex-col gap-3">
          <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-shadow shadow-sm">
            <Copy size={16} /> {copied ? 'Copiado' : 'Copiar Código'}
          </button>
          <button onClick={onConnect} disabled={isConnected} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 dark:bg-gray-700 hover:brightness-105 text-white transition disabled:opacity-60">
            <MessageSquare size={16} /> {isConnected ? 'Conectado' : 'Conectar con técnico'}
          </button>
        </div>
      </div>
    </motion.div>
);
}
