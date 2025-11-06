import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Icon from "../components/ui/Icon";

/**
 * Página: Home
 * ----------------------------
 * Aquí muestro la pantalla principal del sistema TechRepair.
 * Presento un resumen del estado actual y accesos rápidos.
 */

const Home = () => {
  const { connected, history } = useContext(AppContext);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <Icon name="FaHome" /> Bienvenido a TechRepair
      </h1>

      <p className="text-gray-600 mb-6">
        En este panel puedo visualizar el estado general del sistema de
        mantenimiento remoto y acceder a las funciones principales.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-2">Estado de conexión</h3>
          <p
            className={`font-bold ${
              connected ? "text-green-600" : "text-red-600"
            }`}
          >
            {connected ? "Conectado" : "Desconectado"}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-2">Historial reciente</h3>
          <p className="text-gray-700">
            {history.length === 0
              ? "Sin registros todavía."
              : `Última acción: ${history[history.length - 1].status} en ${
                  history[history.length - 1].device
                }`}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-2">Versión del sistema</h3>
          <p className="text-gray-700">TechRepair v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
