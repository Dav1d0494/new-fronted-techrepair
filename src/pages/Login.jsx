import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importamos Link para la navegación
import { 
  signInWithEmailAndPassword, 
  signInWithRedirect, // Cambiado de Popup a Redirect para evitar errores de COOP
  GoogleAuthProvider 
} from 'firebase/auth'; 
import { auth } from '../lib/firebase';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import logoTechRepair from '../assets/logo.png'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Función para Google
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Usar redirect soluciona el error de Cross-Origin-Opener-Policy
      await signInWithRedirect(auth, provider);
    } catch (err) {
      setError('Error al conectar con Google.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate('/home'); 
    } catch (err) {
      setError('Credenciales incorrectas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        
        <div className="text-center mb-8">
          <img src={logoTechRepair} alt="Logo" className="h-16 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Bienvenido de nuevo</h2>
          <p className="text-gray-500 text-sm">Ingresa tus credenciales para continuar</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="ejemplo@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1 ml-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Contraseña</label>
              {/* ACTIVACIÓN: Enlace a recuperar contraseña */}
              <Link to="/forgot-password" size="sm" className="text-xs text-purple-600 hover:underline font-semibold">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#7F00FF] text-white rounded-xl font-bold hover:bg-[#5E00CC] shadow-lg transition-all flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t w-full border-gray-200"></div>
            <span className="bg-white px-3 text-xs text-gray-400 uppercase absolute">O continuar con</span>
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium text-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            Google
          </button>
        </div>

        {/* ACTIVACIÓN: Enlace a Registro */}
        <p className="text-center text-sm text-gray-600 mt-8">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-purple-600 font-bold hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}