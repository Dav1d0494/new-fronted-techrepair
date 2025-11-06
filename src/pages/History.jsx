import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Icon from "../components/ui/Icon";

/**
 * Página: History
 * ----------------------------
 * En esta página muestro el historial de conexiones realizadas.
 * Puedo visualizar cuándo y con qué dispositivo me conecté.
 */

const History = () => {
  const { history } = useContext(AppContext);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Icon name="FaHistory" /> Historial de Conexiones
      </h2>

      {history.length === 0 ? (
        <p className="text-gray-500">Aún no hay registros en el historial.</p>
      ) : (
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-2 px-4 text-left">Dispositivo</th>
              <th className="py-2 px-4 text-left">Fecha</th>
              <th className="py-2 px-4 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{item.device}</td>
                <td className="py-2 px-4">{item.date}</td>
                <td
                  className={`py-2 px-4 font-semibold ${
                    item.status === "Conectado"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default History;
