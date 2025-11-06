// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/*
  Yo: Login falso para pruebas.
  - Si envío el formulario llamo a navigate("/dashboard").
  - No hay validación contra un backend (opción B).
*/
export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // Aquí simulo el login: navego al dashboard
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <img src="/src/assets/logo.png" alt="Logo TechRepair" className="w-10 h-10" />
          <h1 className="text-2xl font-semibold text-purple-700">TechRepair</h1>
        </div>

        <h2 className="text-lg font-medium text-gray-700 mb-4">Inicia sesión</h2>
        <p className="text-sm text-gray-500 mb-6">Accede para ver solicitudes y equipos reparados.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Usuario</label>
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="ej: tecnico01"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Contraseña</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-medium shadow"
          >
            Ingresar
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-6 text-center">Versión 1.0.0</p>
      </div>
    </div>
  );
}
