import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import logo from '../assets/logo.png';

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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
    const newErrors = {};

    if (touched.name && formData.name.trim().length < 2) newErrors.name = 'Ingresa tu nombre completo';
    if (touched.email && !validateEmail(formData.email)) newErrors.email = 'Correo electronico invalido';
    if (touched.password && formData.password.length < 8) newErrors.password = 'Minimo 8 caracteres';
    if (touched.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contrasenas no coinciden';
    }

    setErrors(newErrors);
  }, [formData, touched]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = Object.keys(errors).length === 0 && formData.email && formData.password && formData.name;

    if (!isValid) {
      setTouched({ name: true, email: true, password: true, confirmPassword: true });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: formData.name });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        role: 'user',
        createdAt: new Date().toISOString(),
      });

      navigate('/home');
    } catch (error) {
      console.error(error);
      alert('No fue posible completar el registro');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          name: user.displayName || 'Usuario',
          email: user.email,
          phone: user.phoneNumber || '',
          role: 'user',
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

      navigate('/home');
    } catch (error) {
      console.error(error);
      alert('Error al iniciar sesion con Google');
    }
  };

  const inputBaseClass = `w-full pl-10 pr-10 py-3 rounded-lg border transition-all duration-200 outline-none ${
    isDark ? 'bg-slate-800 text-slate-100 border-slate-700 placeholder:text-slate-500' : 'bg-white text-gray-900 border-gray-300'
  }`;

  const getInputStateClass = (field) => {
    if (touched[field] && errors[field]) return 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20';
    if (touched[field] && !errors[field] && formData[field]) return 'border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20';
    return `${isDark ? 'border-slate-700' : 'border-gray-300'} focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20`;
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900' : 'bg-gray-50'}`}>
      <div className={`max-w-md w-full rounded-2xl shadow-xl p-8 border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-100'}`}>
        <div className="text-center mb-8">
          <img src={logo} alt="TechRepair" className="h-16 mx-auto mb-4" />
          <h2 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>Crear cuenta</h2>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Registra tus datos para comenzar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-xs font-bold uppercase mb-1 ml-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Nombre completo</label>
            <input name="name" type="text" value={formData.name} onChange={handleChange} onBlur={handleBlur} className={`${inputBaseClass} ${getInputStateClass('name')}`} placeholder="Tu nombre" required />
            {touched.name && errors.name && <p className="text-xs text-red-600 mt-1 ml-1">{errors.name}</p>}
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase mb-1 ml-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Correo</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} className={`${inputBaseClass} ${getInputStateClass('email')}`} placeholder="ejemplo@correo.com" required />
            {touched.email && errors.email && <p className="text-xs text-red-600 mt-1 ml-1">{errors.email}</p>}
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase mb-1 ml-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Telefono (opcional)</label>
            <input name="phone" type="tel" value={formData.phone} onChange={handleChange} onBlur={handleBlur} className={`${inputBaseClass} ${getInputStateClass('phone')}`} placeholder="+57 300 000 0000" />
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase mb-1 ml-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Contrasena</label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} className={`${inputBaseClass} ${getInputStateClass('password')}`} placeholder="Minimo 8 caracteres" required />
            {touched.password && errors.password && <p className="text-xs text-red-600 mt-1 ml-1">{errors.password}</p>}
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase mb-1 ml-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Confirmar contrasena</label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${inputBaseClass} ${getInputStateClass('confirmPassword')}`}
              placeholder="Repite tu contrasena"
              required
            />
            {touched.confirmPassword && errors.confirmPassword && <p className="text-xs text-red-600 mt-1 ml-1">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-[#7F00FF] text-white rounded-xl font-bold hover:bg-[#5E00CC] shadow-lg transition-all disabled:opacity-60">
            {loading ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>

        <div className="mt-6">
          <div className="mb-4 text-center">
            <span className={`text-xs uppercase tracking-wide ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>o continuar con</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className={`w-full flex items-center justify-center gap-3 py-2.5 border rounded-xl transition-all font-medium text-sm ${
              isDark ? 'border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700' : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            Google
          </button>
        </div>

        <p className={`text-center text-sm mt-8 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
          Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-purple-600 font-bold hover:underline">
            Inicia sesion
          </Link>
        </p>
      </div>
    </div>
  );
}
