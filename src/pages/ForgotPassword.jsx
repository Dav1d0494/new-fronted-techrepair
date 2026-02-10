import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import logo from '../assets/logo.png';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    // CONFIGURACIÓN CRÍTICA: Indica a dónde debe saltar el usuario al hacer clic en el correo
    const actionCodeSettings = {
      // Esta URL debe coincidir con la ruta que creamos en App.jsx
      url: 'http://localhost:5173/reset-password', 
      handleCodeInApp: true,
    };

    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setMessage('¡Enlace enviado! Revisa tu bandeja de entrada y la carpeta de spam.');
    } catch (err) {
      console.error("Error de Firebase:", err.code);
      if (err.code === 'auth/user-not-found') {
        setError('No existe una cuenta registrada con este correo electrónico.');
      } else if (err.code === 'auth/invalid-email') {
        setError('El formato del correo no es válido.');
      } else {
        setError('Hubo un problema al enviar el correo. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-[450px] w-full bg-white rounded-3xl shadow-2xl shadow-purple-900/5 border border-gray-100 overflow-hidden">
        <div className="p-8 sm:p-10">
          
          {/* Logo */}
          <div className="text-center mb-8">
            <img 
              src={logo} 
              alt="TechRepair Logo" 
              className="w-20 h-20 mx-auto mb-6 object-contain drop-shadow-lg"
            />
            <h1 className="text-2xl font-black text-gray-900">¿Olvidaste tu contraseña?</h1>
            <p className="text-gray-500 mt-3 text-sm font-medium">
              Ingresa tu correo y te enviaremos un enlace mágico para recuperarla.
            </p>
          </div>

          {/* Mensaje de Éxito */}
          {message && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm font-bold rounded-r-xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 size={20} />
              {message}
            </div>
          )}

          {/* Mensaje de Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded-r-xl animate-bounce">
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">Correo Electrónico</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 focus:bg-white outline-none transition-all font-medium text-gray-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || message}
              className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] ${loading || message ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Enviando...' : (
                <><Send size={18} /> Enviar enlace de recuperación</>
              )}
            </button>
          </form>

          {/* Enlace de retorno */}
          <div className="mt-10 text-center border-t border-gray-50 pt-6">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-purple-600 transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              Volver al inicio de sesión
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}