import React, { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.png';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('verifying'); // verifying, ready, success, error
  const [error, setError] = useState('');
  const [isDark, setIsDark] = useState(false);

  const oobCode = searchParams.get('oobCode');

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

  useEffect(() => {
    if (!oobCode) {
      setStatus('error');
      setError('El enlace de recuperacion es invalido o ha expirado.');
      return;
    }

    verifyPasswordResetCode(auth, oobCode)
      .then(() => setStatus('ready'))
      .catch(() => {
        setStatus('error');
        setError('El enlace ha expirado o ya fue utilizado.');
      });
  }, [oobCode]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return setError('Las contrasenas no coinciden.');
    if (newPassword.length < 6) return setError('La contrasena debe tener al menos 6 caracteres.');

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setStatus('success');
      setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
      setError('No se pudo restablecer la contrasena. Intentalo de nuevo.');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900' : 'bg-[#F8FAFC]'}`}>
      <div className={`max-w-[450px] w-full rounded-3xl border p-8 sm:p-10 ${isDark ? 'bg-slate-900 border-slate-700 shadow-2xl shadow-black/30' : 'bg-white border-gray-100 shadow-2xl shadow-purple-900/5'}`}>
        <div className="text-center">
          <img src={logo} alt="Logo" className="w-20 h-20 mx-auto mb-6 object-contain" />

          {status === 'verifying' && <p className={`animate-pulse font-bold ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Verificando enlace...</p>}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="flex justify-center text-red-500"><AlertCircle size={48} /></div>
              <h2 className={`text-xl font-black ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>Enlace invalido</h2>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{error}</p>
              <Link to="/login" className="block w-full bg-purple-600 text-white font-bold py-3 rounded-xl mt-4">Volver al inicio</Link>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="flex justify-center text-green-500"><CheckCircle2 size={48} /></div>
              <h2 className={`text-2xl font-black ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>Contrasena cambiada</h2>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Tu contrasena fue actualizada. Seras redirigido al login en unos segundos.</p>
              <Link to="/login" className="block text-purple-600 font-bold hover:underline">Ir al login ahora</Link>
            </div>
          )}

          {status === 'ready' && (
            <>
              <h1 className={`text-2xl font-black mb-2 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>Nueva contrasena</h1>
              <p className={`text-sm mb-8 font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Crea una clave segura para tu cuenta de TechRepair.</p>

              {error && <p className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-bold rounded-lg">{error}</p>}

              <form onSubmit={handleReset} className="space-y-5 text-left">
                <div>
                  <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>Nueva contrasena</label>
                  <div className="relative group">
                    <Lock className={`absolute left-4 top-3.5 ${isDark ? 'text-slate-500 group-focus-within:text-purple-400' : 'text-gray-400 group-focus-within:text-purple-600'}`} size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="********"
                      className={`w-full pl-12 pr-12 py-3.5 border rounded-xl outline-none transition-all font-medium ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500'
                          : 'bg-gray-50 border-gray-200 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500'
                      }`}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-4 top-3.5 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>Confirmar contrasena</label>
                  <input
                    type="password"
                    placeholder="********"
                    className={`w-full px-4 py-3.5 border rounded-xl outline-none transition-all font-medium ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500'
                        : 'bg-gray-50 border-gray-200 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500'
                    }`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all active:scale-95 ${isDark ? 'shadow-lg shadow-purple-900/40' : 'shadow-lg shadow-purple-200'}`}>
                  Restablecer contrasena
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
