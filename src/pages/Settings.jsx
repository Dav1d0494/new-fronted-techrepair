import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Icon from "../components/ui/Icon";

/**
 * Página: Settings
 * ----------------------------
 * En esta página puedo cambiar configuraciones del sistema
 * como modo oscuro, notificaciones, etc.
 */

const Settings = () => {
  const { settings, setSettings } = useContext(AppContext);

  const toggleDarkMode = () =>
    setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));

  const toggleNotifications = () =>
    setSettings((prev) => ({ ...prev, notifications: !prev.notifications }));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Icon name="FaCog" /> Configuración del Sistema
      </h2>

      <div className="space-y-4 bg-white p-5 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <span>Modo oscuro</span>
          <button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded-lg ${
              settings.darkMode ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {settings.darkMode ? "Activado" : "Desactivado"}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span>Notificaciones</span>
          <button
            onClick={toggleNotifications}
            className={`px-4 py-2 rounded-lg ${
              settings.notifications ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {settings.notifications ? "Activadas" : "Desactivadas"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
