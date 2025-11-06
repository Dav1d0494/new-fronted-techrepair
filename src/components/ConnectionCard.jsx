// Importo React para poder usar JSX y crear mi componente
import React from "react";
// Importo el componente de íconos que yo mismo creé
import Icon from "./ui/Icon";
// Importo mi componente Button reutilizable
import Button from "./ui/Button";

/**
 * Componente: ConnectionCard
 * ----------------------------
 * En este archivo creo una tarjeta que muestra la información de una conexión
 * (por ejemplo, un dispositivo conectado de manera remota).
 * 
 * Este componente recibe:
 * - deviceName: el nombre del dispositivo o equipo
 * - status: el estado actual de la conexión (conectado o desconectado)
 * - ipAddress: la dirección IP del dispositivo
 * - onConnect: la función que se ejecuta cuando hago clic en "Conectar"
 * - onDisconnect: la función que se ejecuta cuando hago clic en "Desconectar"
 */
const ConnectionCard = ({
  deviceName,
  status,
  ipAddress,
  onConnect,
  onDisconnect,
}) => {
  // Aquí determino si el dispositivo está conectado o no
  const isConnected = status === "conectado";

  // Defino los colores según el estado del dispositivo
  const statusColor = isConnected ? "text-green-600" : "text-red-600";
  const statusIcon = isConnected ? "FaCheckCircle" : "FaTimesCircle";

  return (
    <div
      className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center border border-gray-200 hover:shadow-lg transition-shadow duration-200"
    >
      {/* Sección izquierda con información del dispositivo */}
      <div className="flex items-center gap-4">
        {/* Ícono que representa el dispositivo */}
        <Icon name="FaDesktop" size={28} color="#3b82f6" />

        <div>
          {/* Nombre del dispositivo */}
          <h3 className="text-lg font-semibold">{deviceName}</h3>
          {/* Dirección IP */}
          <p className="text-sm text-gray-600">IP: {ipAddress}</p>
          {/* Estado de conexión */}
          <div className="flex items-center gap-2 mt-1">
            <Icon name={statusIcon} size={16} color={isConnected ? "green" : "red"} />
            <span className={`text-sm font-medium ${statusColor}`}>
              {isConnected ? "Conectado" : "Desconectado"}
            </span>
          </div>
        </div>
      </div>

      {/* Sección derecha con los botones de acción */}
      <div className="flex gap-2">
        {/* Si el dispositivo está conectado, muestro botón de desconectar */}
        {isConnected ? (
          <Button variant="danger" onClick={onDisconnect}>
            <Icon name="FaPlug" size={16} /> Desconectar
          </Button>
        ) : (
          // Si está desconectado, muestro botón de conectar
          <Button variant="primary" onClick={onConnect}>
            <Icon name="FaLink" size={16} /> Conectar
          </Button>
        )}
      </div>
    </div>
  );
};

// Exporto el componente para usarlo en otras partes del proyecto
export default ConnectionCard;
