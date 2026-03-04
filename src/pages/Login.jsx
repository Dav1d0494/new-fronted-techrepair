import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithRedirect } from "firebase/auth";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { auth } from "../lib/firebase";
import logoTechRepair from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const resolveTheme = () => {
    if (typeof window === "undefined") return false;

    // Prioridad: modo por rol -> tema global -> preferencia del sistema.
    const appMode = localStorage.getItem("app_theme_mode");
    const adminMode = localStorage.getItem("admin_theme_mode");
    const techMode = localStorage.getItem("tech_theme_mode");
    const clientMode = localStorage.getItem("client_theme_mode");
    const roleMode = appMode || adminMode || techMode || clientMode;

    if (roleMode === "dark") return true;
    if (roleMode === "light") return false;
    if (roleMode === "auto") {
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    const globalTheme = localStorage.getItem("theme");
    if (globalTheme === "dark") return true;
    if (globalTheme === "light") return false;

    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const [isDark, setIsDark] = useState(resolveTheme);

  useEffect(() => {
    const applyTheme = (dark) => {
      document.documentElement.classList.toggle("dark", dark);
      localStorage.setItem("theme", dark ? "dark" : "light");
    };

    const sync = () => {
      const next = resolveTheme();
      setIsDark(next);
      applyTheme(next);
    };

    sync();

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onMedia = () => {
      const anyAuto =
        localStorage.getItem("app_theme_mode") === "auto" ||
        localStorage.getItem("admin_theme_mode") === "auto" ||
        localStorage.getItem("tech_theme_mode") === "auto" ||
        localStorage.getItem("client_theme_mode") === "auto";
      if (anyAuto) sync();
    };

    const onStorage = () => sync();

    if (media.addEventListener) media.addEventListener("change", onMedia);
    else media.addListener(onMedia);
    window.addEventListener("storage", onStorage);

    return () => {
      if (media.removeEventListener) media.removeEventListener("change", onMedia);
      else media.removeListener(onMedia);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (err) {
      setError("Error al conectar con Google.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const cleanEmail = email.trim();
    const normalizedEmail = cleanEmail.replace(/ñ/g, "n").replace(/Ñ/g, "N");
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      navigate("/home");
    } catch (err) {
      // Fallback para emails ingresados con ñ en la parte local
      if (normalizedEmail !== cleanEmail) {
        try {
          await signInWithEmailAndPassword(auth, normalizedEmail, password);
          navigate("/home");
          return;
        } catch (fallbackErr) {
          setError("Credenciales incorrectas.");
        }
      } else {
        setError("Credenciales incorrectas.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900" : "bg-gradient-to-br from-gray-50 via-white to-gray-100"}`}>
      <div className="pointer-events-none absolute inset-0">
        <div className={`absolute -top-20 -left-16 h-72 w-72 rounded-full blur-3xl ${isDark ? "bg-[#7F00FF]/20" : "bg-[#7F00FF]/10"}`} />
        <div className={`absolute -bottom-20 -right-10 h-72 w-72 rounded-full blur-3xl ${isDark ? "bg-[#7F00FF]/20" : "bg-[#7F00FF]/10"}`} />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className={`w-full max-w-md rounded-3xl border backdrop-blur shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] overflow-hidden ${isDark ? "border-slate-700/80 bg-slate-900/90" : "border-gray-200/80 bg-white/95"}`}>
          <section className="p-6 sm:p-8">
            <div className="text-center">
              <img src={logoTechRepair} alt="TechRepair" className="mx-auto mb-4 object-contain rounded-xl" style={{ width: 64, height: 64 }} />
              <p className={`text-xs font-semibold uppercase tracking-widest ${isDark ? "text-slate-400" : "text-gray-400"}`}>Acceso seguro</p>
              <h1 className={`mt-2 text-3xl font-semibold ${isDark ? "text-slate-100" : "text-[#333333]"}`}>Iniciar sesion</h1>
              <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>Ingresa tus credenciales para continuar en TechRepair.</p>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className={`mb-1.5 block text-xs font-semibold tracking-wide ${isDark ? "text-slate-200" : "text-[#333333]"}`}>Correo electronico</label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-3.5 ${isDark ? "text-slate-500" : "text-gray-400"}`} size={17} />
                  <input
                    type="text"
                    inputMode="email"
                    autoComplete="email"
                    spellCheck={false}
                    className={`w-full rounded-xl border py-3 pl-10 pr-3 outline-none transition-all duration-200 focus:border-[#7F00FF] focus:ring-2 focus:ring-[#7F00FF]/20 ${isDark ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:bg-slate-800" : "border-gray-200 bg-gray-50 text-[#333333] placeholder:text-gray-400 focus:bg-white"}`}
                    placeholder="ejemplo@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label className={`text-xs font-semibold tracking-wide ${isDark ? "text-slate-200" : "text-[#333333]"}`}>Contrasena</label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-[#7F00FF] hover:text-[#5E00CC] transition-colors">
                    Olvidaste tu contrasena?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className={`absolute left-3 top-3.5 ${isDark ? "text-slate-500" : "text-gray-400"}`} size={17} />
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full rounded-xl border py-3 pl-10 pr-10 outline-none transition-all duration-200 focus:border-[#7F00FF] focus:ring-2 focus:ring-[#7F00FF]/20 ${isDark ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:bg-slate-800" : "border-gray-200 bg-gray-50 text-[#333333] placeholder:text-gray-400 focus:bg-white"}`}
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className={`absolute right-3 top-3 transition-colors ${isDark ? "text-slate-500 hover:text-slate-200" : "text-gray-400 hover:text-[#333333]"}`}
                    aria-label="Mostrar u ocultar contrasena"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center rounded-xl py-3.5 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all duration-200 hover:brightness-95 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                style={{ backgroundColor: "#7F00FF" }}
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Iniciar sesion"}
              </button>
            </form>

            <div className="mt-6">
              <div className="mb-4 text-center">
                <span className={`text-xs uppercase tracking-wide ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                  o continuar con
                </span>
              </div>

              <button
                onClick={handleGoogleLogin}
                type="button"
                className={`w-full rounded-xl border py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.995] ${isDark ? "border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700" : "border-gray-200 bg-white text-[#333333] hover:bg-gray-50 hover:border-gray-300"}`}
              >
                <span className="inline-flex items-center gap-2">
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-5 w-5" alt="Google" />
                  Google
                </span>
              </button>
            </div>

            <p className={`mt-6 text-center text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              No tienes una cuenta?{" "}
              <Link to="/register" className="font-semibold text-[#7F00FF] hover:text-[#5E00CC] transition-colors">
                Registrate aqui
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
