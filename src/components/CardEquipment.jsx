// src/components/CardEquipment.jsx
import React from "react";

/*
  Yo: CardEquipment muestra la info de un equipo y los botones de acción.
  Props:
    - item: { id, name, owner, status }  status: "pending" | "inprogress" | "repaired"
    - onConnect(id)  -> función para simular conectar
    - onFinish(id)   -> marcar como reparado
*/
export default function CardEquipment({ item, onConnect, onFinish }) {
  const statusStyles = {
    pending: "bg-purple-50 border-purple-200 text-purple-800",
    inprogress: "bg-blue-50 border-blue-200 text-blue-800",
    repaired: "bg-green-50 border-green-200 text-green-800",
  };

  return (
    <article className={`border rounded-lg p-4 ${statusStyles[item.status] ?? statusStyles.pending}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-600">Propietario: {item.owner}</p>
          <p className="text-xs mt-2 inline-block px-2 py-1 rounded text-sm font-medium">
            {item.status === "pending" && "Pendiente"}
            {item.status === "inprogress" && "En proceso"}
            {item.status === "repaired" && "Reparado"}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => onConnect(item.id)}
            className="px-3 py-1 rounded bg-white border text-purple-700 text-sm shadow-sm hover:bg-purple-50"
          >
            Conectar
          </button>
          <button
            onClick={() => onFinish(item.id)}
            className="px-3 py-1 rounded bg-white border text-gray-700 text-sm shadow-sm hover:bg-gray-50"
          >
            Finalizar
          </button>
        </div>
      </div>
    </article>
  );
}
