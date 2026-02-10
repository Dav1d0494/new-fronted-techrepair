import React, { useState, useEffect } from 'react';
import { auth } from '../lib';
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

  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    if (!oobCode) {
      setStatus('error');
      setError('El enlace de recuperación es inválido o ha expirado.');
      return;
    }

    // Verificar si el código de Firebase es válido antes de mostrar el formulario
    verifyPasswordResetCode(auth, oobCode)
      .then(() => setStatus('ready'))
      .catch(() => {
        setStatus('error');
        setError('El enlace ha expirado o ya fue utilizado.');
      });
  }, [oobCode]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setError('Las contraseñas no coinciden.');
    }
    if (newPassword.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres.');
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setStatus('success');
      setTimeout(() => navigate('/login'), 5000); // Redirigir tras 5 segundos
    } catch (err) {
      setError('No se pudo restablecer la contraseña. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-[450px] w-full bg-white rounded-3xl shadow-2xl shadow-purple-900/5 border border-gray-100 p-8 sm:p-10">
        <div className="text-center">
          <img src={logo} alt="Logo" className="w-20 h-20 mx-auto mb-6 object-contain" />
          
          {status === 'verifying' && <p className="text-gray-500 animate-pulse font-bold">Verificando enlace...</p>}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="flex justify-center text-red-500"><AlertCircle size={48} /></div>
              <h2 className="text-xl font-black text-gray-900">Enlace inválido</h2>
              <p className="text-gray-500 text-sm">{error}</p>
              <Link to="/login" className="block w-full bg-purple-600 text-white font-bold py-3 rounded-xl mt-4">Volver al inicio</Link>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="flex justify-center text-green-500"><CheckCircle2 size={48} /></div>
              <h2 className="text-2xl font-black text-gray-900">¡Contraseña Cambiada!</h2>
              <p className="text-gray-500 text-sm">Tu contraseña ha sido actualizada con éxito. Serás redirigido al login en unos segundos.</p>
              <Link to="/login" className="block text-purple-600 font-bold hover:underline">Ir al Login ahora</Link>
            </div>
          )}

          {status === 'ready' && (
            <>
              <h1 className="text-2xl font-black text-gray-900 mb-2">Nueva Contraseña</h1>
              <p className="text-gray-500 text-sm mb-8 font-medium">Crea una clave segura para tu cuenta de TechRepair.</p>

              {error && <p className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-bold rounded-lg">{error}</p>}

              <form onSubmit={handleReset} className="space-y-5 text-left">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Nueva Contraseña</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-purple-600" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all font-medium"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Confirmar Contraseña</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all font-medium"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 transition-all active:scale-95">
                  Restablecer Contraseña
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}