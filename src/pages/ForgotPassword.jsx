import React, { useEffect, useState } from 'react';
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
  const [isDark, setIsDark] = useState(false);

  const resolveTheme = () => {
    if (typeof window === 'undefined') return false;
    const appMode = localStorage.getItem('app_theme_mode');
    const adminMode = localStorage.getItem('admin_theme_mode');
    const techMode = localStorage.getItem('tech_theme_mode');
    const clientMode = localStorage.getItem('client_theme_mode');
    const roleMode = appMode || adminMode || techMode || clientMode;

    if (roleMode === 'dark') return true;
    if (roleMode === 'light') return false;
    if (roleMode === 'auto') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    const globalTheme = localStorage.getItem('theme');
    if (globalTheme === 'dark') return true;
    if (globalTheme === 'light') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  useEffect(() => {
    const sync = () => {
      const next = resolveTheme();
      setIsDark(next);
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('theme', next ? 'dark' : 'light');
    };

    sync();

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onMedia = () => {
      const anyAuto =
        localStorage.getItem('app_theme_mode') === 'auto' ||
        localStorage.getItem('admin_theme_mode') === 'auto' ||
        localStorage.getItem('tech_theme_mode') === 'auto' ||
        localStorage.getItem('client_theme_mode') === 'auto';
      if (anyAuto) sync();
    };

    if (media.addEventListener) media.addEventListener('change', onMedia);
    else media.addListener(onMedia);

    return () => {
      if (media.removeEventListener) media.removeEventListener('change', onMedia);
      else media.removeListener(onMedia);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const actionCodeSettings = {
      url: 'http://localhost:5173/reset-password',
      handleCodeInApp: true,
    };

    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setMessage('Enlace enviado. Revisa tu bandeja de entrada y la carpeta de spam.');
    } catch (err) {
      console.error('Error de Firebase:', err.code);
      if (err.code === 'auth/user-not-found') {
        setError('No existe una cuenta registrada con este correo electronico.');
      } else if (err.code === 'auth/invalid-email') {
        setError('El formato del correo no es valido.');
      } else {
        setError('Hubo un problema al enviar el correo. Intentalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900' : 'bg-[#F8FAFC]'}`}>
      <div className={`max-w-[450px] w-full rounded-3xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-700 shadow-2xl shadow-black/30' : 'bg-white border-gray-100 shadow-2xl shadow-purple-900/5'}`}>
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <img src={logo} alt="TechRepair Logo" className="w-20 h-20 mx-auto mb-6 object-contain drop-shadow-lg" />
            <h1 className={`text-2xl font-black ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>Olvidaste tu contrasena?</h1>
            <p className={`mt-3 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              Ingresa tu correo y te enviaremos un enlace magico para recuperarla.
            </p>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm font-bold rounded-r-xl flex items-center gap-3">
              <CheckCircle2 size={20} />
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded-r-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-bold mb-2 ml-1 ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>Correo Electronico</label>
              <div className="relative group">
                <Mail className={`absolute left-4 top-3.5 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-purple-400' : 'text-gray-400 group-focus-within:text-purple-600'}`} size={20} />
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className={`w-full pl-12 pr-4 py-3.5 border rounded-xl outline-none transition-all font-medium ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500'
                      : 'bg-gray-50/50 border-gray-200 text-gray-700 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 focus:bg-white'
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || message}
              className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                isDark ? 'shadow-lg shadow-purple-900/40' : 'shadow-lg shadow-purple-200'
              } ${loading || message ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Enviando...' : <><Send size={18} /> Enviar enlace de recuperacion</>}
            </button>
          </form>

          <div className={`mt-10 text-center pt-6 ${isDark ? 'border-t border-slate-800' : 'border-t border-gray-50'}`}>
            <Link
              to="/login"
              className={`inline-flex items-center gap-2 text-sm font-bold transition-colors group ${isDark ? 'text-slate-400 hover:text-purple-400' : 'text-gray-400 hover:text-purple-600'}`}
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Volver al inicio de sesion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
