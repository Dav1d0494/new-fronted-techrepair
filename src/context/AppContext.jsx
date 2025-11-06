// Importo las dependencias necesarias
import React, { createContext, useState } from "react";

/**
 * Contexto global del sistema
 * ----------------------------
 * En este archivo yo creo un contexto (AppContext) para compartir
 * información general entre varios componentes del sistema, como:
 * - Estado de conexión
 * - Historial de conexiones
 * - Configuraciones del usuario
 */

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Estado que almacena si hay conexión activa o no
  const [connected, setConnected] = useState(false);

  // Estado que guarda el historial de conexiones realizadas
  const [history, setHistory] = useState([]);

  // Estado para configuraciones del sistema (por ejemplo: tema oscuro)
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
  });

  // Función para conectar (simulada)
  const connect = (device) => {
    setConnected(true);
    setHistory((prev) => [
      ...prev,
      { device, date: new Date().toLocaleString(), status: "Conectado" },
    ]);
  };

  // Función para desconectar
  const disconnect = (device) => {
    setConnected(false);
    setHistory((prev) => [
      ...prev,
      { device, date: new Date().toLocaleString(), status: "Desconectado" },
    ]);
  };

  // Retorno el contexto con todos los valores que quiero compartir
  return (
    <AppContext.Provider
      value={{
        connected,
        connect,
        disconnect,
        history,
        settings,
        setSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
